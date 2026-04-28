-- =============================================================================
-- Verbatim.ai · 0002_clerk_bootstrap.sql
-- -----------------------------------------------------------------------------
-- Feature 1 follow-up: Clerk stores user IDs as TEXT (e.g. user_2abc...), not
-- UUIDs. Adds an idempotent SECURITY DEFINER RPC used by the Clerk webhook to
-- create org + user + default project in a single transaction.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1) Align users.id with Clerk (TEXT). Fix FK from llm_calls.user_id.
-- ---------------------------------------------------------------------------

alter table llm_calls drop constraint if exists llm_calls_user_id_fkey;

alter table llm_calls
  alter column user_id type text using (
    case when user_id is null then null else user_id::text end
  );

alter table users
  alter column id type text using id::text;

alter table llm_calls
  add constraint llm_calls_user_id_fkey
  foreign key (user_id) references users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- 2) Tenant helper — Clerk JWT `sub` claim holds the Clerk user id string when
--    Supabase is configured for Clerk-issued tokens.
-- ---------------------------------------------------------------------------

create or replace function current_org_id() returns uuid
  language sql stable security definer
  set search_path = public
as $$
  select u.org_id
  from users u
  where u.id = coalesce(
    nullif(auth.jwt()->>'sub', ''),
    nullif(auth.uid()::text, '')
  )
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- 3) Atomic bootstrap — single transaction via PL/pgSQL function.
-- ---------------------------------------------------------------------------

create or replace function public.bootstrap_clerk_user(
  p_clerk_user_id text,
  p_email text,
  p_first_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_org uuid;
  v_org_id uuid;
  v_org_name text;
  v_first text;
  v_email text;
begin
  v_email := lower(trim(p_email));

  if exists (select 1 from users where id = p_clerk_user_id) then
    select org_id into v_existing_org
    from users
    where id = p_clerk_user_id
    limit 1;

    return v_existing_org;
  end if;

  v_first := nullif(trim(p_first_name), '');
  if v_first is null then
    v_org_name := 'My Org';
  else
    v_org_name := v_first || '''s Org';
  end if;

  insert into orgs (name)
  values (v_org_name)
  returning id into v_org_id;

  insert into users (id, org_id, email, name, role)
  values (
    p_clerk_user_id,
    v_org_id,
    v_email,
    v_first,
    'owner'
  );

  insert into projects (org_id, name)
  values (v_org_id, 'First Project');

  return v_org_id;
end;
$$;

revoke all on function public.bootstrap_clerk_user(text, text, text) from public;
grant execute on function public.bootstrap_clerk_user(text, text, text) to service_role;

commit;

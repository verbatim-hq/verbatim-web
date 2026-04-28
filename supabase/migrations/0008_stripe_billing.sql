-- =============================================================================
-- Verbatim.ai · 0008_stripe_billing.sql
-- -----------------------------------------------------------------------------
-- Feature 8: Stripe billing + tiering.
--
-- Adds `tier` to orgs and enforces uniqueness for Stripe identifiers.
-- RLS policies remain unchanged (webhook updates via service_role).
-- =============================================================================

begin;

alter table orgs
  add column if not exists tier text not null default 'free'
    check (tier in ('free','pro'));

-- These columns already exist in the Blueprint schema, but we enforce uniqueness
-- via partial unique indexes (nulls allowed).
create unique index if not exists orgs_stripe_customer_id_key
  on orgs (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists orgs_stripe_subscription_id_key
  on orgs (stripe_subscription_id)
  where stripe_subscription_id is not null;

commit;


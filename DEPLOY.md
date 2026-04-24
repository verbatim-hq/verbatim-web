# Deploy — Day 1 (Thursday, April 23, 2026)

Your one goal today: `https://app.joinverbatim.com` loads the app shell.

Time budget: **30 minutes** end to end.

---

## 0. Prereqs (confirm you have these, per your recent updates)

- [x] GitHub org `Verbatim` exists
- [x] Porkbun owns `joinverbatim.com`
- [x] Vercel account linked to the GitHub org
- [x] Landing page already deployed at `joinverbatim.com` (apex)

---

## 1. Push the scaffold to GitHub

```bash
# From the extracted folder
cd verbatim
git init
git add .
git commit -m "feat: day-1 scaffold — next 15 app router, brand shell, prompt library, schema"

# Create repo on GitHub under the Verbatim org (empty, no README)
#   → github.com/Verbatim/web
git remote add origin git@github.com:Verbatim/web.git
git branch -M main
git push -u origin main
```

---

## 2. Import to Vercel

1. Go to **vercel.com/new**.
2. Select the `Verbatim/web` repo.
3. **Framework preset:** Next.js (auto-detected).
4. **Root directory:** `./`
5. **Build command:** default (`next build`).
6. **Environment variables:** paste only this one for Day 1:
   ```
   NEXT_PUBLIC_APP_URL=https://app.joinverbatim.com
   ```
7. Click **Deploy**. First build should succeed in ~60 seconds.
8. You'll get a preview URL like `verbatim-web.vercel.app`. Open it — you should see the brand shell.

---

## 3. Wire the subdomain on Porkbun

1. In **Vercel → Project → Settings → Domains**, add: `app.joinverbatim.com`.
2. Vercel will show you a CNAME target (usually `cname.vercel-dns.com`).
3. In **Porkbun → DNS for joinverbatim.com**, add:
   - **Type:** CNAME
   - **Host:** `app`
   - **Answer:** `cname.vercel-dns.com`
   - **TTL:** 600
4. Save. Propagation is typically under 2 minutes on Porkbun.
5. Back in Vercel, wait for the green checkmark next to `app.joinverbatim.com`. Auto-HTTPS kicks in right after.

---

## 4. Smoke test

Open these three URLs and eyeball them:

- `https://app.joinverbatim.com` → brand shell with "Building · Summer 2026" pill
- `https://app.joinverbatim.com/api/health` → `{"status":"ok", ...}`
- `https://app.joinverbatim.com/sign-in` → placeholder sign-in page

If all three render, **Day 1 is done.** Close the laptop.

---

## 5. Commit the Day-1 milestone

Add a note in your Notion HQ Daily Log (`Apr 23 2026` row):

> **Day 1 · Foundation.** Scaffold pushed, deployed, subdomain live at `app.joinverbatim.com`. Engineering principles codified in `CONTRIBUTING.md`. Prompt library v1.0.0 seeded. Migration 0001 ready for tomorrow. Health check green.

Also update the Roadmap v1 status:
- `W1D1 scaffold + deploy` → ✅ Done

---

## Tomorrow (Friday · Day 2)

1. Create Supabase project in the Verbatim org (region: US East)
2. Copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars
3. Open Supabase SQL Editor → paste `/supabase/migrations/0001_init.sql` → Run
4. Confirm RLS policies all show "ENABLED" in Table Editor
5. Confirm the `interviews` storage bucket exists and is **not** public
6. Apply for Anthropic Startup credits (last thing on your credit list — form takes 20 min)

See `VERBATIM_V1_BLUEPRINT.md` §8 for the full week plan.

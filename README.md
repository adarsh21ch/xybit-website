# Xybit Website

Mobile-first marketing landing page for xybitfunds.com, plus a password-protected
admin dashboard so the offer, coupon code and logo can be changed without a
redeploy. Redirect-only: this site does not process payment or provision
accounts itself — every "Get Funded" button sends the visitor to the URL set
in **Redirect URL** in the admin dashboard.

## Stack

- **Astro** (static output) — zero JS by default, fast on mobile data
- **Tailwind CSS**
- **Supabase** — one `site_settings` row (logo, discount %, coupon, offer end
  date, redirect URL, headline/subheadline, trust-bar stats) + a `branding`
  storage bucket for the logo file, and Supabase Auth for the admin login
- **Vercel** — deploy target

## 1. Connect Supabase

1. In your Supabase project, open **SQL Editor → New query**, paste the
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates the `site_settings` table (seeded with the 40% launch
   defaults), a public `branding` storage bucket for the logo, and the Row
   Level Security policies (public read, logged-in-admin write).
2. Create the admin login account: **Authentication → Users → Add user**,
   enter the admin's email, and either set a password directly or use
   **Send invite** so they set their own. Nobody needs to type a password
   into a chat or a file for this — Supabase handles it.
3. Copy `.env.example` to `.env` and fill in:
   - `PUBLIC_SUPABASE_URL` — your project URL
   - `PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API → `anon` `public` key

   Both of these are meant to be public/client-side — that's what "anon"
   means in Supabase. **Never** put the `service_role` key in this project;
   it isn't needed anywhere here and it bypasses Row Level Security.

## 2. Local development

```bash
npm install
npm run dev       # http://localhost:4321
```

`/admin/login` → log in with the account you created in step 1 →
`/admin/dashboard` to edit branding, the discount %, coupon code, offer end
date, redirect URL, homepage copy and trust-bar stats. Changes save straight
to Supabase and show up on the live site immediately — no rebuild needed,
because the public pages read settings client-side on every page load.

## 3. Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this from the
   repo).
2. In Vercel: **Add New → Project → Import** this repo. Vercel auto-detects
   Astro — no config needed.
3. Add the two environment variables from your `.env` under **Project
   Settings → Environment Variables** (Production + Preview).
4. Deploy. Then **Project Settings → Domains** → add `xybitfunds.com` and
   follow Vercel's DNS instructions.

## What's editable vs. what's structural

**Editable from `/admin/dashboard` (no code changes needed):**
logo, discount %, coupon code, offer end date, signup redirect URL, hero
headline/subheadline, and the four trust-bar stats.

**Structural (needs a code change + redeploy):** account-size tiers and
their base prices/profit-splits (`src/components/Plans.astro`), FAQ
questions, testimonial content, page copy outside the hero. This split was
deliberate — the things a launch campaign actually needs to change day-to-day
are in the dashboard; the page structure isn't, so nobody can accidentally
break the layout from a text field.

## Before this goes live

Everything tagged **`placeholder`** on the page is fake and needs a real
value from the admin dashboard before launch:

- Trust-bar stats and the hero's "paid out this month" figure
- The three payout/testimonial cards in the Payouts section (real trader
  handles, amounts, and screenshots — swap the empty avatar circles for real
  images via the same Supabase `branding` bucket pattern used for the logo)
- Two FAQ answers (EA/copy-trading policy, eligible countries) are stubbed
  with `[Placeholder — ...]` text directly in `src/components/FAQ.astro`
- The **Redirect URL** field — must point at your real checkout/signup
  platform before this is truly "redirect-only and done"
- Legal footer links (Terms, Risk Disclosure, Refund Policy, Privacy) are
  placeholder `#`/`/` anchors — point them at real pages before launch

## Known housekeeping item

`npm audit` flags CVEs in this Astro 4.x line, fixed only in Astro 7. They're
concentrated in the dev server, middleware, server-islands and AVIF image
optimization — none of which this site uses (it's `output: "static"`, no
middleware, no `<Image>` component). Not urgent, but worth a deliberate,
tested upgrade to Astro 7 before this has been live a long time.

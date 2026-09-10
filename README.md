# Xybit Coupon Landing Page

A single-purpose landing page for paid traffic. Someone clicks an ad, lands
here, sees the discount, copies the coupon code, and goes to
**xybitfunds.com** to buy an account and apply it at checkout.

That's the whole job. There is deliberately **no** pricing table, payout
proof, trading rules or FAQ here — that content lives on the main site, and
duplicating it on a coupon page splits attention away from the one action
that matters.

## Stack

- **Astro** (static output) — near-zero JS, fast on mobile ad traffic
- **Tailwind CSS**
- **Supabase** — one `site_settings` row + a `branding` bucket for the logo,
  and Supabase Auth for the admin login
- **Vercel** — deploy target

## What the admin dashboard controls

Log in at `/admin/login`, edit at `/admin/dashboard`. Changes go live
immediately — no redeploy:

| Field | What it does |
|---|---|
| Logo | Header, footer and browser tab, everywhere at once |
| Discount % | Headline, badge, and the "X% comes off the total" line |
| Coupon code | The code visitors copy — shown in three places on the page |
| Offer ends | Shows an expiry line. Blank hides it entirely |
| Checkout URL | Where every "Claim offer" button sends people |
| Headline / subheadline | Hero copy. `{discount}` is filled in automatically |

Everything else (the redeem steps, the brand quote, the footer disclaimer)
is in the components and needs a code change — intentionally, so nobody can
break the page from a text field.

## Setup

1. **Database** — paste [`supabase/schema.sql`](./supabase/schema.sql) into
   Supabase → SQL Editor → New query → Run.
2. **Admin login** — Supabase → Authentication → Users → Add user. Set the
   password there; it never needs to go through code or chat.
3. **Env** — copy `.env.example` to `.env`:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API → `anon` `public`)

   Both are meant to be public/client-side. **Never** add the `service_role`
   key — it isn't needed here and it bypasses Row Level Security.

```bash
npm install
npm run dev      # http://localhost:4321
```

## Deploy

Vercel → Add New → Project → import this repo (auto-detects Astro). Add the
two env vars under Project Settings → Environment Variables, deploy, then
add the domain under Settings → Domains.

## Before running ads to it

- Set the **Checkout URL** to the real purchase page — as deep a link as
  possible, so the code and the cart are one step apart.
- Make sure the **coupon code is actually live** at checkout before you spend
  on ads. A dead code on the landing page burns the click and the trust.
- Only set an **Offer ends** date you'll genuinely honour. A deadline that
  quietly rolls forward is the fastest way to teach repeat visitors to
  ignore your urgency.
- Point the footer's Terms/Privacy links at real pages.

## Known housekeeping item

`npm audit` flags CVEs in this Astro 4.x line, fixed in Astro 7. They're
concentrated in the dev server, middleware, server islands and AVIF image
optimization — none of which this site uses (`output: "static"`, no
middleware, no `<Image>`). Worth a deliberate, tested upgrade eventually.

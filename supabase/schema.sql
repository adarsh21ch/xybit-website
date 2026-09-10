-- Xybit coupon landing page — settings + branding storage
-- Run once in your Supabase project: Dashboard → SQL Editor → New query.
--
-- Safe to re-run. If you ran an earlier version of this file, the extra
-- columns it created (paid_out_total, funded_accounts, avg_payout_days,
-- max_profit_split) are simply unused now — they do no harm, and the
-- optional cleanup at the bottom removes them if you want them gone.

create table if not exists public.site_settings (
  id integer primary key default 1,
  logo_url text,
  discount_percent integer not null default 20,
  coupon_code text not null default 'XYBIT20',
  offer_end_date text not null default '',
  redirect_url text not null default 'https://xybitfunds.com',
  headline text not null default 'Get {discount}% off your Xybit funded account.',
  subheadline text not null default 'Copy the code below, then apply it at checkout on xybitfunds.com. Works on every account size.',
  -- Program facts. Blank by default; each tile stays hidden on the page
  -- until it's filled in, so no unverified number is ever published.
  fact_capital text not null default '',
  fact_split text not null default '',
  fact_payout text not null default '',
  fact_platform text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- If the table already exists from an earlier run, add the new columns.
alter table public.site_settings add column if not exists fact_capital text not null default '';
alter table public.site_settings add column if not exists fact_split text not null default '';
alter table public.site_settings add column if not exists fact_payout text not null default '';
alter table public.site_settings add column if not exists fact_platform text not null default '';

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Anyone can read — the public page needs the logo, offer and code.
drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Only a logged-in admin can change them. There's no roles table here, so
-- only create Supabase Auth accounts for people who should have full access.
drop policy if exists "authenticated can update settings" on public.site_settings;
create policy "authenticated can update settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

-- Logo storage
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

drop policy if exists "public can view branding files" on storage.objects;
create policy "public can view branding files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'branding');

drop policy if exists "authenticated can upload branding files" on storage.objects;
create policy "authenticated can upload branding files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'branding');

drop policy if exists "authenticated can update branding files" on storage.objects;
create policy "authenticated can update branding files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'branding');

-- Optional cleanup, only if you ran the earlier version of this file:
-- alter table public.site_settings
--   drop column if exists paid_out_total,
--   drop column if exists funded_accounts,
--   drop column if exists avg_payout_days,
--   drop column if exists max_profit_split;

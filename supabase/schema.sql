-- Xybit site settings + branding storage
-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).

-- ---------------------------------------------------------------------
-- 1. site_settings — a single row (id = 1) the admin dashboard edits
--    and the public site reads. Everything the landing page needs to
--    stay live-editable lives here.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  logo_url text,
  discount_percent integer not null default 40,
  coupon_code text not null default 'XYBIT40',
  offer_end_date text not null default '',
  redirect_url text not null default 'https://xybitfunds.com',
  headline text not null default '{discount}% Off Every Funded Account.',
  subheadline text not null default 'Two trades a day. Real capital, up to $200K. No hype — just the evaluation, the rules, and the payout.',
  paid_out_total text not null default '',
  funded_accounts text not null default '',
  avg_payout_days text not null default '',
  max_profit_split text not null default '',
  updated_at timestamptz not null default now(),
  -- Only one settings row ever exists.
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- Keep updated_at current on every save.
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

-- Anyone (including logged-out visitors) can read settings — the public
-- landing page needs this to show the logo, offer and coupon.
drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Only a logged-in admin can change settings. There's no separate roles
-- table here — anyone with a Supabase Auth account in this project can
-- edit, so only create login accounts for people who should have full
-- admin access.
drop policy if exists "authenticated can update settings" on public.site_settings;
create policy "authenticated can update settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 2. branding storage bucket — holds the uploaded logo file(s)
-- ---------------------------------------------------------------------
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

import { supabase, SUPABASE_CONFIGURED } from "./supabase";

export interface SiteSettings {
  logo_url: string | null;
  discount_percent: number;
  coupon_code: string;
  offer_end_date: string; // ISO date, shown as-is (e.g. "2026-10-31")
  redirect_url: string; // where every "Get Funded" CTA sends traffic
  headline: string;
  subheadline: string;
  paid_out_total: string; // e.g. "$2.1M+"
  funded_accounts: string; // e.g. "6,400+"
  avg_payout_days: string; // e.g. "5 days"
  max_profit_split: string; // e.g. "90%"
}

// Shown until the real row loads, and used as-is if Supabase isn't
// configured yet. Keep these truthful placeholders, not invented numbers —
// swap every one of them for real figures in the admin dashboard.
export const DEFAULT_SETTINGS: SiteSettings = {
  logo_url: null,
  discount_percent: 40,
  coupon_code: "XYBIT40",
  offer_end_date: "",
  redirect_url: "https://xybitfunds.com",
  headline: "{discount}% Off Every Funded Account.",
  subheadline:
    "Two trades a day. Real capital, up to $200K. No hype — just the evaluation, the rules, and the payout.",
  paid_out_total: "",
  funded_accounts: "",
  avg_payout_days: "",
  max_profit_split: "",
};

const TABLE = "site_settings";
const ROW_ID = 1;

export async function fetchSettings(): Promise<SiteSettings> {
  if (!SUPABASE_CONFIGURED) return DEFAULT_SETTINGS;
  // Never let a network failure, a slow response, or a thrown error hang
  // this promise — every caller treats it as "always resolves quickly" so
  // the page can show real default copy immediately instead of sitting on
  // a loading state (or worse, staying stuck) if Supabase is unreachable.
  const timeout = new Promise<SiteSettings>((resolve) =>
    setTimeout(() => resolve(DEFAULT_SETTINGS), 4000),
  );
  const load = (async () => {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", ROW_ID)
        .single();
      if (error || !data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...data };
    } catch {
      return DEFAULT_SETTINGS;
    }
  })();
  return Promise.race([load, timeout]);
}

export async function saveSettings(
  partial: Partial<SiteSettings>,
): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED) {
    return { error: "Supabase isn't connected yet — add your project keys first." };
  }
  const { error } = await supabase
    .from(TABLE)
    .update(partial)
    .eq("id", ROW_ID);
  return { error: error?.message ?? null };
}

export function applyHeadline(template: string, discount: number): string {
  return template.replace("{discount}", String(discount));
}

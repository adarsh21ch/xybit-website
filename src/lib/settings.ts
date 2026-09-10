import { supabase, SUPABASE_CONFIGURED } from "./supabase";

// This page has one job: show the offer, hand over the coupon code, and
// send the visitor to the checkout to redeem it. Everything editable here
// serves that — there is deliberately nothing about pricing tiers, payout
// figures or trading rules, which live on the main site.
export interface SiteSettings {
  logo_url: string | null;
  discount_percent: number;
  coupon_code: string;
  offer_end_date: string; // ISO date; blank hides the expiry line entirely
  redirect_url: string; // the checkout page the CTA sends people to
  headline: string; // "{discount}" is replaced with the number
  subheadline: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  logo_url: null,
  discount_percent: 20,
  coupon_code: "XYBIT20",
  offer_end_date: "",
  redirect_url: "https://xybitfunds.com",
  headline: "Get {discount}% off your Xybit funded account.",
  subheadline:
    "Copy the code below, then apply it at checkout on xybitfunds.com. Works on every account size.",
};

const TABLE = "site_settings";
const ROW_ID = 1;

export async function fetchSettings(): Promise<SiteSettings> {
  if (!SUPABASE_CONFIGURED) return DEFAULT_SETTINGS;
  // Never let a network failure, a slow response, or a thrown error hang
  // this promise — callers treat it as "always resolves quickly" so the
  // page can show its real default copy immediately rather than waiting.
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
  const { error } = await supabase.from(TABLE).update(partial).eq("id", ROW_ID);
  return { error: error?.message ?? null };
}

export function applyHeadline(template: string, discount: number): string {
  return template.replace("{discount}", String(discount));
}

import { fetchSettings, type SiteSettings } from "./settings";

// Memoized so every component on the page shares one fetch instead of each
// hitting Supabase separately.
let cached: Promise<SiteSettings> | null = null;

export function getSettings(): Promise<SiteSettings> {
  if (!cached) cached = fetchSettings();
  return cached;
}

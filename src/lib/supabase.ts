import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// During a build with no keys configured yet (e.g. first deploy before
// Supabase is wired up), fall back to a harmless placeholder so the static
// build still succeeds. The site falls back to DEFAULT_SETTINGS at runtime
// in that case — see settings.ts.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
);

export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

import { createClient } from "@supabase/supabase-js";

// Use empty string fallback to prevent runtime errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase URL or ANON KEY is missing! Check your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from "@supabase/supabase-js";

/**
 * Manual connection to the user's own external Supabase project.
 * Both values below are publishable (anon) credentials — safe in client code.
 */
export const SUPABASE_URL =
  (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ??
  "https://hvukjfpdvidrmgblmnpy.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dWtqZnBkdmlkcm1nYmxtbnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzQwMDEsImV4cCI6MjEwNDExMDAwMX0.swRJc_SDGdG-2t3hqoW9d_NdJgLZRoztaw5jL6hi30c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

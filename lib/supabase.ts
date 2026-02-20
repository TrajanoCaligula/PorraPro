// JavaScript source code
import { createClient } from '@supabase/supabase-js'

// Cambiamos process.env por import.meta.env
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
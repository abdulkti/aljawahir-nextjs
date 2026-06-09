import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

// Client untuk browser (komponen client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client untuk server (API routes, Server Components)
export const supabaseServer = () =>
  createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey
  )

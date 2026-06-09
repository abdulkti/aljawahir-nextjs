import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function makeClient(url: string, key: string) {
  return createClient(url, key)
}

function makeDummy() {
  const c = createClient('https://placeholder.supabase.co', 'placeholder-key')
  const dummyQuery = { data: null, error: null, count: null, status: 200, statusText: 'OK' }
  const from = () => ({
    select: () => ({
      eq: () => ({
        neq: () => ({ limit: () => dummyQuery, single: () => dummyQuery, order: () => dummyQuery }),
        limit: () => dummyQuery,
        order: () => dummyQuery,
        single: () => dummyQuery,
      }),
      order: () => dummyQuery,
      limit: () => dummyQuery,
    }),
    insert: () => ({ select: () => dummyQuery }),
    update: () => ({ eq: () => dummyQuery }),
    delete: () => ({ eq: () => dummyQuery }),
  })
  return { ...c, from }
}

// Client untuk browser (komponen client-side)
export const supabase = supabaseUrl && supabaseAnonKey
  ? makeClient(supabaseUrl, supabaseAnonKey)
  : makeDummy()

// Client untuk server (API routes, Server Components)
export const supabaseServer = () =>
  supabaseUrl
    ? makeClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey ?? 'placeholder-key')
    : makeDummy()

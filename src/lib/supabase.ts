import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
const STORAGE_BUCKET = process.env.NEXT_STORAGE_BUCKET!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

export { STORAGE_BUCKET } 
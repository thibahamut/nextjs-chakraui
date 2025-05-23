import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
const STORAGE_BUCKET = process.env.NEXT_STORAGE_BUCKET!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-access-token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null
        const cookies = document.cookie.split(';')
        const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
        return cookie ? cookie.split('=')[1] : null
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return
        document.cookie = `${key}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return
        document.cookie = `${key}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
      }
    }
  }
})

export { STORAGE_BUCKET } 
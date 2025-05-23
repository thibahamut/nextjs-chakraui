import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
const STORAGE_BUCKET = 'vwco-bucket'

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

function getTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = getTokenFromCookie(req)
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Recupera o usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      console.error('Auth error:', userError)
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Lista arquivos do bucket
    const { data: files, error } = await supabase.storage.from(STORAGE_BUCKET).list()
    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: error.message })
    }

    const fileList = files?.map(file => {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(file.name)
      return {
        name: file.name,
        url: data.publicUrl,
      }
    }) || []

    return res.status(200).json({ files: fileList })
  } catch (error: any) {
    console.error('List error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
} 
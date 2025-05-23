import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
const STORAGE_BUCKET = process.env.NEXT_STORAGE_BUCKET!

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = getTokenFromCookie(req)
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Recupera o usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const { fileName } = req.body
  if (!fileName) {
    return res.status(400).json({ error: 'Nome do arquivo não informado' })
  }

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([fileName])
  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ message: 'Arquivo excluído com sucesso' })
} 
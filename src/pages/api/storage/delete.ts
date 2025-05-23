import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

function getTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/sb-access-token=([^;]+)/)
  return match ? match[1] : null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const { fileName } = req.query
    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'File name is required' })
    }

    // Remove o arquivo do bucket
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([fileName])
    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ message: 'File deleted successfully' })
  } catch (error: any) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
} 
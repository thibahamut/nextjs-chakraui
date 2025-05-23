import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

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
    const userPath = `users/${user.id}`
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(userPath)
    
    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: error.message })
    }

    const fileList = files?.map(async file => {
      const filePath = `${userPath}/${file.name}`
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, 60) // URL válida por 60 segundos
      
      if (error) {
        console.error('Error creating signed URL:', error)
        return null
      }

      return {
        name: file.name,
        path: filePath,
        url: data.signedUrl,
      }
    }) || []

    const resolvedFiles = (await Promise.all(fileList)).filter(Boolean)

    return res.status(200).json({ files: resolvedFiles })
  } catch (error: any) {
    console.error('List error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
} 
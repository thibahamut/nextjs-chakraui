import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'
import { validateAndRefreshToken } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user, error: authError } = await validateAndRefreshToken(req, res)
    if (authError || !user) {
      return res.status(401).json({ error: authError || 'User not found' })
    }

    // List files in the user's folder
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(`users/${user.id}`)

    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: 'Failed to list files' })
    }

    // Add signed URLs to files
    const filesWithUrls = await Promise.all(files.map(async file => {
      const { data } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(`users/${user.id}/${file.name}`, 3600) // URL válida por 1 hora

      if (!data?.signedUrl) {
        throw new Error('Failed to generate signed URL')
      }

      return {
        ...file,
        url: data.signedUrl
      }
    }))

    return res.status(200).json({ files: filesWithUrls })
  } catch (error) {
    console.error('List files error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
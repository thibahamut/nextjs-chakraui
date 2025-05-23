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
      .list(`${user.id}`)

    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: 'Failed to list files' })
    }

    return res.status(200).json({ files })
  } catch (error) {
    console.error('List files error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
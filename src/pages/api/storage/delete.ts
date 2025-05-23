import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'
import { validateAndRefreshToken } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user, error: authError } = await validateAndRefreshToken(req, res)
    if (authError || !user) {
      return res.status(401).json({ error: authError || 'User not found' })
    }

    const { fileName } = req.query

    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'File name is required' })
    }

    // Delete file from user's folder
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([`${user.id}/${fileName}`])

    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: 'Failed to delete file' })
    }

    return res.status(200).json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
// Certifique-se de instalar o formidable: npm install formidable
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'
import { validateAndRefreshToken } from '@/lib/auth'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user, error: authError } = await validateAndRefreshToken(req, res)
    if (authError || !user) {
      return res.status(401).json({ error: authError || 'User not found' })
    }

    const { fileName, fileType } = req.body

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'File name and type are required' })
    }

    // Create a signed URL for upload
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(`${user.id}/${fileName}`)

    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: 'Failed to create upload URL' })
    }

    return res.status(200).json({
      signedUrl: data.signedUrl,
      path: `${user.id}/${fileName}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
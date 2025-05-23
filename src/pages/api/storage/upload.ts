// Certifique-se de instalar o formidable: npm install formidable
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'
import { validateAndRefreshToken } from '@/lib/auth'
import formidable from 'formidable'
import fs from 'fs'

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

    const form = formidable({ multiples: false })
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const file = files.file?.[0] as formidable.File
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Read file buffer
    const fileBuffer = await fs.promises.readFile(file.filepath)
    const fileName = file.originalFilename || 'document.pdf'

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`users/${user.id}/${fileName}`, fileBuffer, {
        contentType: file.mimetype || 'application/pdf',
        upsert: true
      })

    if (error) {
      console.error('Storage error:', error)
      return res.status(500).json({ error: 'Failed to upload file' })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`users/${user.id}/${fileName}`)

    return res.status(200).json({
      url: publicUrl,
      path: `users/${user.id}/${fileName}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
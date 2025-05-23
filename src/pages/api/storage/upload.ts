// Certifique-se de instalar o formidable: npm install formidable
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { IncomingForm } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

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

// Função para sanitizar o nome do arquivo
function sanitizeFileName(fileName: string): string {
  // Remove acentos
  const withoutAccents = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  // Substitui caracteres especiais e espaços por underscore
  return withoutAccents.replace(/[^a-zA-Z0-9.-]/g, '_')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    // Parse multipart form
    const form = new IncomingForm()
    
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const fileField = files.file
    const file = Array.isArray(fileField) ? fileField[0] : fileField
    if (!file) {
      return res.status(400).json({ error: 'Arquivo não enviado' })
    }

    const sanitizedFileName = sanitizeFileName(file.originalFilename || file.newFilename || 'arquivo.pdf')
    const fileData = fs.readFileSync(file.filepath)

    // Upload para o storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(sanitizedFileName, fileData, {
        contentType: file.mimetype || undefined,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return res.status(500).json({ error: uploadError.message })
    }

    return res.status(200).json({ message: 'Upload realizado com sucesso' })
  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' })
  }
} 
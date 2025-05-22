import { NextApiRequest, NextApiResponse } from 'next'
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Remove o cookie HTTP Only
    res.setHeader('Set-Cookie', 'sb-access-token=deleted; Path=/; HttpOnly; Max-Age=0; SameSite=Lax')
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
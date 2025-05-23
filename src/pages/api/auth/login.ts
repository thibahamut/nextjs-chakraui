import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      return res.status(401).json({ error: error?.message || 'Login failed' })
    }

    // Salva os tokens em cookies HTTP Only
    res.setHeader('Set-Cookie', [
      `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      `sb-refresh-token=${data.session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    ])

    // Busca informações adicionais do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
    }

    // Retorna apenas dados não sensíveis
    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        last_sign_in_at: data.user.last_sign_in_at,
        role: userData?.role || 'user',
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
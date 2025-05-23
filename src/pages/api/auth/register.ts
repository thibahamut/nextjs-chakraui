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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Se já criou a sessão, salva o token no cookie
    if (data.session) {
      res.setHeader('Set-Cookie', `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)
    }

    // Busca informações adicionais do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user?.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
    }

    // Retorna apenas os dados necessários
    return res.status(201).json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: userData?.role || 'user',
      },
      message: 'User registered successfully. Please check your email for verification.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

function getTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = getTokenFromCookie(req);
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Busca informações adicionais do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        last_sign_in_at: user.last_sign_in_at,
        role: userData?.role || 'user',
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

function getTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

function getRefreshTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sb-refresh-token=([^;]+)/);
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
    const refreshToken = getRefreshTokenFromCookie(req);

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Try to get user with current token
    let { data: { user }, error } = await supabase.auth.getUser(token);
    
    // If token is expired and we have a refresh token, try to refresh it
    if ((error?.message?.includes('expired') || error?.message?.includes('invalid')) && refreshToken) {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (refreshError || !session) {
        return res.status(401).json({ error: 'Session expired' })
      }

      // Update both access and refresh tokens in cookies
      res.setHeader('Set-Cookie', [
        `sb-access-token=${session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
        `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
      ]);
      
      // Get user with new token
      const { data: { user: refreshedUser }, error: userError } = await supabase.auth.getUser(session.access_token);
      
      if (userError || !refreshedUser) {
        return res.status(401).json({ error: 'Invalid session' })
      }
      
      user = refreshedUser;
    }

    if (!user) {
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
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from './supabase'

export function getTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

export function getRefreshTokenFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sb-refresh-token=([^;]+)/);
  return match ? match[1] : null;
}

export async function validateAndRefreshToken(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  const refreshToken = getRefreshTokenFromCookie(req);

  if (!token) {
    return { error: 'Not authenticated' };
  }

  // Try to get user with current token
  let { data: { user }, error } = await supabase.auth.getUser(token);
  
  // If token is expired and we have a refresh token, try to refresh it
  if ((error?.message?.includes('expired') || error?.message?.includes('invalid')) && refreshToken) {
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });
    
    if (refreshError || !session) {
      return { error: 'Session expired' };
    }

    // Update both access and refresh tokens in cookies
    res.setHeader('Set-Cookie', [
      `sb-access-token=${session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    ]);
    
    // Get user with new token
    const { data: { user: refreshedUser }, error: userError } = await supabase.auth.getUser(session.access_token);
    
    if (userError || !refreshedUser) {
      return { error: 'Invalid session' };
    }
    
    user = refreshedUser;
  }

  if (!user) {
    return { error: 'Invalid or expired token' };
  }

  return { user };
} 
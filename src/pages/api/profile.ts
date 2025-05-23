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
  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    if (req.method === 'GET') {
      try {
        // Primeiro, verifica se o usuário existe na tabela users
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (checkError) {
          // Se o usuário não existe, cria um novo registro
          if (checkError.code === 'PGRST116') {
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating user:', createError)
              throw createError
            }

            return res.status(200).json(newUser)
          }
          throw checkError
        }

        return res.status(200).json(existingUser)
      } catch (error) {
        console.error('Profile fetch error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    }

    if (req.method === 'POST') {
      try {
        const { first_name, last_name, phone_number, department } = req.body

        const { data, error } = await supabase
          .from('users')
          .update({
            first_name,
            last_name,
            phone_number,
            department,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .single()

        if (error) throw error

        return res.status(200).json(data)
      } catch (error) {
        console.error('Profile update error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 
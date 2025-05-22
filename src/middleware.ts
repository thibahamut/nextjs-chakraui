import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lista de rotas públicas que não precisam de autenticação
const publicRoutes = ['/', '/api']

export async function middleware(req: NextRequest) {
  // Se for uma rota pública, permite o acesso sem verificação
  if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Se for um arquivo estático ou recurso, permite o acesso
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/static') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se estiver na página de login e tiver sessão, redireciona para dashboard
  if (req.nextUrl.pathname === '/auth/login' && session) {
    const redirectUrl = new URL('/app', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se não houver sessão e a rota não for pública, redireciona para home
  if (!session && !publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    // Protege todas as rotas exceto as públicas e arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 
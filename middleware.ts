import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Ne blokiraj auth callback route
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }
  
  // Preveri session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Če poskuša dostopati do dashboard strani brez avtentikacije
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    console.log('Middleware: Ni prijavljen, preusmerjam na login')
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Če je prijavljen in poskuša dostopati do login strani, preusmeri na dashboard
  if (req.nextUrl.pathname === '/login' && session) {
    console.log('Middleware: Že prijavljen, preusmerjam na dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
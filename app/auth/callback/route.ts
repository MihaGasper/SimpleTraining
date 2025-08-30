import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Obdelaj OAuth callback
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Uspešna prijava, preusmeri na dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
  }

  // Če je prišlo do napake, preusmeri na login
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin))
}

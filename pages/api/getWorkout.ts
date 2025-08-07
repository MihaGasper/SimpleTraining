import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Preberi nastavitve iz request body
    const { level = 'srednje', equipment = 'bodyweight' } = req.body || {}
    console.log('Workout settings:', { level, equipment })

    const supabase = createPagesServerClient({ req, res })
  
    // Debug: preveri session
    const { data: { session } } = await supabase.auth.getSession()
   
    
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      console.log('User error:', userError)
      // Če je user ne obstaja, pošlji 401 z jasnim sporočilom
      if (userError.message.includes('does not exist')) {
        return res.status(401).json({ 
          error: 'User not found - please log in again',
          code: 'USER_NOT_FOUND'
        })
      }
      return res.status(401).json({ error: 'Auth error: ' + userError.message })
    }

    if (!user) {
      console.log('No user found')
      return res.status(401).json({ error: 'Unauthorized - no user' })
    }

  
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing, error: existingError } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()

    if (existingError) {
      console.log('Error checking existing workouts:', existingError)
      return res.status(500).json({ error: 'Database error checking existing workouts' })
    }

    if (existing) {
      console.log('Found existing workout, returning it')
      return res.status(200).json(existing)
    }

    console.log('No existing workout found, creating new one...')

    console.log('Reading user profile...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.log('Error reading profile:', profileError)
      return res.status(500).json({ error: 'Database error reading profile' })
    }

    console.log('Profile found:', profile)

    const prompt = `Generate a personalized circular training workout for today (${today}). 

User preferences:
- Difficulty level: ${level}
- Equipment: ${equipment === 'bodyweight' ? 'bodyweight only' : 'with gym equipment'}

Create a workout that matches the user's difficulty preference (${level}) and equipment choice (${equipment}).

Use this format:
${today}
Warmup:
...
Main Part:
...
Finisher:
...`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'Vedno odgovarjaj kot strokovnjak za fitnes.' }],
      max_tokens: 512,
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content

    const { data, error } = await supabase.from('workouts').insert({
      user_id: user.id,
      date: today,
      content,
    }).select().single()

    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { level = 'srednje', equipment = 'bodyweight' } = req.body || {}
    const supabase = createPagesServerClient({ req, res })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const today = new Date().toISOString().split('T')[0]
    
    // Check for existing workout
    const { data: existing } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      return res.status(200).json(existing)
    }

    // Get user's workout history for personalization
    const { data: recentWorkouts } = await supabase
      .from('workouts')
      .select('content, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7)

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Enhanced prompt with better structure and personalization
    const equipmentText = equipment === 'bodyweight' ? 'samo z lastno težo telesa (brez dodatne opreme)' : 'z gimnastično opremo (uteži, elastike, itd.)'
    const levelText = {
      'lahko': 'začetniška (manjša intenzivnost, več počitka)',
      'srednje': 'srednja (zmerna intenzivnost, uravnoteženo)',
      'težko': 'napredna (visoka intenzivnost, manj počitka)'
    }[level] || 'srednja'

    const recentWorkoutsSummary = Array.isArray(recentWorkouts) && recentWorkouts.length > 0
      ? `\n\nPrejšnje vadbe uporabnika (da se izogneš ponavljanju):\n${recentWorkouts.map(w => `${w.date}: ${w.content?.substring(0, 100)}...`).join('\n')}`
      : ''

    const prompt = `Si strokovni osebni trener. Ustvari personalizirano krožno vadbo za danes (${today}).

ZAHTEVE:
- Težavnost: ${levelText}
- Oprema: ${equipmentText}
- Jezik: slovenščina
- Trajanje: 25-35 minut
- Stil: krožna vadba (circuit training)

STRUKTURA VADBE:
1. OGREVANJE (5 min): dinamično ogrevanje vseh mišičnih skupin
2. GLAVNA VADBA (20-25 min): 3-4 krogi po 4-6 vaj, vsaka vaja 45 sek delo + 15 sek počitek
3. ZAKLJUČEK (5 min): raztezanje in umiritev

NAVODILA:
- Vključi različne mišične skupine
- Kombiniraj moč, vzdržljivost in koordinacijo
- Jasno opiši tehniko izvajanja vaj
- Dodaj alternativne variante za različne ravni pripravljenosti
- Motivacijski ton pisanja
- Poudarek na varnosti

FORMAT ODGOVORA:
🔥 KROŽNA VADBA - ${today}

💪 OGREVANJE (5 min):
[seznam vaj z opisom]

🏋️ GLAVNA VADBA (${level.toUpperCase()} - ${equipmentText}):
KOG 1: [4-6 vaj]
KOG 2: [4-6 vaj]  
KOG 3: [4-6 vaj]

🧘 ZAKLJUČEK (5 min):
[raztezanje in umiritev]

💡 NASVETI:
[koristni nasveti za vadbo]${recentWorkoutsSummary}

Ustvari motivacijsko, varno in učinkovito vadbo!`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Si vrhunski osebni trener s 15+ leti izkušenj. Specializiraš se za krožne vadbe in motivacijo. Vedno pišeš v slovenščini z motivacijskim tonom.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.8,
    })

    const content = completion.choices[0].message.content

    const { data, error } = await supabase.from('workouts').insert({
      user_id: user.id,
      date: today,
      content,
      level,
      equipment
    }).select().single()

    if (error) {
      return res.status(500).json({ error })
    }
    
    return res.status(200).json(data)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
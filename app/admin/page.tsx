import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: workouts } = await supabase.from('workouts').select('*').order('date', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin nadzorna plošča</h1>
      <p>Skupno število vadb: {workouts?.length}</p>
      <ul className="mt-4 space-y-2">
        {workouts?.map(w => (
          <li key={w.id} className="bg-gray-100 p-2 rounded">
            <p className="text-xs text-gray-600">{w.date} | {w.user_id}</p>
            <pre className="text-sm whitespace-pre-wrap">{w.content}</pre>
            {w.feedback && <p className="text-xs italic text-green-700 mt-1">Feedback: {w.feedback}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}

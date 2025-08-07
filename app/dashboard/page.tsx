'use client'
import { useEffect, useState } from 'react'
import WorkoutCard from '../../components/WorkoutCard'
import { supabase } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})
  const [workoutSettings, setWorkoutSettings] = useState({
    level: 'srednje',
    equipment: 'bodyweight'
  })

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('workouts').select('*').order('date', { ascending: false })
      if (data) setWorkouts(data)
    }
    load()
  }, [])

  const getWorkout = async () => {
    setLoading(true)
    const res = await fetch('/api/getWorkout', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(workoutSettings)
    })
    const data = await res.json()
    setWorkouts(prev => [data, ...prev])
    setLoading(false)
  }

  const saveFeedback = async (text: string) => {
    const latestWorkout = workouts[0]
    if (!latestWorkout) return
    await supabase.from('workouts').update({ feedback: text }).eq('id', latestWorkout.id)
    setWorkouts(prev => prev.map(w => (w.id === latestWorkout.id ? { ...w, feedback: text } : w)))
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      toast.success('Uspešno odjavljen!')
      router.push('/login')
    } else {
      toast.error('Napaka pri odjavi: ' + error.message)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tvoja dnevna vadba</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Odjava
        </button>
      </div>

      {/* Nastavitve vade */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-3">Nastavitve vade</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Težavnost:</label>
            <div className="flex space-x-4">
              {['lahko', 'srednje', 'težko'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={workoutSettings.level === level}
                    onChange={(e) => setWorkoutSettings(prev => ({ ...prev, level: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Oprema:</label>
            <div className="flex space-x-4">
              {['bodyweight', 'oprema'].map((equipment) => (
                <label key={equipment} className="flex items-center">
                  <input
                    type="radio"
                    name="equipment"
                    value={equipment}
                    checked={workoutSettings.equipment === equipment}
                    onChange={(e) => setWorkoutSettings(prev => ({ ...prev, equipment: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="capitalize">{equipment === 'bodyweight' ? 'samo telo' : 'z opremo'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={getWorkout}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >{loading ? 'Nalagam...' : 'Daj mi vadbo za danes'}</button>

      <div className="space-y-4">
        {workouts.map((w, index) => (
          <WorkoutCard
            key={w.id || `workout-${index}`}
            workout={w}
            feedback={feedbacks[w.id]}
            onFeedbackChange={text => setFeedbacks({ ...feedbacks, [w.id]: text })}
            onSubmitFeedback={() => saveFeedback(feedbacks[w.id])}
          />
        ))}
      </div>
    </main>
  )
}
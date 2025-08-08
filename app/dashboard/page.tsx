'use client'
import { useEffect, useState } from 'react'
import WorkoutCard from '../../components/WorkoutCard'
import CalendarView from '../../components/CalendarView'
import { supabase } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [workoutSettings, setWorkoutSettings] = useState({
    level: 'srednje',
    equipment: 'bodyweight'
  })

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)
    if (data) setWorkouts(data)
  }

  const getWorkout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/getWorkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(workoutSettings)
      })
      const data = await res.json()
      
      if (res.ok) {
        setWorkouts(prev => [data, ...prev.filter(w => w.date !== data.date)])
        setSelectedWorkout(data)
        toast.success('Nova vadba je pripravljena! 💪')
      } else {
        toast.error('Napaka pri generiranju vadbe: ' + data.error)
      }
    } catch (error) {
      toast.error('Napaka pri komunikaciji s strežnikom')
    }
    setLoading(false)
  }

  const saveFeedback = async (workoutId: string, feedback: string) => {
    const { error } = await supabase
      .from('workouts')
      .update({ feedback })
      .eq('id', workoutId)
    
    if (!error) {
      setWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, feedback } : w
      ))
      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout({ ...selectedWorkout, feedback })
      }
      toast.success('Povratna informacija shranjena!')
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      toast.success('Uspešno odjavljen!')
      router.push('/login')
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayWorkout = workouts.find(w => w.date === today)

  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Moja Vadba</h1>
          <p className="text-gray-600 mt-1">
            {todayWorkout ? 'Danes že imaš vadbo! 🔥' : 'Pripravi si vadbo za danes'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📅 Koledar
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Seznam
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Odjava
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ⚙️ Nastavitve vadbe
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Težavnost:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'lahko', label: '🟢 Lahko', desc: 'Za začetnike' },
                    { value: 'srednje', label: '🟡 Srednje', desc: 'Zmerna intenzivnost' },
                    { value: 'težko', label: '🔴 Težko', desc: 'Visoka intenzivnost' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        value={option.value}
                        checked={workoutSettings.level === option.value}
                        onChange={(e) => setWorkoutSettings(prev => ({ ...prev, level: e.target.value }))}
                        className="mr-3 text-blue-600"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oprema:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'bodyweight', label: '💪 Samo telo', desc: 'Brez dodatne opreme' },
                    { value: 'oprema', label: '🏋️ Z opremo', desc: 'Uteži, elastike, itd.' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="equipment"
                        value={option.value}
                        checked={workoutSettings.equipment === option.value}
                        onChange={(e) => setWorkoutSettings(prev => ({ ...prev, equipment: e.target.value }))}
                        className="mr-3 text-blue-600"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={getWorkout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Pripravljam vadbo...
                  </span>
                ) : (
                  '🔥 Generiraj vadbo za danes'
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Statistika</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{workouts.length}</div>
                <div className="text-sm text-gray-600">Skupaj vadb</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {workouts.filter(w => w.feedback).length}
                </div>
                <div className="text-sm text-gray-600">Ocenjenih</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {view === 'calendar' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <CalendarView 
                workouts={workouts} 
                onWorkoutSelect={setSelectedWorkout}
                selectedWorkout={selectedWorkout}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onFeedbackSave={(feedback) => saveFeedback(workout.id, feedback)}
                />
              ))}
              {workouts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">💪</div>
                  <p>Še nimaš nobene vadbe. Generiraj svojo prvo vadbo!</p>
                </div>
              )}
            </div>
          )}

          {/* Selected Workout Detail */}
          {selectedWorkout && view === 'calendar' && (
            <div className="mt-6">
              <WorkoutCard
                workout={selectedWorkout}
                onFeedbackSave={(feedback) => saveFeedback(selectedWorkout.id, feedback)}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
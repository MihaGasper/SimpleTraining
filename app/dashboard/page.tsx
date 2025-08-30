"use client"
import { useEffect, useState } from "react"
import WorkoutCard from "../../components/WorkoutCard"
import CalendarView from "../../components/CalendarView"
import EquipmentSelector from "../../components/EquipmentSelector"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Calendar, List, Settings, TrendingUp, LogOut, Dumbbell, Zap, Plus, X } from "lucide-react"

interface Equipment {
  id: string
  name: string
  category: string
  weight?: string
  resistance?: string
  color?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [workoutSettings, setWorkoutSettings] = useState({
    level: "srednje",
    equipment: "bodyweight",
  })

  const handleLevelChange = (level: string) => {
    console.log("Spreminjam težavnost na:", level)
    setWorkoutSettings(prev => ({ ...prev, level }))
  }

  const handleEquipmentChange = (equipment: string) => {
    console.log("Spreminjam opremo na:", equipment)
    setWorkoutSettings(prev => ({ ...prev, equipment }))
  }

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([])
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(false)

  useEffect(() => {
    // Preveri avtentikacijo ob nalaganju strani
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (!session || error) {
        router.push("/login")
        return
      }
      
      setAuthLoading(false)
      loadWorkouts()
      loadSavedEquipment()
    }
    
    checkAuth()
  }, [router])

  const loadWorkouts = async () => {
    const { data, error } = await supabase.from("workouts").select("*").order("date", { ascending: false }).limit(100)
    
    if (error) {
      console.error("Napaka pri nalaganju vadb:", error)
    } else {
      if (data) {
        setWorkouts(data)
      }
    }
  }

  const loadSavedEquipment = () => {
    try {
      const saved = localStorage.getItem('selectedEquipment')
      if (saved) {
        setSelectedEquipment(JSON.parse(saved))
      }
    } catch (error) {
      console.log('Napaka pri nalaganju shranjenih pripomočkov:', error)
    }
  }

  const saveEquipment = (equipment: Equipment[]) => {
    setSelectedEquipment(equipment)
    try {
      localStorage.setItem('selectedEquipment', JSON.stringify(equipment))
    } catch (error) {
      console.log('Napaka pri shranjevanju pripomočkov:', error)
    }
  }

  const getWorkout = async () => {
    setLoading(true)
    try {
      const workoutData = {
        ...workoutSettings,
        equipment: selectedEquipment.length > 0 ? selectedEquipment : undefined
      }
      
      const res = await fetch("/api/getWorkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(workoutData),
      })
      const data = await res.json()

      if (res.ok) {
        const newWorkouts = [data, ...workouts.filter((w) => w.date !== data.date)]
        setWorkouts(newWorkouts)
        setSelectedWorkout(data)
        toast.success("Nova vadba je pripravljena! 💪")
      } else {
        toast.error("Napaka pri generiranju vadbe: " + data.error)
      }
    } catch (error) {
      toast.error("Napaka pri komunikaciji s strežnikom")
    }
    setLoading(false)
  }

  const saveFeedback = async (workoutId: string, feedback: string) => {
    if (!workoutId) {
      toast.error("Napaka: manjka ID vadbe")
      return
    }
    
    // Preverimo avtentikacijo
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      toast.error("Napaka pri avtentikaciji")
      return
    }
    
    try {
      // Posodobi feedback z update in eksplicitnim user_id filterjem
      const { data, error } = await supabase
        .from("workouts")
        .update({ feedback: feedback })
        .eq("id", workoutId)
        .eq("user_id", user.id)
        .select()

      if (error) {
        toast.error("Napaka pri shranjevanju povratne informacije")
        return
      }
      
      // Posodobi local state
      setWorkouts((prev) => prev.map((w) => (w.id === workoutId ? { ...w, feedback } : w)))
      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout({ ...selectedWorkout, feedback })
      }
      
      toast.success("Povratna informacija shranjena!")
    } catch (err) {
      toast.error("Napaka pri shranjevanju povratne informacije")
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      toast.success("Uspešno odjavljen!")
      router.push("/login")
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const todayWorkout = workouts.find((w) => w.date === today)

  return (
    <div className="min-h-screen bg-background">
      {authLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Preverjam avtentikacijo...</p>
          </div>
        </div>
      ) : (
        <>
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-mono">Moja Vadba</h1>
                    <p className="text-sm text-muted-foreground">
                      {todayWorkout ? "Danes že imaš vadbo! 🔥" : "Pripravi si vadbo za danes"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-muted/50 p-1 rounded-lg border border-border">
                    <button
                      onClick={() => setView("calendar")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        view === "calendar"
                          ? "bg-card text-primary shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Koledar
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        view === "list"
                          ? "bg-card text-primary shadow-sm border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="w-4 h-4" />
                      Seznam
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Odjava
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground font-mono">Nastavitve vadbe</h3>
                  </div>

                  {/* Debug info */}
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                    Trenutne nastavitve: Težavnost: <strong>{workoutSettings.level}</strong>, Oprema: <strong>{workoutSettings.equipment}</strong>
                  </div>

                  <div className="space-y-6">
                    {/* Equipment Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-card-foreground">Domači pripomočki:</label>
                        <button
                          onClick={() => setShowEquipmentSelector(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Dodaj
                        </button>
                      </div>
                      
                      {selectedEquipment.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground mb-2">
                            Izbrani pripomočki ({selectedEquipment.length}):
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedEquipment.map((equipment) => (
                              <div
                                key={equipment.id}
                                className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border"
                              >
                                <Dumbbell className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-card-foreground">
                                  {equipment.weight ? `${equipment.name} ${equipment.weight}` : 
                                   equipment.resistance ? `${equipment.name} ${equipment.resistance}${equipment.color ? ` (${equipment.color})` : ''}` : 
                                   equipment.name}
                                </span>
                                <button
                                  onClick={() => saveEquipment(selectedEquipment.filter(e => e.id !== equipment.id))}
                                  className="w-4 h-4 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                                >
                                  <X className="w-3 h-3 text-muted-foreground" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed border-border">
                          <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Ni izbranih pripomočkov</p>
                          <p className="text-xs text-muted-foreground mt-1">Kliknite "Dodaj" za izbiro opreme</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-3">Težavnost:</label>
                      <div className="space-y-3">
                        {[
                          {
                            value: "lahko",
                            label: "Lahko",
                            desc: "Za začetnike",
                            color: "bg-green-100 text-green-800 border-green-200",
                          },
                          {
                            value: "srednje",
                            label: "Srednje",
                            desc: "Zmerna intenzivnost",
                            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                          },
                          {
                            value: "težko",
                            label: "Težko",
                            desc: "Visoka intenzivnost",
                            color: "bg-red-100 text-red-800 border-red-200",
                          },
                        ].map((option) => {
                          const isSelected = workoutSettings.level === option.value
                          return (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                              <input
                                type="radio"
                                name="level"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => handleLevelChange(option.value)}
                                className="sr-only"
                              />
                              <div
                                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-muted/30 group-hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-card-foreground">{option.label}</div>
                                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                      isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground bg-transparent"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-3">Oprema:</label>
                      <div className="space-y-3">
                        {[
                          { value: "bodyweight", label: "Samo telo", desc: "Brez dodatne opreme", icon: "💪" },
                          { value: "oprema", label: "Z opremo", desc: "Uteži, elastike, itd.", icon: "🏋️" },
                        ].map((option) => {
                          const isSelected = workoutSettings.equipment === option.value
                          return (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                              <input
                                type="radio"
                                name="equipment"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => handleEquipmentChange(option.value)}
                                className="sr-only"
                              />
                              <div
                                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-muted/30 group-hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{option.icon}</span>
                                    <div>
                                      <div className="font-medium text-card-foreground">{option.label}</div>
                                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                                    </div>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                      isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground bg-transparent"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      onClick={getWorkout}
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-sm border border-primary/20 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Pripravljam vadbo...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          {selectedEquipment.length > 0 
                            ? `Generiraj vadbo z ${selectedEquipment.length} pripomočki`
                            : "Generiraj vadbo za danes"
                          }
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground font-mono">Statistika</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="text-3xl font-bold text-primary font-mono">{workouts.length}</div>
                      <div className="text-sm text-muted-foreground mt-1">Skupaj vadb</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="text-3xl font-bold text-accent font-mono">
                        {workouts.filter((w) => w.feedback).length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Ocenjenih</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                {view === "calendar" ? (
                  <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-card-foreground">Koledar vadb</h3>
                        <span className="text-sm text-muted-foreground">
                          Skupaj vadb: {workouts.length}
                        </span>
                      </div>
                    </div>
                    <CalendarView
                      workouts={workouts}
                      onWorkoutSelect={setSelectedWorkout}
                      selectedWorkout={selectedWorkout}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workouts.length > 0 ? (
                      workouts.map((workout) => (
                        <WorkoutCard
                          key={workout.id}
                          workout={workout}
                          onFeedbackSave={(feedback) => saveFeedback(workout.id, feedback)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-16 bg-card rounded-2xl border border-border">
                        <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Dumbbell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">Še nimaš nobene vadbe</h3>
                        <p className="text-muted-foreground">Generiraj svojo prvo vadbo z nastavitvami na levi!</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedWorkout && view === "calendar" && (
                  <div className="mt-8">
                    <WorkoutCard
                      workout={selectedWorkout}
                      onFeedbackSave={(feedback) => saveFeedback(selectedWorkout.id, feedback)}
                    />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Equipment Selector Modal */}
          {showEquipmentSelector && (
            <EquipmentSelector
              selectedEquipment={selectedEquipment}
              onEquipmentChange={saveEquipment}
              onClose={() => setShowEquipmentSelector(false)}
            />
          )}
        </>
      )}
    </div>
  )
}

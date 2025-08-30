"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, Target } from "lucide-react"

interface CalendarViewProps {
  workouts: any[]
  onWorkoutSelect: (workout: any) => void
  selectedWorkout: any
}

export default function CalendarView({ workouts, onWorkoutSelect, selectedWorkout }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === "next" ? 1 : -1), 1))
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getWorkoutForDate = (year: number, month: number, day: number) => {
    const dateKey = formatDateKey(year, month, day)
    return workouts.find((workout) => workout.date === dateKey)
  }

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date()
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
  }

  const isSelected = (workout: any) => {
    return selectedWorkout && workout && selectedWorkout.id === workout.id
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "lahko":
        return "bg-green-500"
      case "srednje":
        return "bg-yellow-500"
      case "težko":
        return "bg-red-500"
      default:
        return "bg-primary"
    }
  }

  const monthNames = [
    "Januar",
    "Februar",
    "Marec",
    "April",
    "Maj",
    "Junij",
    "Julij",
    "Avgust",
    "September",
    "Oktober",
    "November",
    "December",
  ]

  const dayNames = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"]

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground font-mono">
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Empty cells for first week */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const workout = getWorkoutForDate(year, month, day)
          const isCurrentDay = isToday(year, month, day)
          const isSelectedDay = workout && isSelected(workout)

          return (
            <button
              key={day}
              onClick={() => workout && onWorkoutSelect(workout)}
              className={`p-3 h-20 rounded-lg border-2 transition-all duration-200 relative ${
                isCurrentDay
                  ? "border-primary bg-primary/5"
                  : isSelectedDay
                    ? "border-primary bg-primary/10"
                    : workout
                      ? "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                      : "border-transparent hover:border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span
                  className={`text-sm font-medium mb-1 ${
                    isCurrentDay ? "text-primary" : workout ? "text-card-foreground" : "text-muted-foreground"
                  }`}
                >
                  {day}
                </span>
                {workout && (
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getLevelColor(workout.level)}`} />
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{workout.exercises?.length || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

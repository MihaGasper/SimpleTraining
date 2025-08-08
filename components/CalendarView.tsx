'use client'
import { useState } from 'react'

interface CalendarViewProps {
  workouts: any[]
  onWorkoutSelect: (workout: any) => void
  selectedWorkout: any
}

export default function CalendarView({ workouts, onWorkoutSelect, selectedWorkout }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  // Get first day of month and how many days in month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  // Create workout lookup by date
  const workoutsByDate = workouts.reduce((acc, workout) => {
    acc[workout.date] = workout
    return acc
  }, {})

  // Generate calendar days
  const calendarDays = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const workout = workoutsByDate[dateStr]
    const isToday = dateStr === today.toISOString().split('T')[0]
    const isSelected = selectedWorkout?.date === dateStr
    
    calendarDays.push({
      day,
      dateStr,
      workout,
      isToday,
      isSelected
    })
  }

  const monthNames = [
    'Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij',
    'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'
  ]

  const dayNames = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob']

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Danes
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={index} className="p-3 h-16" />
          }

          const { day, dateStr, workout, isToday, isSelected } = dayData
          
          return (
            <div
              key={dateStr}
              className={`
                relative p-3 h-16 border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
                ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isToday ? 'bg-blue-100' : ''}
              `}
              onClick={() => workout && onWorkoutSelect(workout)}
            >
              <div className="flex flex-col h-full">
                <span className={`
                  text-sm
                  ${isToday ? 'font-bold text-blue-700' : 'text-gray-700'}
                  ${!workout ? 'text-gray-400' : ''}
                `}>
                  {day}
                </span>
                
                {workout && (
                  <div className="flex-1 flex items-end">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${workout.feedback ? 'bg-green-500' : 'bg-blue-500'}
                    `} />
                  </div>
                )}
              </div>

              {/* Tooltip on hover */}
              {workout && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  <div className="font-medium">Vadba: {dateStr}</div>
                  <div className="text-gray-300">
                    {workout.level} • {workout.equipment === 'bodyweight' ? 'Samo telo' : 'Z opremo'}
                  </div>
                  {workout.feedback && (
                    <div className="text-green-300 text-xs mt-1">✓ Ocenjeno</div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Vadba opravljena</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Z oceno</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border-2 border-blue-500 rounded-full" />
          <span>Danes</span>
        </div>
      </div>
    </div>
  )
}

// Add hover effect with CSS-in-JS style approach
const style = `
  .calendar-day:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
  }
`
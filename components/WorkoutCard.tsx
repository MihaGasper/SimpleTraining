'use client'
import { useState } from 'react'

interface WorkoutCardProps {
  workout: any
  onFeedbackSave: (feedback: string) => void
}

export default function WorkoutCard({ workout, onFeedbackSave }: WorkoutCardProps) {
  const [feedback, setFeedback] = useState(workout.feedback || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return
    
    setIsSubmitting(true)
    await onFeedbackSave(feedback)
    setIsSubmitting(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('sl-SI', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isToday = workout.date === new Date().toISOString().split('T')[0]

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden
      ${isToday ? 'border-blue-200 shadow-blue-100' : 'border-gray-200'}
      hover:shadow-md hover:border-gray-300
    `}>
      {/* Header */}
      <div className={`
        px-6 py-4 border-b
        ${isToday ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' : 'bg-gray-50 border-gray-100'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full
              ${workout.feedback ? 'bg-green-500' : 'bg-blue-500'}
            `} />
            <div>
              <h3 className={`
                font-semibold
                ${isToday ? 'text-blue-900' : 'text-gray-900'}
              `}>
                {formatDate(workout.date)}
                {isToday && <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">DANES</span>}
              </h3>
              <p className="text-sm text-gray-600">
                {workout.level?.charAt(0).toUpperCase() + workout.level?.slice(1)} • {' '}
                {workout.equipment === 'bodyweight' ? 'Samo telo' : 'Z opremo'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`
        transition-all duration-300 overflow-hidden
        ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {workout.content}
            </pre>
          </div>

          {/* Feedback Section */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              💭 Kako ti je bila vadba?
            </h4>
            
            {workout.feedback ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">Tvoja ocena:</p>
                    <p className="text-sm text-green-700">{workout.feedback}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  placeholder="Opiši, kako ti je šla vadba... Kaj je bilo težko? Kaj ti je bilo všeč? 💪"
                  className="w-full p-4 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim() || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Shranjujem...
                      </span>
                    ) : (
                      '💾 Shrani oceno'
                    )}
                  </button>
                  <div className="text-xs text-gray-500">
                    Tvoja ocena nam pomaga izboljšati prihodnje vadbe
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsed Preview */}
      <div className={`
        transition-all duration-300 overflow-hidden
        ${!isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {workout.content?.split('\n').find(line => line.trim())?.substring(0, 120)}...
          </p>
        </div>
      </div>
    </div>
  )
}
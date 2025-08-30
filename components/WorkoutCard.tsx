"use client"
import { useState } from "react"
import { Star, Calendar, Clock, Target, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

interface Workout {
  id: string
  date: string
  level: string
  equipment: string
  exercises?: any[]
  feedback?: string
  duration?: number
  content?: string
}

interface WorkoutCardProps {
  workout: Workout
  onFeedbackSave: (feedback: string) => void
}

export default function WorkoutCard({ workout, onFeedbackSave }: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [feedback, setFeedback] = useState(workout.feedback || "")
  const [rating, setRating] = useState(0)

  const handleFeedbackSubmit = () => {
    onFeedbackSave(feedback)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sl-SI", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "lahko":
        return "bg-green-100 text-green-800 border-green-200"
      case "srednje":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "težko":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground font-mono">{formatDate(workout.date)}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getLevelColor(workout.level)}`}>
                  {workout.level}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">{workout.equipment === "bodyweight" ? "💪 Samo telo" : "🏋️ Z opremo"}</span>
              </div>
              {workout.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} min</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 border-t border-border pt-4">
            {workout.content && (
              <div>
                <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Vadba
                </h4>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="text-sm text-card-foreground whitespace-pre-wrap">
                    {workout.content}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Povratna informacija
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Ocena:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Kako se je počutila vadba? Kaj bi spremenil?"
                  className="w-full p-3 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  Shrani povratno informacijo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkoutCard({ workout, feedback, onFeedbackChange, onSubmitFeedback }) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500 font-medium">{workout.date}</p>
        <pre className="whitespace-pre-wrap mt-2 text-sm">{workout.content}</pre>
        {workout.feedback ? (
          <p className="mt-2 text-xs text-green-600 italic">Feedback: {workout.feedback}</p>
        ) : (
          <div className="mt-2">
            <textarea
              placeholder="Kako ti je bila vadba všeč?"
              className="w-full p-2 text-sm border rounded"
              value={feedback || ''}
              onChange={e => onFeedbackChange(e.target.value)}
            />
            <button
              onClick={onSubmitFeedback}
              className="mt-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >Shrani mnenje</button>
          </div>
        )}
      </div>
    )
  }
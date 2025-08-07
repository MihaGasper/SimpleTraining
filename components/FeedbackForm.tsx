export default function FeedbackForm({ workoutId, feedback, onChange, onSubmit }) {
    return (
      <div className="mt-2">
        <textarea
          placeholder="Kako ti je bila vadba všeč?"
          className="w-full p-2 text-sm border rounded"
          value={feedback || ''}
          onChange={e => onChange(workoutId, e.target.value)}
        />
        <button
          onClick={() => onSubmit(workoutId)}
          className="mt-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >Shrani mnenje</button>
      </div>
    )
  }
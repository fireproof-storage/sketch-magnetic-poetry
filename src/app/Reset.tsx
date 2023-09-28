import { useState } from 'react'

export default function Reset(props: { handleReset: () => void }) {
  const { handleReset } = props
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div>
      {!showConfirm && (
        <button
          className="bg-white hover:bg-red-200 px-2 py-1 rounded-sm"
          onClick={() => setShowConfirm(true)}
        >
          Reset poem
        </button>
      )}
      {showConfirm && (
        <div className="flex flex-row gap-2 justify-center items-center">
          <button
            className="bg-red-200 hover:bg-red-300 px-2 py-1 rounded-sm"
            onClick={() => {
              handleReset()
              setShowConfirm(false)
            }}
          >
            This will reset for everyone. I’m sure!
          </button>
          <button className="text-sm text-black/80 underline" onClick={() => setShowConfirm(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import type { Poem } from '@/partykit/shared'
import { useFireproof } from 'use-fireproof'

interface SavedPoemsProps {
  savedPoems: Poem[]
  setPoem: React.Dispatch<React.SetStateAction<Poem | null>>
}
const SavedPoem = ({
  poem,
  setPoem
}: {
  poem: Poem
  setPoem: React.Dispatch<React.SetStateAction<Poem | null>>
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSwipe = () => {
    console.log('swipe')
    setConfirmDelete(true)
  }

  return (
    <li
      className="p-4 hover:bg-yellow-100 hover:shadow-lg rounded-lg cursor-pointer"
      onClick={() => setPoem(poem)}
    >
      <p className="my-2">
        <span className="font-serif italic">
          {Object.values(poem.words)
            .map(w => `"${w.text}"`)
            .join(', ')}
        </span>
      </p>
      <div className="flex justify-end">
        <p className="text-xs">
          {poem.players} authors, Started on: {new Date(poem.startedAt).toLocaleDateString()}, at{' '}
          {new Date(poem.startedAt).toLocaleTimeString()}
        </p>
      </div>
    </li>
  )
}
export const SavedPoems = ({ savedPoems, setPoem }: SavedPoemsProps) => {
  const { database } = useFireproof('poetry-party')
  return (
    <div className="flex flex-col gap-2 items-center w-2/3">
      <h2 className="text-center mb-2">
        <span className="text-xl font-semibold">Saved Poems</span>{' '}(
        <button onClick={() => {
          database.openDashboard()
        }} className="underline hover:bg-yellow-100">
          🔥 import to Fireproof
        </button>)
      </h2>
      <ul className="list-reset space-y-4">
        {savedPoems.map((poem, i) => (
          <SavedPoem key={i} poem={poem} setPoem={setPoem} />
        ))}
      </ul>
    </div>
  )
}

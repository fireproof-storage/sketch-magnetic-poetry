import { useState } from 'react'
import Draggable from 'react-draggable'
import { DraggableData, DraggableEvent } from 'react-draggable'
import { Word, Words } from '@/partykit/shared'

export function MagneticPoem({
  words,
  setWords,
  handleTurn
}: {
  words: Words,
  setWords: (words: Words) => void
  handleTurn: (word: Word) => void
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleStop = (id: string, _e: DraggableEvent, data: DraggableData) => {
    const { x, y } = data
    const outOfBounds = x < 0 || y < 0 || x > 400 || y > 420
    setActiveId(id)
    if (outOfBounds) {
      setIsAnimating(true)
      setTimeout(() => {
        const newWords = { ...words }
        setWords(newWords)
        setIsAnimating(false)
      }, 500)
    } else {
      setIsAnimating(false)
      const newWords = { ...words }
      newWords[id].position = { x, y }
      setWords(newWords)
    }
  }

  const sharePosition = ({ x, y }: { x: number; y: number }, word: Word) => {
    const newWord = { ...word }
    newWord.position = { x, y }
    handleTurn(newWord)
  }

  return (
    <div>
      <div
        className="p-6 m-6"
        style={{ width: '512px', height: '512px', position: 'relative' }}
      >
        <div className="flex flex-wrap ">
          {[...Object.values(words)].map((word, index) => (
            <Draggable
              key={word.id}
              position={word.position}
              onDrag={(_e, data) => sharePosition(data, word)}
              onStart={() => setActiveId(word.id)}
              onStop={(e, data) => handleStop(word.id, e, data)}
            >
              <div
                className="m-2 p-2 bg-white text-black rounded-lg shadow-lg"
                style={{
                  position: 'absolute',
                  transition: isAnimating ? 'all 0.5s ease-in-out' : 'none',
                  zIndex: word.id === activeId ? 2 : 1
                }}
              >
                {word.text}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  )
}

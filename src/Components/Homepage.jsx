import React, { useState, useRef, useEffect } from 'react'
import Game from '../widgets/Game'

export default function Home(){
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const gameRef = useRef(null)

  // hide nav buttons when playing
  useEffect(() => {
    const nav = document.querySelector('header nav')
    if(nav) nav.style.display = playing ? 'none' : 'flex'
    return () => { if(nav) nav.style.display = 'flex' }
  }, [playing])

  return (
    <div className="w-full h-[calc(100vh-96px)] flex items-center justify-center">
      {!playing && (
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Click to Start — SurfRunner</h2>
          <p className="mb-6 text-white/90">Collect coins, dodge obstacles, and reach high scores.</p>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg"
              onClick={() => setPlaying(true)}
            >Start Game</button>
            <button
              className="px-6 py-3 rounded-xl text-lg font-semibold bg-white/90 text-black shadow"
              onClick={() => { window.location.hash = '#about' }}
            >About</button>
          </div>
        </div>
      )}

      {playing && (
        <div className="relative w-full h-full">
          <Game
            ref={gameRef}
            onExit={() => setPlaying(false)}
          />
        </div>
      )}
    </div>
  )
}
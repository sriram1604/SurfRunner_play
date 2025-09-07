import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './Components/Homepage.jsx'
import About from './Components/About.jsx'
import Contact from './Components/Contact.jsx'


export default function App(){
return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between">
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">SurfRunner</h1>
      <nav className="space-x-3">
        <Link className="px-3 py-1 rounded-md bg-white/80 text-black font-medium" to="/">Home</Link>
        <Link className="px-3 py-1 rounded-md bg-white/60 text-black/80" to="/about">About</Link>
        <Link className="px-3 py-1 rounded-md bg-white/60 text-black/80" to="/contact">Contact</Link>
      </nav>
    </header>


    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>


      <footer className="p-4 text-center text-sm text-black/60">Made with ❤️ — Demo runner</footer>
    </div>
)
}
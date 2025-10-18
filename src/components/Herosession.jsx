import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative h-96 overflow-hidden">
      <img
        src="public/header.png"
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold text-white mb-4">ovees</h2>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
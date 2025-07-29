'use client'

import { useEffect, useState } from 'react'
import AnimatedLines from './AnimatedLines'

export default function Hero() {
  // Configuration for the grid
  const columnCount = 25 // Number of squares horizontally
  const rowCount = 5 // Number of rows for the grids

  return (
    <section className="flex w-full flex-col items-center justify-between">
      {/* Top grid */}
      <div className="w-full">
        <AnimatedLines position="top" columnCount={columnCount} rowCount={rowCount} />
      </div>

      {/* Main content */}
      <div className="mb-6 mt-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          A credibly neutral home
          <br />
          for Ethereum infrastructure
        </h1>
      </div>

      {/* Bottom grid */}
      <div className="w-full">
        <AnimatedLines position="bottom" columnCount={columnCount} rowCount={rowCount} />
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import AnimatedGrid from './AnimatedGrid'

export default function Hero() {
  // Configuration for the grid
  const columnCount = 25 // Number of squares horizontally
  const topRowCount = 4 // Number of rows for the top grid
  const bottomRowCount = 4 // Number of rows for the bottom grid

  // Show borders on grid squares during development (set to false for production)
  const showGridBorders = true

  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center">
      {/* Top grid */}
      <div className="absolute left-0 right-0 top-0 w-full">
        <AnimatedGrid
          position="top"
          columnCount={columnCount}
          rowCount={topRowCount}
          showBorders={showGridBorders}
        />
      </div>

      {/* Main content */}
      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          A credible neutral home
          <br />
          for Ethereum infrastructure
        </h1>
      </div>

      {/* Bottom grid */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <AnimatedGrid
          position="bottom"
          columnCount={columnCount}
          rowCount={bottomRowCount}
          showBorders={showGridBorders}
        />
      </div>
    </section>
  )
}

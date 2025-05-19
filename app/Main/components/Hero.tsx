'use client'

import { useEffect, useState } from 'react'
import AnimatedGrid from './AnimatedGrid'

export default function Hero() {
  // Configuration for the grid
  const columnCount = 25 // Number of squares horizontally
  const rowCount = 5 // Number of rows for the grids

  // Show borders on grid squares during development (set to false for production)
  const showGridBorders = true

  return (
    <section className="flex w-full flex-col items-center justify-between">
      {/* Top grid */}
      <div className="w-full">
        <AnimatedGrid
          position="top"
          columnCount={columnCount}
          rowCount={rowCount}
          showBorders={showGridBorders}
        />
      </div>

      {/* Main content */}
      <div className="my-8 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          A credible neutral home
          <br />
          for Ethereum infrastructure
        </h1>
      </div>

      {/* Bottom grid */}
      {/* <div className="w-full">
        <AnimatedGrid
          position="bottom"
          columnCount={columnCount}
          rowCount={rowCount}
          showBorders={showGridBorders}
        />
      </div> */}
    </section>
  )
}

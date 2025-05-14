'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import GridSquare from './GridSquare'

type AnimatedGridProps = {
  position: 'top' | 'bottom'
  columnCount: number
  rowCount: number
  showBorders?: boolean
  className?: string
}

type SquareData = {
  id: string
  initialColor: 'anthracite' | 'amber' | 'transparent'
  changeInterval: number
  animationDuration: number
}

export default function AnimatedGrid({
  position,
  columnCount = 25,
  rowCount = 4,
  showBorders = false,
  className = '',
}: AnimatedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squareSize, setSquareSize] = useState(20) // Default fallback

  // Update square size when container width changes
  useEffect(() => {
    if (!containerRef.current) return

    const calculateSquareSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth
      // Calculate square size to fit exactly columnCount squares
      const newSize = Math.floor(containerWidth / columnCount)
      setSquareSize(newSize)
    }

    // Calculate on mount
    calculateSquareSize()

    // Recalculate when window is resized
    window.addEventListener('resize', calculateSquareSize)

    // Cleanup
    return () => window.removeEventListener('resize', calculateSquareSize)
  }, [columnCount])

  // Generate grid data
  const gridData = useMemo(() => {
    const data: SquareData[][] = []

    for (let row = 0; row < rowCount; row++) {
      const rowData: SquareData[] = []
      for (let col = 0; col < columnCount; col++) {
        // Randomize initial color and change intervals for organic feel
        const initialColorRand = Math.random()
        let initialColor: 'anthracite' | 'amber' | 'transparent' = 'transparent'

        // 10% chance of having a colored square initially
        if (initialColorRand > 0.9) {
          initialColor = initialColorRand > 0.95 ? 'amber' : 'anthracite'
        }

        // Randomize change interval (between 2-6 seconds)
        const changeInterval = 2000 + Math.random() * 4000

        // Also randomize animation duration (between 0.8-1.2 seconds)
        const animationDuration = 800 + Math.random() * 400

        rowData.push({
          id: `${row}-${col}`,
          initialColor,
          changeInterval,
          animationDuration: Math.round(animationDuration),
        })
      }
      data.push(rowData)
    }

    return data
  }, [rowCount, columnCount])

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-col">
        {gridData.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-row flex-nowrap">
            {row.map((square) => (
              <div key={square.id} className="flex-none">
                <GridSquare
                  size={squareSize}
                  showBorder={showBorders}
                  initialColor={square.initialColor}
                  changeInterval={square.changeInterval}
                  animationDuration={square.animationDuration}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

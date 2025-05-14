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

type ColorType = 'anthracite' | 'amber' | 'transparent'

export default function AnimatedGrid({
  position,
  columnCount = 25,
  rowCount = 4,
  showBorders = false,
  className = '',
}: AnimatedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squareSize, setSquareSize] = useState<number | null>(null) // Default fallback

  // Update square size when container width changes
  useEffect(() => {
    if (!containerRef.current) return

    const calculateSquareSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth
      // Calculate square size to fit exactly columnCount squares
      const newSize = containerWidth / columnCount
      setSquareSize(newSize)
    }

    // Calculate on mount
    calculateSquareSize()

    // Recalculate when window is resized
    window.addEventListener('resize', calculateSquareSize)

    // Cleanup
    return () => window.removeEventListener('resize', calculateSquareSize)
  }, [columnCount])

  // Generate grid data as a 2D array of colors
  const gridColors = useMemo(() => {
    // Create a 2D array initialized with transparent
    const grid: ColorType[][] = Array(rowCount)
      .fill(null)
      .map(() => Array(columnCount).fill('transparent' as ColorType))

    // For now, we'll just create a simple pattern to verify it works
    // We can add more complex patterns later
    if (position === 'top') {
      // Put a single line of colors in the middle row
      const middleRow = Math.floor(rowCount / 2)
      if (rowCount > 1) {
        for (let col = 0; col < columnCount; col++) {
          grid[middleRow][col] = col % 3 === 0 ? 'amber' : 'anthracite'
        }
      }
    } else {
      // Put a diagonal pattern in the bottom grid
      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < columnCount; col++) {
          if ((row + col) % 5 === 0) {
            grid[row][col] = 'anthracite'
          }
        }
      }
    }

    return grid
  }, [rowCount, columnCount, position])

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-col">
        {gridColors.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-row flex-nowrap">
            {row.map((color, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="flex-none">
                <GridSquare
                  size={squareSize}
                  showBorder={showBorders}
                  color={color}
                  animationDuration={800}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

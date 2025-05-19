'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import GridSquare from './GridSquare'

type AnimatedGridProps = {
  position: 'top' | 'bottom'
  columnCount: number
  rowCount: number
  showBorders?: boolean
  className?: string
}

export enum SqColor {
  Transparent = 0,
  Anthracite = 1,
  Amber = 2,
}

type Direction = 'up' | 'right' | 'down' | 'left'

// Direction vectors for each possible direction
const directionVectors = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
}

// Function to get orthogonal directions to the current direction
const getOrthogonalDirections = (dir: Direction): Direction[] => {
  switch (dir) {
    case 'up':
    case 'down':
      return ['left', 'right']
    case 'left':
    case 'right':
      return ['up', 'down']
  }
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
  const [grid, setGrid] = useState<SqColor[][] | null>(null)

  // Update square size when container width changes
  useEffect(() => {
    console.log('containerRef', containerRef.current)
    if (!containerRef.current) return

    const calculateSquareSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth
      // Calculate square size to fit exactly columnCount squares
      const newSize = Math.floor(containerWidth / columnCount)
      setSquareSize(newSize)
    }

    // Calculate on mount
    calculateSquareSize()
    setGrid(initialLines(rowCount, columnCount))

    // Recalculate when window is resized
    window.addEventListener('resize', calculateSquareSize)

    // Cleanup
    return () => window.removeEventListener('resize', calculateSquareSize)
  }, [columnCount, rowCount])

  const isOutsideGrid = (x: number, y: number) => {
    return x < 0 || x >= columnCount || y < 0 || y >= rowCount
  }

  const isFilled = (x: number, y: number, newGrid: SqColor[][]) => {
    return newGrid[y][x] !== SqColor.Transparent
  }

  // Function to generate grid with random lines and dots
  const initialLines = useCallback(
    (rows: number, cols: number): SqColor[][] => {
      // Initialize empty grid with transparent squares
      const newGrid: SqColor[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(SqColor.Transparent))
      console.log('newGrid', newGrid)

      // Generate random number of lines (4-8)
      // const numLines = 4 + Math.floor(Math.random() * 4)
      const numLines = 6

      let xDist = Math.floor(cols / numLines) + Math.floor(Math.random() * 5 - 2) // distribute lines across x with random offset
      console.log('xDist', xDist)

      let initialX = 0 - Math.floor(xDist / 2) // start at left edge because we'll add xDist to it
      console.log('initialX', initialX)

      // Draw each line
      for (let i = 0; i < numLines; i++) {
        initialX += xDist

        // next line starts at xDist from previous line and a random y
        let x = initialX
        let y = Math.floor(Math.random() * rows)
        console.log(`Line ${i} at x:${x},y:${y}`)

        xDist = Math.floor(cols / numLines) + Math.floor(Math.random() * 5 - 2)
        console.log(`new xDist after dot ${i}`, xDist)

        if (isOutsideGrid(x, y) || isFilled(x, y, newGrid)) {
          console.log('skipping', x, y)
          continue
        }

        // Random line length (3-7)
        const lineLength = 3 + Math.floor(Math.random() * 5)
        // const lineLength = 1
        console.log('lineLength', lineLength)

        // Choose initial random direction
        let direction: Direction = ['up', 'right', 'down', 'left'][
          Math.floor(Math.random() * 4)
        ] as Direction

        // Draw the line
        for (let j = 0; j < lineLength; j++) {
          // When outside grid, take modulo of x and y to wrap around
          if (x < 0) x = cols - 1
          if (x >= cols) x = 0
          if (y < 0) y = rows - 1
          if (y >= rows) y = 0
          console.log(`line ${i}, dot ${j} direction:${direction} drawing x:${x},y:${y}`)
          newGrid[y][x] = SqColor.Anthracite

          // Decide next direction (80% same, 20% orthogonal)
          if (Math.random() < 0.2) {
            // Change to an orthogonal direction
            const orthogonals = getOrthogonalDirections(direction)
            direction = orthogonals[Math.floor(Math.random() * orthogonals.length)]
            console.log(`line ${i}, dot ${j} new random direction:${direction} x:${x},y:${y}`)
          }

          // Move in the chosen direction
          const vector = directionVectors[direction]
          x += vector.dx
          y += vector.dy
        }
      }

      return newGrid
    },
    [columnCount, rowCount]
  )

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-col">
        {grid &&
          grid.map((row, rowIndex) => (
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

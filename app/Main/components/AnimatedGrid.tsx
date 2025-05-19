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

type Line = {
  dots: { x: number; y: number }[]
  length: number
  direction: Direction
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
  const [lines, setLines] = useState<Line[]>([])

  // Function to move a single line
  const moveLine = useCallback(
    (line: Line): Line => {
      // Get the first dot (head of the line)
      const head = line.dots[0]
      const vector = directionVectors[line.direction]

      // Calculate new head position
      let newX = head.x + vector.dx
      let newY = head.y + vector.dy

      // Wrap around edges
      if (newX < 0) newX = columnCount - 1
      if (newX >= columnCount) newX = 0
      if (newY < 0) newY = rowCount - 1
      if (newY >= rowCount) newY = 0

      // Create new dots array with new head and all dots except the last one
      const newDots = [{ x: newX, y: newY }, ...line.dots.slice(0, -1)]

      return {
        ...line,
        dots: newDots,
      }
    },
    [columnCount, rowCount]
  )

  // Animation effect
  useEffect(() => {
    if (lines.length === 0) return

    const interval = setInterval(() => {
      setLines((currentLines) => currentLines.map((line) => moveLine(line)))
    }, 1000)

    return () => clearInterval(interval)
  }, [lines.length, moveLine])

  const isOutsideGrid = useCallback(
    (x: number, y: number) => {
      return x < 0 || x >= columnCount || y < 0 || y >= rowCount
    },
    [columnCount, rowCount]
  )

  const isFilled = useCallback((x: number, y: number, newGrid: SqColor[][]) => {
    return newGrid[y][x] !== SqColor.Transparent
  }, [])

  // Function to generate grid with random lines and dots
  const initialLines = useCallback(
    (rows: number, cols: number): Line[] => {
      // Initialize empty grid with transparent squares
      const newGrid: SqColor[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(SqColor.Transparent))
      console.log('newGrid', newGrid)
      const newLines: Line[] = []

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

        // Initialize the line object before using it
        newLines[i] = {
          dots: [],
          length: lineLength,
          direction,
        }

        // Draw the line
        for (let j = 0; j < lineLength; j++) {
          // When outside grid, take modulo of x and y to wrap around
          if (x < 0) x = cols - 1
          if (x >= cols) x = 0
          if (y < 0) y = rows - 1
          if (y >= rows) y = 0
          console.log(`line ${i}, dot ${j} direction:${direction} drawing x:${x},y:${y}`)
          newLines[i].dots.push({ x, y })

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

        newLines[i].direction = direction
      }

      return newLines
    },
    [isOutsideGrid, isFilled]
  )

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

    // Initialize grid
    const newLines = initialLines(rowCount, columnCount)
    setLines(newLines)

    // Recalculate when window is resized
    window.addEventListener('resize', calculateSquareSize)

    // Cleanup
    return () => window.removeEventListener('resize', calculateSquareSize)
  }, [columnCount, rowCount, initialLines])

  // Update grid when lines change
  useEffect(() => {
    if (lines.length === 0) return

    // Initialize empty grid with transparent squares
    const newGrid: SqColor[][] = Array(rowCount)
      .fill(null)
      .map(() => Array(columnCount).fill(SqColor.Transparent))

    for (const line of lines) {
      for (const dot of line.dots) {
        newGrid[dot.y][dot.x] = SqColor.Anthracite
      }
    }
    setGrid(newGrid)
  }, [lines, rowCount, columnCount])

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
                    animationDuration={300}
                    className="transition-all ease-linear"
                  />
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

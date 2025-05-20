'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

type AnimatedLinesProps = {
  position: 'top' | 'bottom'
  columnCount: number
  rowCount: number
  className?: string
}

type Line = {
  id: string
  x: number
  y: number
  isHorizontal: boolean
  length: number
  color: 'anthracite' | 'amber'
}

export default function AnimatedLines({
  position,
  columnCount = 25,
  rowCount = 4,
  className = '',
}: AnimatedLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squareSize, setSquareSize] = useState(20) // Default fallback
  const [lines, setLines] = useState<Line[]>([])

  // Check if a position is occupied by any line
  const isPositionOccupied = (x: number, y: number, currentLineId: string, lines: Line[]) => {
    return lines.some((line) => {
      if (line.id === currentLineId) return false

      // Check if the position is within the line's area
      if (line.isHorizontal) {
        return y === line.y && x >= line.x && x < line.x + line.length
      } else {
        return x === line.x && y >= line.y && y < line.y + line.length
      }
    })
  }

  // Check if a line's new position would overlap with any other line
  const wouldOverlap = (newLine: Line, lines: Line[]) => {
    const { x, y, isHorizontal, length } = newLine

    // Check if the line would be outside the grid
    if (x < 0 || y < 0) return true
    if (isHorizontal && x + length > columnCount) return true
    if (!isHorizontal && y + length > rowCount) return true

    // Check each position the line would occupy
    for (let i = 0; i < length; i++) {
      const checkX = isHorizontal ? x + i : x
      const checkY = isHorizontal ? y : y + i

      // Check the position and its neighbors
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborX = checkX + dx
          const neighborY = checkY + dy

          // Skip if outside grid
          if (neighborX < 0 || neighborX >= columnCount || neighborY < 0 || neighborY >= rowCount) {
            continue
          }

          if (isPositionOccupied(neighborX, neighborY, newLine.id, lines)) {
            return true
          }
        }
      }
    }

    return false
  }

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

  // Initialize lines
  useEffect(() => {
    const initialLines: Line[] = []
    const numLines = 8

    for (let i = 0; i < numLines; i++) {
      // 75% chance of being horizontal
      const isHorizontal = Math.random() < 0.75
      const length = 1 + Math.floor(Math.random() * 5) // length between 1-5 units

      // Try to find a valid position
      let x, y
      let attempts = 0
      const maxAttempts = 50

      do {
        x = Math.floor(Math.random() * (columnCount - (isHorizontal ? length : 1)))
        y = Math.floor(Math.random() * (rowCount - (isHorizontal ? 1 : length)))
        attempts++
      } while (
        wouldOverlap(
          { id: `line-${i}`, x, y, isHorizontal, length, color: 'anthracite' },
          initialLines
        ) &&
        attempts < maxAttempts
      )

      // If we couldn't find a valid position, skip this line
      if (attempts >= maxAttempts) continue

      initialLines.push({
        id: `line-${i}`,
        x,
        y,
        isHorizontal,
        length,
        color: 'anthracite',
      })
    }

    setLines(initialLines)
  }, [columnCount, rowCount])

  // Move lines randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setLines((currentLines) =>
        currentLines.map((line) => {
          // Try to find a valid new position
          let newX, newY, newLength, newIsHorizontal
          let attempts = 0
          const maxAttempts = 10

          do {
            // Random movement (-1, 0, or 1 unit)
            let moveX, moveY
            if (line.isHorizontal) {
              // 25% chance to move vertically
              if (Math.random() < 0.25) {
                moveX = 0
                // Ensure vertical movement stays within bounds
                const newY = line.y + (Math.floor(Math.random() * 3) - 1)
                moveY = newY < 0 ? 0 : newY >= rowCount - 1 ? 0 : Math.floor(Math.random() * 3) - 1
              } else {
                // Ensure horizontal movement stays within bounds
                const newX = line.x + (Math.floor(Math.random() * 3) - 1)
                moveX =
                  newX < 0
                    ? 0
                    : newX + line.length > columnCount
                      ? 0
                      : Math.floor(Math.random() * 3) - 1
                moveY = 0
              }
            } else {
              // 25% chance to move horizontally
              if (Math.random() < 0.25) {
                // Ensure horizontal movement stays within bounds
                const newX = line.x + (Math.floor(Math.random() * 3) - 1)
                moveX =
                  newX < 0 ? 0 : newX >= columnCount - 1 ? 0 : Math.floor(Math.random() * 3) - 1
                moveY = 0
              } else {
                moveX = 0
                // Ensure vertical movement stays within bounds
                const newY = line.y + (Math.floor(Math.random() * 3) - 1)
                moveY =
                  newY < 0
                    ? 0
                    : newY + line.length > rowCount
                      ? 0
                      : Math.floor(Math.random() * 3) - 1
              }
            }

            // Random length between 1 and 5
            newLength = 1 + Math.floor(Math.random() * 5)

            // If length is 1, randomly reassign orientation with 75% chance of being horizontal
            newIsHorizontal = newLength === 1 ? Math.random() < 0.75 : line.isHorizontal

            // Calculate new position
            newX = line.x + moveX
            newY = line.y + moveY

            // Ensure the new position and length don't exceed grid boundaries
            if (newIsHorizontal) {
              if (newX + newLength > columnCount) newX = columnCount - newLength
            } else {
              if (newY + newLength > rowCount) newY = rowCount - newLength
            }

            attempts++
          } while (
            wouldOverlap(
              { ...line, x: newX, y: newY, length: newLength, isHorizontal: newIsHorizontal },
              currentLines
            ) &&
            attempts < maxAttempts
          )

          // If we couldn't find a valid position, keep the current position
          if (attempts >= maxAttempts) {
            return line
          }

          // Check if line becomes a square (1x1)
          const isSquare = newLength === 1

          return {
            ...line,
            x: newX,
            y: newY,
            length: newLength,
            isHorizontal: newIsHorizontal,
            color: isSquare ? 'amber' : 'anthracite',
          }
        })
      )
    }, 1000) // Move every second

    return () => clearInterval(interval)
  }, [columnCount, rowCount])

  return (
    <div
      ref={containerRef}
      className={`relative ${className} overflow-hidden border border-red-500`}
      style={{
        width: '100%',
        height: rowCount * squareSize,
      }}
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute rounded"
          animate={{
            x: line.x * squareSize,
            y: line.y * squareSize,
            width: line.isHorizontal ? line.length * squareSize : squareSize,
            height: line.isHorizontal ? squareSize : line.length * squareSize,
            backgroundColor: line.color === 'amber' ? '#D49B3F' : '#2D2725',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

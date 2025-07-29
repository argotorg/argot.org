'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

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
  color: 'anthracite' | 'amber' | 'ecru'
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
  const { theme } = useTheme()
  const [lineColor, setLineColor] = useState<'ecru' | 'anthracite'>('anthracite')

  // Update line color when theme changes
  useEffect(() => {
    setLineColor(theme === 'dark' ? 'ecru' : 'anthracite')
  }, [theme])

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

  // Check if a line's new position would overlap with any other line or go out of bounds
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

  // Initialize lines
  useEffect(() => {
    const initialLines: Line[] = []
    const numLines = 8
    const usedRows = new Set<number>()

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

        // For horizontal lines, try to use an unused row first
        if (isHorizontal && usedRows.size < rowCount) {
          // Find first unused row
          for (let row = 0; row < rowCount; row++) {
            if (!usedRows.has(row)) {
              y = row
              usedRows.add(row)
              break
            }
          }
        } else {
          // If all rows are used or it's a vertical line, use random position
          y = Math.floor(Math.random() * (rowCount - (isHorizontal ? 1 : length)))
        }

        attempts++
      } while (
        wouldOverlap(
          {
            id: `line-${i}`,
            x,
            y,
            isHorizontal,
            length,
            color: lineColor,
          },
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
        color: lineColor,
      })
    }

    setLines(initialLines)
  }, [columnCount, rowCount, lineColor])

  // Move lines randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setLines((currentLines) =>
        currentLines.map((line) => {
          // Try to find a valid new position
          let newX, newY, newLength, newIsHorizontal
          let attempts = 0
          const maxAttempts = 20 // Increased from 10 to handle larger movement ranges

          do {
            // Calculate movement for a line - respect orientation unless it's a dot
            const isDot = line.length === 1
            const calculateMovement = (isHorizontal: boolean) => ({
              moveX: isDot 
                ? calculateSecondaryMovement(line.x, columnCount) // Dots can move in any direction
                : isHorizontal
                ? calculatePrimaryMovement(line.x, line.length, columnCount) // Horizontal lines move horizontally
                : 0, // Vertical lines don't move horizontally
              moveY: isDot
                ? calculateSecondaryMovement(line.y, rowCount) // Dots can move in any direction  
                : isHorizontal
                ? 0 // Horizontal lines don't move vertically
                : calculatePrimaryMovement(line.y, line.length, rowCount), // Vertical lines move vertically
            })

            const { moveX, moveY } = calculateMovement(line.isHorizontal)
            
            // 60% chance to change length, allowing more dynamic growth/shrinking
            const shouldChangeLength = Math.random() < 0.6
            if (shouldChangeLength) {
              newLength = randomLength()
            } else {
              newLength = line.length
            }

            // If length is 1, randomly reassign orientation with 75% chance of being horizontal
            newIsHorizontal = newLength === 1 ? Math.random() < 0.75 : line.isHorizontal

            // Allow bidirectional growth/shrinking
            // 50% chance to grow/shrink from the beginning vs the end
            const growFromStart = Math.random() < 0.5
            
            if (shouldChangeLength && newLength !== line.length) {
              if (growFromStart && newLength < line.length) {
                // Shrinking from start: move position forward
                const shrinkAmount = line.length - newLength
                newX = line.x + moveX + (line.isHorizontal ? shrinkAmount : 0)
                newY = line.y + moveY + (!line.isHorizontal ? shrinkAmount : 0)
              } else {
                // Growing from start or shrinking/growing from end
                newX = line.x + moveX
                newY = line.y + moveY
              }
            } else {
              // Normal movement without length change
              newX = line.x + moveX
              newY = line.y + moveY
            }

            // Ensure the new position and length don't exceed grid boundaries
            if (newIsHorizontal) {
              if (newX + newLength > columnCount) {
                newX = Math.max(0, columnCount - newLength)
              }
              if (newX < 0) newX = 0
            } else {
              if (newY + newLength > rowCount) {
                newY = Math.max(0, rowCount - newLength)
              }
              if (newY < 0) newY = 0
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
            color: isSquare ? 'amber' : lineColor,
          }
        })
      )
    }, 1250) // Move every 1.25 second

    return () => clearInterval(interval)
  }, [columnCount, rowCount, lineColor])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
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
            backgroundColor:
              line.color === 'amber' ? '#D49B3F' : line.color === 'ecru' ? '#EADBCA' : '#2D2725',
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

function calculatePrimaryMovement(current: number, length: number, max: number) {
  // 75% chance for small movement (-1, 0, 1), 25% chance for larger jump (-2 to 2)
  const isLargeMove = Math.random() < 0.25
  
  let move
  if (isLargeMove) {
    // Larger movement range: -2 to +2 (reduced for better collision avoidance)
    move = Math.floor(Math.random() * 5) - 2
  } else {
    // Small movement: -1, 0, or +1
    move = Math.floor(Math.random() * 3) - 1
  }
  
  const newPos = current + move
  
  // Check bounds
  if (newPos < 0) return -current // Move to edge if out of bounds
  if (newPos + length > max) return max - length - current // Move to fit within bounds
  
  return move
}

function calculateSecondaryMovement(current: number, max: number) {
  // 30% chance for movement (balanced for more dynamic but controlled motion)
  if (Math.random() < 0.3) {
    // 85% chance for small move, 15% chance for larger jump  
    const isLargeMove = Math.random() < 0.15
    
    let move
    if (isLargeMove) {
      // Larger secondary movement: -2 to +2
      move = Math.floor(Math.random() * 5) - 2
    } else {
      // Small movement: -1 or +1
      move = Math.random() < 0.5 ? -1 : 1
    }
    
    const newPos = current + move

    // Check bounds
    if (newPos < 0) return -current
    if (newPos >= max) return max - 1 - current

    return move
  }
  // No movement
  return 0
}

function randomLength() {
  let newLength
  // Random length between 1 and 5 with weighted probabilities
  const random = Math.random()
  if (random < 0.05) {
    // 10% chance for length 1
    newLength = 1
  } else if (random < 0.2) {
    // 15% chance for length 2
    newLength = 2
  } else if (random < 0.55) {
    // 35% chance for length 3
    newLength = 3
  } else if (random < 0.8) {
    // 25% chance for length 4
    newLength = 4
  } else {
    // 20% chance for length 5
    newLength = 5
  }
  return newLength
}

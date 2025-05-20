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
      const x = Math.floor(Math.random() * columnCount)
      const y = Math.floor(Math.random() * rowCount)

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
          // Random movement (-1, 0, or 1 unit)
          const moveX = line.isHorizontal ? Math.floor(Math.random() * 3) - 1 : 0
          const moveY = line.isHorizontal ? 0 : Math.floor(Math.random() * 3) - 1

          // Random length between 1 and 5
          const newLength = 1 + Math.floor(Math.random() * 5)

          // Calculate new position
          const newX = line.x + moveX
          const newY = line.y + moveY

          // Check if line becomes a square (1x1)
          const isSquare = newLength === 1

          return {
            ...line,
            x: newX,
            y: newY,
            length: newLength,
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

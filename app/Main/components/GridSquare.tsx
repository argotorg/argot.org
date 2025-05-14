'use client'

import { useState, useEffect } from 'react'

type GridSquareProps = {
  size: number
  showBorder?: boolean
  initialColor?: 'anthracite' | 'amber' | 'transparent'
  changeInterval?: number
  animationDuration?: number
}

export default function GridSquare({
  size,
  showBorder = false,
  initialColor = 'transparent',
  changeInterval = 3000,
  animationDuration = 1000,
}: GridSquareProps) {
  const [color, setColor] = useState<'anthracite' | 'amber' | 'transparent'>(initialColor)

  // Randomly change color
  useEffect(() => {
    // Random interval around the specified interval (±30% variation)
    const variation = changeInterval * 0.3
    const randomInterval = Math.floor(changeInterval - variation + Math.random() * variation * 2)

    const timer = setTimeout(() => {
      const colors: ('anthracite' | 'amber' | 'transparent')[] = [
        'anthracite',
        'amber',
        'transparent',
      ]
      const currentIndex = colors.indexOf(color)
      const nextIndex = (currentIndex + 1 + Math.floor(Math.random() * 2)) % colors.length
      setColor(colors[nextIndex])
    }, randomInterval)

    return () => clearTimeout(timer)
  }, [color, changeInterval])

  const getBackgroundColor = () => {
    switch (color) {
      case 'anthracite':
        return 'bg-anthracite dark:bg-anthracite-600'
      case 'amber':
        return 'bg-amber-500'
      case 'transparent':
      default:
        return 'bg-transparent'
    }
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        transitionDuration: `${animationDuration}ms`,
      }}
      className={`
        ${getBackgroundColor()}
        transition-colors
        ${showBorder ? 'border border-red-500' : ''}
      `}
    />
  )
}

'use client'

import { SqColor } from './AnimatedGrid'

type GridSquareProps = {
  size: number | null
  showBorder?: boolean
  color: SqColor
  animationDuration?: number
  className?: string
}

export default function GridSquare({
  size,
  showBorder = false,
  color = SqColor.Transparent,
  animationDuration = 800,
  className = '',
}: GridSquareProps) {
  if (!size) {
    return null
  }

  const getBackgroundColor = () => {
    switch (color) {
      case SqColor.Anthracite:
        return 'bg-anthracite dark:bg-anthracite-600'
      case SqColor.Amber:
        return 'bg-amber-500'
      case SqColor.Transparent:
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
        ${className}
      `}
    />
  )
}

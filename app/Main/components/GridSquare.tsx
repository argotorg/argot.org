'use client'

type GridSquareProps = {
  size: number | null
  showBorder?: boolean
  color: 'anthracite' | 'amber' | 'transparent'
  animationDuration?: number
}

export default function GridSquare({
  size,
  showBorder = false,
  color = 'transparent',
  animationDuration = 800,
}: GridSquareProps) {
  if (!size) {
    return null
  }

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

'use client'

import { useEffect } from 'react'
import { logArgotAscii } from '../lib/argot-ascii'

export default function ConsoleLogger() {
  useEffect(() => {
    logArgotAscii()
  }, [])

  return null
}

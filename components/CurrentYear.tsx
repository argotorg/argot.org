'use client'

import { useEffect, useState } from 'react'

export default function CurrentYear() {
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return <div>{`© ${year}`}</div>
}

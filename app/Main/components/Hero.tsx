'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          A credible neutral home
          <br />
          for Ethereum infrastructure
        </h1>
      </div>
    </section>
  )
}

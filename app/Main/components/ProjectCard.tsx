'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import { BiX, BiLinkExternal } from 'react-icons/bi'
import Image from 'next/image'
import { Project } from '../data/projects'

export default function ProjectCard({ title, description, longDescription, url, logo }: Project) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsModalOpen(true)
          }
        }}
        className="group w-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <div className="relative h-full overflow-hidden rounded-lg bg-ecru-300 p-6 dark:bg-anthracite-600">
          <div className="relative z-10">
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-anthracite dark:text-ecru">
              {title}
            </h3>
            <p className="text-lg text-anthracite-400 dark:text-ecru-400">{description}</p>
          </div>

          {/* Overlay */}
          <div className="absolute bottom-0 right-0 z-20 h-full w-full translate-y-full bg-amber-500/95 transition-transform duration-300 ease-in-out group-hover:translate-y-0 group-focus:translate-y-0">
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl font-bold text-anthracite">Read More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-anthracite/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
            aria-label="Close modal"
          />

          {/* Modal Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-50 mx-4 max-w-2xl translate-y-full rounded-lg bg-ecru p-6 opacity-0 transition-all duration-300 ease-out dark:bg-anthracite-600 md:p-8"
            style={{
              animation: 'modalIn 0.3s ease-out forwards',
            }}
          >
            <style jsx>{`
              @keyframes modalIn {
                from {
                  transform: translateY(100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}</style>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-anthracite-400 transition-colors hover:text-anthracite dark:text-ecru-400 dark:hover:text-ecru"
              aria-label="Close modal"
            >
              <BiX className="h-8 w-8" />
            </button>

            <div className="mb-6 flex items-center gap-4">
              {logo && (
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={logo}
                    alt={`${title} logo`}
                    className="h-full w-full object-contain"
                    width={64}
                    height={64}
                  />
                </div>
              )}
              <h2 id="modal-title" className="text-3xl font-bold text-anthracite dark:text-ecru">
                {title}
              </h2>
            </div>

            <p className="mb-6 text-lg text-anthracite-400 dark:text-ecru-400">{longDescription}</p>

            <div>
              <Link
                href={url}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-anthracite transition-colors hover:bg-amber-600"
              >
                <BiLinkExternal className="h-5 w-5" />
                <span className="font-bold">Website</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

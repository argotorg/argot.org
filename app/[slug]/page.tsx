import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allOthers } from 'contentlayer/generated'
import type { Other } from 'contentlayer/generated'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug)
  const post = allOthers.find((p) => p.slug === slug)
  if (!post) {
    return
  }

  const ogImages = [
    {
      url: siteMetadata.socialBanner.includes('http')
        ? siteMetadata.socialBanner
        : siteMetadata.siteUrl + siteMetadata.socialBanner,
    },
  ]

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'website',
      url: './',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      images: [siteMetadata.socialBanner],
    },
  }
}

export const generateStaticParams = async () => {
  return allOthers.map((p) => ({ slug: p.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = decodeURI(params.slug)
  const post = allOthers.find((p) => p.slug === slug) as Other

  if (!post) {
    return notFound()
  }

  const jsonLd = post.structuredData

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <header className="mb-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {post.title}
            </h1>
          </header>
          <div className="prose-content">
            <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
          </div>
        </article>
      </div>
    </>
  )
}

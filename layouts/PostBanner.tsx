import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  className?: string
}

const DEFAULT_IMAGE = '/static/argot-banner-default.png'

export default function PostMinimal({ content, next, prev, children, className }: LayoutProps) {
  const { slug, title, images } = content
  const displayImage = images && images.length > 0 ? images[0] : DEFAULT_IMAGE

  return (
    <>
      <ScrollTopAndComment />
      <article className={className}>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            {displayImage !== DEFAULT_IMAGE && (
              <div className="w-full">
                <Bleed>
                  <div className="relative mx-auto aspect-[2/1] max-h-96 w-auto">
                    <Image src={displayImage} alt={title} fill className="object-cover" />
                  </div>
                </Bleed>
              </div>
            )}
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose max-w-none py-4 dark:prose-invert">{children}</div>
          {siteMetadata.comments && (
            <div className="pb-6 pt-6 text-center " id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-anthracite-500 hover:text-anthracite-600 dark:hover:text-anthracite-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-anthracite-500 hover:text-anthracite-600 dark:hover:text-anthracite-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}

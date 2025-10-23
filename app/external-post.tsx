import type { Blog } from 'contentlayer/generated'

export default function ExternalPost({ post }: { post: Blog }) {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="flex flex-col items-center justify-center">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            External Post
          </h1>
        </div>
        <div className="prose max-w-none pb-8 pt-2 dark:prose-invert">
          <p>
            This post {post.title} is hosted externally. Click the link below to read the full
            article on the original site.
          </p>

          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-lg bg-anthracite px-6 py-2 font-bold text-ecru transition-colors hover:bg-anthracite/90 dark:bg-amber-500 dark:text-anthracite"
          >
            Read on external site →
          </a>
        </div>
      </div>
    </div>
  )
}

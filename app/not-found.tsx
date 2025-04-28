import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="border-anthracite text-6xl font-extrabold leading-9 tracking-tight dark:border-ecru md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Sorry we couldn't find this page.
        </p>
        <p className="mb-8">But dont worry, you can find plenty of other things on our homepage.</p>
        <Link
          href="/"
          className="focus:shadow-outline-amber inline rounded-lg border border-transparent bg-anthracite px-4 py-2 text-sm font-medium leading-5 text-ecru shadow transition-colors duration-150 hover:bg-anthracite/90 focus:outline-none dark:bg-ecru-300 dark:text-anthracite dark:hover:bg-ecru-400"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}

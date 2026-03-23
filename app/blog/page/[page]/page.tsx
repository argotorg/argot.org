import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import reports, { reportsAsListPosts } from '@/data/reports'
import type { ListPost } from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalItems = allBlogs.length + reports.length
  const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default function Page({ params }: { params: { page: string } }) {
  const blogPosts: ListPost[] = allCoreContent(sortPosts(allBlogs))
  const allPosts = [...blogPosts, ...reportsAsListPosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const pageNumber = parseInt(params.page as string)
  const initialDisplayPosts = allPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={allPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}

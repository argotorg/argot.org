import ListLayout, { ListPost } from '@/layouts/ListLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { reportsAsListPosts } from '@/data/reports'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const blogPosts: ListPost[] = allCoreContent(sortPosts(allBlogs))
  const allPosts = [...blogPosts, ...reportsAsListPosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const pageNumber = 1
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

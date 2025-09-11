import { MetadataRoute } from 'next'
import { allBlogs, allOthers } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const otherRoutes = allOthers.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...otherRoutes]
}

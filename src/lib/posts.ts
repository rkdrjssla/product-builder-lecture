import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      return getPostBySlug(slug)
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null

  if (!filePath) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
    excerpt: data.excerpt ?? '',
    content,
    tags: data.tags ?? [],
  }
}

import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

async function getPostHtml(content: string) {
  const result = await remark().use(remarkHtml).process(content)
  return result.toString()
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const contentHtml = await getPostHtml(post.content)

  return (
    <article>
      <Link href="/blog" className="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block">
        ← 목록으로
      </Link>

      <header className="mb-8">
        <p className="text-sm text-gray-400 mb-2">{post.date}</p>
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  )
}

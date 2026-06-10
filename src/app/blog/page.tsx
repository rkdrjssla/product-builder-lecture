import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">전체 글</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">아직 작성된 글이 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-gray-100 pb-8">
              <Link href={`/blog/${post.slug}`} className="group block">
                <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                <h2 className="text-xl font-semibold mb-2 group-hover:underline">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

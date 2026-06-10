import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-3">블로그창업 일지</h1>
        <p className="text-gray-400 text-lg">
          Claude Code로 블로그를 만들고, 자동화 툴을 만들고, 1인 창업까지 — 그 과정을 기록합니다.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">최근 글</h2>
          <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">
            전체 보기 →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">아직 작성된 글이 없습니다.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <p className="text-xs text-gray-500 mb-1">{post.date}</p>
                  <h3 className="font-semibold text-white group-hover:underline">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

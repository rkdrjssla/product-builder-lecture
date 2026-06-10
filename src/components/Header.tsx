import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-800 py-5">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-white">
          블로그창업 일지
        </Link>
        <nav className="flex gap-6 text-sm text-gray-400">
          <Link href="/blog" className="hover:text-white transition-colors">글 목록</Link>
          <Link href="/about" className="hover:text-white transition-colors">소개</Link>
          <Link href="/admin" className="hover:text-orange-400 transition-colors text-orange-500">관리</Link>
        </nav>
      </div>
    </header>
  )
}

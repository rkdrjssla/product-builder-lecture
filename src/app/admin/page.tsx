'use client'

import { useState } from 'react'

interface GeneratedPost {
  title: string
  excerpt: string
  content: string
  tags: string[]
}

export default function AdminPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState<'casual' | 'formal'>('casual')
  const [generated, setGenerated] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ slug?: string; error?: string } | null>(null)

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setGenerated(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, tone }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setGenerated(data)
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : '생성 실패' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!generated) return
    setSaving(true)
    setResult(null)

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generated),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult({ slug: data.slug })
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : '저장 실패' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">글 자동화 툴</h1>
        <p className="text-sm text-gray-400 mt-1">AI로 글 생성 → 저장 → git push → Vercel 배포</p>
      </div>

      {/* 입력 */}
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">주제 *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="예: 블로그 창업 첫 달 수익 정산"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">핵심 키워드 <span className="text-gray-400 font-normal">(선택, SEO용)</span></label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: 애드센스, 수익화, 블로그 운영"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">어조</label>
          <div className="flex gap-3">
            {(['casual', 'formal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  tone === t
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {t === 'casual' ? '친근체' : '격식체'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          {loading ? '글 생성 중...' : 'AI로 글 생성'}
        </button>
      </section>

      {/* 생성 결과 */}
      {generated && (
        <section className="border border-gray-200 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">제목</label>
            <input
              type="text"
              value={generated.title}
              onChange={(e) => setGenerated({ ...generated, title: e.target.value })}
              className="w-full text-lg font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">요약 (검색 노출용)</label>
            <textarea
              value={generated.excerpt}
              onChange={(e) => setGenerated({ ...generated, excerpt: e.target.value })}
              rows={2}
              className="w-full text-sm text-gray-600 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">태그</label>
            <div className="flex flex-wrap gap-1.5">
              {generated.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">본문 (마크다운)</label>
            <textarea
              value={generated.content}
              onChange={(e) => setGenerated({ ...generated, content: e.target.value })}
              rows={16}
              className="w-full text-sm font-mono border border-gray-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-y"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {saving ? '저장 중...' : 'content/posts에 저장'}
          </button>
        </section>
      )}

      {/* 결과 */}
      {result && (
        <div className={`rounded-lg p-4 text-sm ${result.error ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
          {result.error ? (
            <p>오류: {result.error}</p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">저장 완료: <code className="bg-gray-200 px-1 rounded">content/posts/{result.slug}.md</code></p>
              <p className="text-gray-500">이제 git push하면 Vercel이 자동 배포합니다.</p>
              <code className="block bg-gray-200 px-3 py-2 rounded text-xs mt-1">
                git add . && git commit -m "post: {result.slug}" && git push
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

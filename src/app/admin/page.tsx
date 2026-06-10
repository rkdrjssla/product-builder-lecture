'use client'

import { useState } from 'react'

interface GeneratedPost {
  title: string
  titleCandidates: string[]
  excerpt: string
  content: string
  tags: string[]
}

const TITLE_STYLES = [
  { value: 'number', label: '숫자형', example: '"5가지 방법"' },
  { value: 'question', label: '질문형', example: '"왜 안될까?"' },
  { value: 'empathy', label: '공감형', example: '"나도 그랬다"' },
  { value: 'compare', label: '비교형', example: '"A vs B"' },
]

const PURPOSES = [
  { value: 'info', label: '정보 제공' },
  { value: 'experience', label: '경험 공유' },
  { value: 'solve', label: '문제 해결' },
]

export default function AdminPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [target, setTarget] = useState('')
  const [tone, setTone] = useState<'casual' | 'formal'>('casual')
  const [purpose, setPurpose] = useState('info')
  const [titleStyle, setTitleStyle] = useState('number')

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
        body: JSON.stringify({ topic, keywords, tone, target, purpose, titleStyle }),
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
          <label className="block text-sm font-medium mb-1.5">
            타겟 독자 <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="예: 부업을 시작하고 싶은 직장인 30대"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            핵심 키워드 <span className="text-gray-400 font-normal">(선택, SEO용)</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: 애드센스, 수익화, 블로그 운영"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">글의 목적</label>
            <div className="flex flex-col gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPurpose(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border text-left transition-colors ${
                    purpose === p.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">어조</label>
            <div className="flex flex-col gap-2">
              {(['casual', 'formal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm border text-left transition-colors ${
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">후킹 제목 스타일</label>
          <div className="grid grid-cols-2 gap-2">
            {TITLE_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setTitleStyle(s.value)}
                className={`px-3 py-2 rounded-lg text-sm border text-left transition-colors ${
                  titleStyle === s.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <span className="font-medium">{s.label}</span>
                <span className={`block text-xs mt-0.5 ${titleStyle === s.value ? 'text-gray-300' : 'text-gray-400'}`}>
                  {s.example}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          {loading ? 'AI가 글 쓰는 중...' : 'AI로 글 생성'}
        </button>
      </section>

      {/* 생성 결과 */}
      {generated && (
        <section className="border border-gray-200 rounded-xl p-5 space-y-5">

          {/* 제목 후보 */}
          {generated.titleCandidates?.length > 0 && (
            <div>
              <label className="block text-xs text-gray-400 mb-2">제목 후보 — 클릭해서 선택</label>
              <div className="space-y-2">
                {generated.titleCandidates.map((candidate, i) => (
                  <button
                    key={i}
                    onClick={() => setGenerated({ ...generated, title: candidate })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                      generated.title === candidate
                        ? 'border-gray-900 bg-gray-50 font-medium'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {candidate}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">최종 제목 (직접 수정 가능)</label>
            <input
              type="text"
              value={generated.title}
              onChange={(e) => setGenerated({ ...generated, title: e.target.value })}
              className="w-full text-lg font-semibold focus:outline-none border-b border-gray-100 pb-1"
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
              rows={18}
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
              <p className="font-medium">저장 완료 → <code className="bg-gray-200 px-1 rounded">content/posts/{result.slug}.md</code></p>
              <code className="block bg-gray-200 px-3 py-2 rounded text-xs">
                git add . && git commit -m "post: {result.slug}" && git push
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

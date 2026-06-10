import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { topic, keywords, tone } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: '주제(topic)가 필요합니다' }, { status: 400 })
  }

  const toneGuide = tone === 'formal' ? '정중하고 전문적인 어조' : '친근하고 편안한 구어체'

  const prompt = `당신은 블로그 창업 및 1인 사업에 관한 글을 쓰는 전문 블로거입니다.

다음 조건으로 블로그 글을 작성해주세요:
- 주제: ${topic}
${keywords ? `- 핵심 키워드: ${keywords}` : ''}
- 어조: ${toneGuide}
- 분량: 800~1200자
- 형식: 마크다운 (h2, h3, 목록 활용)
- SEO를 위해 키워드를 자연스럽게 포함
- 실용적인 팁이나 경험을 담아 독자에게 가치 제공

다음 JSON 형식으로만 응답해주세요:
{
  "title": "글 제목",
  "excerpt": "2-3문장 요약",
  "content": "마크다운 본문",
  "tags": ["태그1", "태그2", "태그3"]
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON 파싱 실패')

    const post = JSON.parse(jsonMatch[0])
    return NextResponse.json(post)
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

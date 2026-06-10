import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { topic, keywords, tone } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: '주제(topic)가 필요합니다' }, { status: 400 })
  }

  const toneGuide = tone === 'formal' ? '정중하고 전문적인 어조' : '친근하고 편안한 구어체'

  const prompt = `당신은 블로그 창업과 1인 사업을 직접 운영하며 경험을 공유하는 블로거입니다.

다음 조건으로 블로그 글을 작성해주세요:
- 주제: ${topic}
${keywords ? `- 반드시 포함할 키워드: ${keywords}` : ''}
- 어조: ${toneGuide}
- 분량: 2000~3000자 (넉넉하게 작성)
- 형식: 마크다운
  - 도입부: 독자의 공감을 끌어내는 2~3문장
  - ## 소목차 3~5개로 구성
  - 각 소목차 아래 충분한 설명 + 실전 팁
  - 마무리: 핵심 요약 + 독자에게 한 마디
- SEO: 제목과 소목차에 키워드 자연스럽게 배치
- 실제 경험담, 구체적인 수치, 실천 가능한 팁을 담아 독자에게 실질적 가치 제공
- 중간에 **강조**, 목록(- ), 인용(>) 등 마크다운 요소 적극 활용

다음 JSON 형식으로만 응답해주세요 (content 안에 마크다운 그대로):
{
  "title": "검색 유입에 유리한 구체적인 제목",
  "excerpt": "검색 결과에 노출될 2~3문장 요약 (핵심 키워드 포함)",
  "content": "마크다운 본문 전체",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"]
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
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

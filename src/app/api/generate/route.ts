import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

const TITLE_STYLE_GUIDE: Record<string, string> = {
  number: '숫자형 — "블로그 수익 월 100만원 만드는 5가지 방법"처럼 구체적인 숫자로 신뢰감과 기대감 유발',
  question: '질문형 — "블로그 6개월 해도 수익 0원인 이유가 뭘까?"처럼 독자가 궁금해할 질문으로 클릭 유도',
  empathy: '공감형 — "나도 처음엔 방문자 하루 3명이었다"처럼 독자의 현재 상황에 공감해서 신뢰 형성',
  compare: '비교형 — "티스토리 vs 직접 만든 블로그, 뭐가 더 나을까"처럼 선택지를 제시해 결정을 도와주는 형태',
}

const PURPOSE_GUIDE: Record<string, string> = {
  info: '정보 제공 — 독자가 모르는 지식이나 방법을 알기 쉽게 설명',
  experience: '경험 공유 — 실제 경험담과 솔직한 후기로 공감과 신뢰 형성',
  solve: '문제 해결 — 독자가 겪는 구체적인 문제를 해결해주는 실전 가이드',
}

export async function POST(req: NextRequest) {
  const { topic, keywords, tone, target, purpose, titleStyle } = await req.json()

  if (!topic) {
    return NextResponse.json({ error: '주제(topic)가 필요합니다' }, { status: 400 })
  }

  const toneGuide = tone === 'formal' ? '정중하고 전문적인 어조' : '친근하고 편안한 구어체'
  const titleGuide = TITLE_STYLE_GUIDE[titleStyle] ?? TITLE_STYLE_GUIDE.number
  const purposeGuide = PURPOSE_GUIDE[purpose] ?? PURPOSE_GUIDE.info

  const prompt = `당신은 블로그 창업과 1인 사업을 직접 운영하며 경험을 공유하는 블로거입니다.

## 글 작성 조건

- 주제: ${topic}
${keywords ? `- 반드시 포함할 키워드: ${keywords}` : ''}
- 타겟 독자: ${target || '블로그 창업과 수익화에 관심 있는 누구나'}
- 글의 목적: ${purposeGuide}
- 어조: ${toneGuide}
- 분량: 2000~3000자

## 제목 작성 규칙

${titleGuide}

이 스타일로 제목 후보 3개를 먼저 만들고, 그 중 가장 클릭률이 높을 것 같은 제목을 최종 선택하세요.

## 본문 구조

- 도입부: 타겟 독자의 상황에 공감하는 2~3문장 (바로 본론으로)
- ## 소목차 3~5개
- 각 소목차: 충분한 설명 + 구체적 수치나 예시 + 실천 팁
- 마무리: 핵심 요약 1~2줄 + 독자에게 행동 유도 한 마디
- **강조**, 목록(- ), 인용(>) 적극 활용

## 응답 형식

반드시 아래 JSON 형식으로만 응답 (다른 텍스트 없이):
{
  "title": "최종 선택한 제목",
  "titleCandidates": ["후보1", "후보2", "후보3"],
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

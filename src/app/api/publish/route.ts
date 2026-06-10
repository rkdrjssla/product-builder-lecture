import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const { title, content, excerpt, tags } = await req.json()

  if (!title || !content) {
    return NextResponse.json({ error: 'title과 content가 필요합니다' }, { status: 400 })
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

  const date = new Date().toISOString().split('T')[0]
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: ${date}`,
    `excerpt: "${excerpt ?? ''}"`,
    `tags: [${(tags ?? []).map((t: string) => `"${t}"`).join(', ')}]`,
    '---',
    '',
  ].join('\n')

  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.md`)

  try {
    fs.writeFileSync(filePath, frontmatter + content)
    return NextResponse.json({ success: true, slug, filePath })
  } catch (err) {
    const message = err instanceof Error ? err.message : '파일 저장 실패'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

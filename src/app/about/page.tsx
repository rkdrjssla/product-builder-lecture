import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소개 | 블로그창업 일지',
  description: 'Claude Code로 블로그를 만들고, 자동화 툴을 구축하고, 1인 창업까지 도전하는 과정을 기록합니다.',
}

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">이 블로그에 대해</h1>
        <p className="text-gray-600 leading-relaxed">
          안녕하세요. <strong>블로그창업 일지</strong>는 Claude Code를 활용해 블로그를 직접 만들고,
          콘텐츠 자동화 툴을 구축하며, 1인 창업까지 도전하는 실전 과정을 기록하는 공간입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">어떤 글을 쓰나요?</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2"><span className="text-gray-400">—</span> 블로그 창업 과정과 수익화 전략</li>
          <li className="flex gap-2"><span className="text-gray-400">—</span> AI·자동화 툴 활용법</li>
          <li className="flex gap-2"><span className="text-gray-400">—</span> 1인 사업 운영 경험과 실전 팁</li>
          <li className="flex gap-2"><span className="text-gray-400">—</span> 개발 없이 서비스 만들기</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">연락처</h2>
        <p className="text-gray-600">
          궁금한 점이나 협업 제안은 아래 이메일로 연락해주세요.
        </p>
        <a
          href="mailto:gundahee6241@gmail.com"
          className="inline-block mt-2 text-gray-900 font-medium hover:underline"
        >
          gundahee6241@gmail.com
        </a>
      </section>
    </div>
  )
}

import Link from "next/link";
import { Card, SectionTitle, NewsletterStatusBadge, Badge } from "@/components/ui";
import { ActionButton } from "@/components/action-button";
import * as data from "@/lib/data";
import { createNewsletter } from "@/app/actions";
import { formatDate } from "@/lib/utils";
import { RECOMMENDED_COUNT, TITLE } from "@/lib/edm/build";
import type { NewsletterType } from "@/types";

const TYPES: { type: NewsletterType; period: string; desc: string }[] = [
  { type: "DAILY", period: "최근 24시간", desc: "오늘의 한 줄 · 정책 TOP 3 · 뉴스 TOP 5 · 오늘의 숫자 · 공인중개사 한마디" },
  { type: "WEEKLY", period: "월요일~일요일", desc: "이번 주 한눈에 · 정책 TOP 5 · 뉴스 TOP 10 · 서울·수도권 동향 · 다음 주 체크포인트" },
  { type: "MONTHLY", period: "지난 한 달", desc: "5줄 요약 · 정책 총정리 · 지역별 주택시장 · 거래량/가격/전세/미분양 · 다음 달 일정" },
];

export default async function EdmListPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const filter = (searchParams.type?.toUpperCase() as NewsletterType | undefined) ?? undefined;
  const newsletters = await data.listNewsletters(
    filter && ["DAILY", "WEEKLY", "MONTHLY"].includes(filter) ? filter : undefined,
  );

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="EDM Builder">EDM 만들기</SectionTitle>

      <div className="grid gap-4 md:grid-cols-3">
        {TYPES.map((t) => (
          <Card key={t.type} className="flex flex-col p-5">
            <div className="font-serif text-xs uppercase tracking-widest text-gold">{t.type}</div>
            <div className="mt-1 text-lg font-bold text-navy">{TITLE[t.type]}</div>
            <div className="mt-1 text-xs text-slate-400">대상기간: {t.period}</div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
            <div className="mt-3 text-xs text-slate-400">
              권장 콘텐츠: 정책 {RECOMMENDED_COUNT[t.type].policy}건 · 뉴스 {RECOMMENDED_COUNT[t.type].news}건
            </div>
            <ActionButton
              action={createNewsletter.bind(null, t.type)}
              className="btn-primary mt-3"
            >
              {t.type} 초안 생성
            </ActionButton>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-[#E3E7EC] px-5 py-3">
          <h3 className="text-sm font-bold text-navy">발행 이력</h3>
          <div className="flex gap-1.5 text-xs">
            <Link href="/edm" className={!filter ? "chip !border-navy !bg-navy !text-white" : "chip"}>전체</Link>
            {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((t) => (
              <Link key={t} href={`/edm?type=${t}`} className={filter === t ? "chip !border-navy !bg-navy !text-white" : "chip"}>
                {t}
              </Link>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E3E7EC] text-left text-xs text-slate-400">
              <th className="px-5 py-2 font-medium">제목</th>
              <th className="px-3 py-2 font-medium">유형</th>
              <th className="px-3 py-2 font-medium">기간</th>
              <th className="px-3 py-2 font-medium">항목</th>
              <th className="px-3 py-2 font-medium">상태</th>
              <th className="px-3 py-2 font-medium">수정</th>
              <th className="px-5 py-2" />
            </tr>
          </thead>
          <tbody>
            {newsletters.map((n) => (
              <tr key={n.id} className="border-b border-[#E3E7EC] last:border-0 hover:bg-cloud/60">
                <td className="px-5 py-3">
                  <Link href={`/edm/${n.id}`} className="font-medium text-navy hover:underline">
                    {n.headline}
                  </Link>
                </td>
                <td className="px-3 py-3"><Badge tone="slate">{n.type}</Badge></td>
                <td className="px-3 py-3 text-xs text-slate-500">{n.editionLabel}</td>
                <td className="px-3 py-3 text-xs text-slate-500">{n.items.length}</td>
                <td className="px-3 py-3"><NewsletterStatusBadge status={n.status} /></td>
                <td className="px-3 py-3 text-xs text-slate-400">{formatDate(n.updatedAt, true)}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/edm/${n.id}`} className="text-xs text-navy-premium hover:underline">열기 →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

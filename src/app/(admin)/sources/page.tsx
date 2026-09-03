import { Card, CardHeader, SectionTitle, TierBadge, Badge } from "@/components/ui";
import * as data from "@/lib/data";
import { SourceToggle } from "./sources-client";
import type { SourceKind } from "@/types";

const KIND_LABEL: Record<SourceKind, string> = {
  GOV_OFFICIAL: "정부·공공",
  STATISTICS: "공식통계",
  LAW: "법령",
  PRESS: "언론",
  SPECIALIST: "전문매체",
  BLOG_COMMUNITY: "블로그·커뮤니티",
};

export default async function SourcesPage() {
  const sources = await data.listSources();
  const byTier = { A: 0, B: 0, C: 0, D: 0 } as Record<string, number>;
  sources.forEach((s) => (byTier[s.tier] += 1));

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Sources">출처관리</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        정식 API·RSS·공개 피드를 우선 사용하며 robots·이용약관을 준수합니다. 기사 원문은 저장하지 않고 제목·언론사·발행일·URL·요약·키워드만
        보관합니다. EDM 에는 A·B 등급 자료를 중심으로 사용합니다.
      </p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="chip">A · {byTier.A}</span>
        <span className="chip">B · {byTier.B}</span>
        <span className="chip">C · {byTier.C}</span>
        <span className="chip">D · {byTier.D}</span>
      </div>

      <Card>
        <CardHeader title="Source Adapter 목록" eyebrow="Adapters" />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-[#E3E7EC] text-left text-xs text-slate-400">
                <th className="px-4 py-2 font-medium">기관/매체</th>
                <th className="px-3 py-2 font-medium">유형</th>
                <th className="px-3 py-2 font-medium">등급</th>
                <th className="px-3 py-2 font-medium">adapterKey</th>
                <th className="px-3 py-2 font-medium">지역</th>
                <th className="px-3 py-2 font-medium">피드</th>
                <th className="px-3 py-2 font-medium">사용</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-b border-[#E3E7EC] last:border-0">
                  <td className="px-4 py-2.5">
                    <a href={s.homepageUrl} target="_blank" rel="noreferrer" className="font-medium text-navy hover:underline">
                      {s.name}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{KIND_LABEL[s.kind]}</td>
                  <td className="px-3 py-2.5"><TierBadge tier={s.tier} /></td>
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{s.adapterKey}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{s.region ?? "-"}</td>
                  <td className="px-3 py-2.5">
                    {s.feedUrl ? <Badge tone="green">RSS</Badge> : <Badge tone="slate">Mock</Badge>}
                  </td>
                  <td className="px-3 py-2.5"><SourceToggle source={s} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

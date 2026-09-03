import { Card, SectionTitle, KpiCard } from "@/components/ui";
import * as data from "@/lib/data";
import { LeadsTable } from "./leads-client";

export default async function LeadsPage() {
  const leads = await data.listLeads();
  const by = (s: string) => leads.filter((l) => l.status === s).length;

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Consultation">상담고객 (전환 리드)</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        EDM 의 목적은 조회수가 아니라 공인중개사 상담 전환입니다. 전화·카카오·매도·매수·갈아타기·정책 상담 버튼 클릭이 리드로 기록됩니다.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="신규" value={by("new")} tone="gold" />
        <KpiCard label="연락함" value={by("contacted")} />
        <KpiCard label="전환" value={by("converted")} />
        <KpiCard label="종료" value={by("closed")} />
      </div>
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <LeadsTable leads={leads} />
        </div>
      </Card>
    </div>
  );
}

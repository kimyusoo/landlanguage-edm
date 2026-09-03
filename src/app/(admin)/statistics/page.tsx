import { Card, CardHeader, SectionTitle, VerificationBadge, DemoTag } from "@/components/ui";
import { MiniLine, MiniBar } from "@/components/charts";
import * as data from "@/lib/data";
import { formatValue, fmtDelta } from "@/lib/edm/build";
import { resolveSourceUrl } from "@/lib/utils";

export default async function StatisticsPage() {
  const stats = await data.listStatistics();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Market Data">시장통계</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        각 수치에는 <b>기준일</b>, <b>전월/전년 대비</b>, <b>데이터 출처</b>가 표시됩니다.
        출처와 기준일이 명확하지 않은 수치는 화면·EDM 에 게시하지 않습니다.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {stats.map((s) => {
          const isCount = s.unit === "건" || s.unit === "호";
          return (
            <Card key={s.id}>
              <CardHeader
                title={s.label}
                eyebrow={s.region ?? ""}
                action={<VerificationBadge v={s.verification} />}
              />
              <div className="p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-navy">{formatValue(s.value, s.unit)}</span>
                  {s.momChange != null && (
                    <span className="text-xs text-slate-500">전월 {fmtDelta(s.momChange)}</span>
                  )}
                  {s.yoyChange != null && (
                    <span className="text-xs text-slate-500">전년 {fmtDelta(s.yoyChange)}</span>
                  )}
                </div>
                {s.history && s.history.length > 1 && (
                  <div className="mt-3">
                    {isCount ? <MiniBar data={s.history} /> : <MiniLine data={s.history} />}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>기준일 {s.asOfDate}</span>
                  <span className="flex items-center gap-1.5">
                    <DemoTag />
                    <a href={resolveSourceUrl(s.sourceUrl, s.label, "all")} target="_blank" rel="noreferrer" className="text-navy-premium hover:underline">
                      데이터 출처
                    </a>
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

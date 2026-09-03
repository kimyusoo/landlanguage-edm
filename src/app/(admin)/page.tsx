import Link from "next/link";
import { KpiCard, Card, CardHeader, SectionTitle, Badge, DemoTag, ScoreBar } from "@/components/ui";
import { PolicyStatusBadge } from "@/components/ui";
import { ActionButton } from "@/components/action-button";
import * as data from "@/lib/data";
import { runCollectionAndAnalysis } from "@/app/actions";
import { pct } from "@/lib/utils";
import { providerStatus } from "@/config/env";

export default async function DashboardPage() {
  const [kpi, issues, newsletters, audit] = await Promise.all([
    data.dashboardKpis(),
    data.topIssues(5),
    data.listNewsletters(),
    data.listAudit(8),
  ]);
  const st = providerStatus();
  const review = newsletters.filter((n) => n.status === "REVIEW" || n.status === "DRAFT");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle eyebrow="Dashboard">오늘의 브리핑 현황</SectionTitle>
        <div className="flex gap-2">
          <ActionButton action={runCollectionAndAnalysis} className="btn-ghost">
            수집·분석 실행
          </ActionButton>
          <Link href="/edm" className="btn btn-primary">
            EDM 만들기
          </Link>
        </div>
      </div>

      {st.data === "MOCK" && (
        <div className="rounded-xl border border-dashed border-gold bg-gold/5 px-4 py-3 text-xs text-gold-dark">
          <b>Mock Mode</b> 로 실행 중입니다. 화면의 정책·뉴스·수치는 <DemoTag /> 이며, <code>.env</code> 에 API 키/DB 를
          연결하면 실제 데이터로 대체됩니다. (AI: {st.ai} · 메일: {st.email} · 카카오: {st.kakao})
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="오늘 수집 뉴스" value={kpi.collectedToday} hint="최근 24시간" />
        <KpiCard label="오늘 정책자료" value={kpi.policiesToday} />
        <KpiCard label="AI 분석 완료" value={kpi.analyzed} hint="이슈 클러스터" />
        <KpiCard label="검수 필요" value={kpi.needsReview} tone="gold" hint="초안·확인필요" />
        <KpiCard label="오늘 발송" value={kpi.sentToday} />
        <KpiCard label="총 구독자" value={kpi.totalSubs} hint="ACTIVE" />
        <KpiCard label="이메일 오픈율" value={pct(kpi.openRate)} />
        <KpiCard label="클릭률" value={pct(kpi.clickRate)} />
        <KpiCard label="상담전환" value={kpi.leads} tone="gold" />
        <KpiCard label="수신거부" value={kpi.unsubscribed} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            eyebrow="Priority"
            title="오늘 꼭 다뤄야 하는 부동산 이슈 TOP 5"
            action={<Link href="/news" className="text-xs text-navy-premium hover:underline">전체 뉴스 →</Link>}
          />
          <ul className="divide-y divide-[#E3E7EC]">
            {issues.map((c, i) => (
              <li key={c.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 font-serif text-lg font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/news/${c.id}`} className="font-semibold text-navy hover:underline">
                        {c.headline}
                      </Link>
                      <PolicyStatusBadge status={c.status} />
                      {c.isDemo && <DemoTag />}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{c.analysis?.oneLiner}</p>
                    <div className="mt-2 max-w-md space-y-1">
                      <ScoreBar label="종합점수" value={Math.round(c.analysis?.compositeScore ?? 0)} />
                      <ScoreBar label="서울·수도권" value={c.analysis?.scores.seoulMetroImpact ?? 0} />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">기사 {c.articleCount}건</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader eyebrow="Review Queue" title="검수 대기" />
            <div className="p-5">
              {review.length === 0 ? (
                <p className="text-sm text-slate-500">검수 대기 중인 초안이 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {review.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/edm/${n.id}`}
                        className="flex items-center justify-between rounded-lg border border-[#E3E7EC] px-3 py-2 text-sm hover:bg-cloud"
                      >
                        <span className="truncate">{n.title} · {n.editionLabel}</span>
                        <Badge tone="gold">{n.status}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Activity" title="최근 작업 로그" />
            <ul className="divide-y divide-[#E3E7EC] text-xs">
              {audit.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-2.5 text-slate-500">
                  <span>
                    <b className="text-navy">{a.actor}</b> · {a.action} · {a.entity}
                  </span>
                  <span>{new Date(a.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="font-serif text-xs uppercase tracking-widest text-gold">Editorial Rule</div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          모든 콘텐츠는 <b className="text-navy">FACT(사실)</b> · <b className="text-navy">INTERPRETATION(공인중개사 해설)</b> ·
          <b className="text-navy"> ACTION(소비자 확인사항)</b> 3단으로 구분됩니다. 출처·기준일이 없는 수치는 게시되지 않으며,
          정책은 발표일과 시행일, 확정/검토 상태를 구분합니다. 관리자 승인 전에는 자동 발송되지 않습니다.
        </p>
      </Card>
    </div>
  );
}

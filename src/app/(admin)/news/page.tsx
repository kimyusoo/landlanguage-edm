import Link from "next/link";
import { Card, SectionTitle, PolicyStatusBadge, DemoTag, ScoreBar } from "@/components/ui";
import * as data from "@/lib/data";
import { formatDate, resolveSourceUrl } from "@/lib/utils";

export default async function NewsPage() {
  const clusters = (await data.listClusters()).sort(
    (a, b) => (b.analysis?.compositeScore ?? 0) - (a.analysis?.compositeScore ?? 0),
  );

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="News & Issues">오늘의 뉴스 · 이슈 클러스터</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        중복 기사는 하나의 이슈로 통합됩니다. 종합점수(정책 중요도·시장 영향도·소비자 관심도 등 10개 지표)가 높은 순으로 정렬됩니다.
      </p>

      <div className="space-y-4">
        {clusters.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/news/${c.id}`} className="text-lg font-bold text-navy hover:underline">
                    {c.headline}
                  </Link>
                  <PolicyStatusBadge status={c.status} />
                  {c.isDemo && <DemoTag />}
                </div>
                <p className="mt-1.5 text-sm text-slate-600">{c.analysis?.oneLiner}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.analysis?.audienceTags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <div className="mt-3 grid max-w-xl gap-1 sm:grid-cols-2">
                  <ScoreBar label="종합점수" value={Math.round(c.analysis?.compositeScore ?? 0)} />
                  <ScoreBar label="정책 중요도" value={c.analysis?.scores.policyImportance ?? 0} />
                  <ScoreBar label="시장 영향도" value={c.analysis?.scores.marketImpact ?? 0} />
                  <ScoreBar label="세금 영향도" value={c.analysis?.scores.taxImpact ?? 0} />
                  <ScoreBar label="대출/금융" value={c.analysis?.scores.loanFinanceImpact ?? 0} />
                  <ScoreBar label="긴급성" value={c.analysis?.scores.urgency ?? 0} />
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-slate-400">
                <div>{formatDate(c.issueDate, true)}</div>
                <div className="mt-1">관련기사 {c.articleCount}건</div>
                <a
                  href={resolveSourceUrl(c.primarySourceUrl, c.headline, "all")}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-navy-premium hover:underline"
                >
                  원문·관련보도
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

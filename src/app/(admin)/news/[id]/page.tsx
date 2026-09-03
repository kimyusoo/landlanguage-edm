import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  SectionTitle,
  PolicyStatusBadge,
  VerificationBadge,
  DemoTag,
  ScoreBar,
  Badge,
} from "@/components/ui";
import * as data from "@/lib/data";
import { formatDate, dots, resolveSourceUrl } from "@/lib/utils";
import { PERSONA_LABEL, type Persona } from "@/types";

const PERSONA_ORDER: Persona[] = ["none", "onePlus", "multi", "buyer", "seller", "landlord", "tenant"];

export default async function ClusterDetail({ params }: { params: { id: string } }) {
  const res = await data.getCluster(params.id);
  if (!res) notFound();
  const { cluster, analysis, articles, policies } = res;

  return (
    <div className="space-y-6">
      <Link href="/news" className="text-xs text-slate-500 hover:underline">← 뉴스 목록</Link>
      <div className="flex flex-wrap items-center gap-2">
        <SectionTitle eyebrow="Issue Cluster">{cluster.headline}</SectionTitle>
      </div>
      <div className="-mt-4 flex flex-wrap items-center gap-2">
        <PolicyStatusBadge status={cluster.status} />
        {cluster.isDemo && <DemoTag />}
        {analysis && <VerificationBadge v={analysis.verification} />}
        <span className="text-xs text-slate-400">{formatDate(cluster.issueDate, true)}</span>
      </div>

      {analysis && (
        <>
          <Card className="p-5">
            <div className="label-eyebrow">① 한 줄 요약</div>
            <p className="mt-1 text-lg font-bold text-navy">{analysis.oneLiner}</p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="AI 요약" eyebrow="Summary" />
              <div className="space-y-4 p-5 text-sm leading-relaxed text-ink">
                <div>
                  <div className="mb-1 font-semibold text-navy">② 무슨 내용인가요?</div>
                  <p>{analysis.whatHappened}</p>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-navy">③ 왜 중요한가요?</div>
                  <p>{analysis.whyItMatters}</p>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-navy">④ 누구에게 영향을 줄까요?</div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.audienceTags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-navy">⑤ 공인중개사 POINT</div>
                  <ul className="list-disc space-y-1 pl-5">
                    {analysis.agentPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-navy">⑥ 지금 무엇을 확인해야 하나요?</div>
                  <ul className="list-disc space-y-1 pl-5">
                    {analysis.actionChecklist.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="중요도 분석" eyebrow="Scores" />
              <div className="space-y-2 p-5">
                <ScoreBar label="종합점수" value={Math.round(analysis.compositeScore)} />
                <ScoreBar label="정책 중요도" value={analysis.scores.policyImportance} />
                <ScoreBar label="시장 영향도" value={analysis.scores.marketImpact} />
                <ScoreBar label="소비자 관심도" value={analysis.scores.consumerInterest} />
                <ScoreBar label="중개 업무관련" value={analysis.scores.agentRelevance} />
                <ScoreBar label="서울·수도권" value={analysis.scores.seoulMetroImpact} />
                <ScoreBar label="세금 영향" value={analysis.scores.taxImpact} />
                <ScoreBar label="대출/금융" value={analysis.scores.loanFinanceImpact} />
                <ScoreBar label="투자 영향" value={analysis.scores.investmentImpact} />
                <ScoreBar label="실수요 영향" value={analysis.scores.enduserImpact} />
                <ScoreBar label="긴급성" value={analysis.scores.urgency} />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="FACT · INTERPRETATION · ACTION" eyebrow="Editorial Rule" />
            <div className="grid gap-px bg-[#E3E7EC] sm:grid-cols-3">
              <div className="bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">FACT · 사실</div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{analysis.fact}</p>
              </div>
              <div className="bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-gold-dark">INTERPRETATION · 해설</div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{analysis.interpretation}</p>
              </div>
              <div className="bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-navy">ACTION · 확인사항</div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{analysis.action}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="그래서 내 부동산에는?" eyebrow="Persona Impact" />
            <div className="grid gap-px bg-[#E3E7EC] sm:grid-cols-2 lg:grid-cols-3">
              {PERSONA_ORDER.map((p) => {
                const imp = analysis.impactByPersona[p];
                return (
                  <div key={p} className="bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy">{PERSONA_LABEL[p]}</span>
                      <span className="font-mono text-sm tracking-widest text-gold-dark">{dots(imp.level)}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{imp.note}</p>
                  </div>
                );
              })}
            </div>
            <p className="border-t border-[#E3E7EC] px-5 py-3 text-[11px] text-slate-400">
              ※ 매수·매도 판단을 단정적으로 지시하지 않습니다. 적용 여부는 주택 수·취득시기·지역·보유기간 등에 따라 달라질 수 있습니다.
            </p>
          </Card>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={`공식자료 (${policies.length})`} eyebrow="Tier A" />
          <ul className="divide-y divide-[#E3E7EC]">
            {policies.length === 0 && <li className="p-5 text-sm text-slate-500">연결된 공식자료가 없습니다.</li>}
            {policies.map((p) => (
              <li key={p.id} className="p-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-navy">{p.title}</span>
                  <PolicyStatusBadge status={p.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{p.plainSummary}</p>
                <div className="mt-2 text-xs text-slate-400">
                  {p.agency} · 발표 {formatDate(p.announcedAt)} · 시행 {p.effectiveAt ? formatDate(p.effectiveAt) : "미정"}
                  {" · "}
                  <a href={resolveSourceUrl(p.officialUrl, `${p.agency} ${p.title}`, "all")} target="_blank" rel="noreferrer" className="text-navy-premium hover:underline">원문·관련보도 보기</a>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title={`관련기사 (${articles.length})`} eyebrow="Tier B / A" />
          <ul className="divide-y divide-[#E3E7EC]">
            {articles.map((a) => (
              <li key={a.id} className="p-5">
                <div className="flex items-center gap-2">
                  <Badge tone={a.tier === "A" ? "navy" : "gold"}>{a.tier}</Badge>
                  <span className="text-xs text-slate-400">{a.publisher} · {formatDate(a.publishedAt, true)}</span>
                </div>
                <a href={resolveSourceUrl(a.url, a.title, "news")} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-medium text-navy hover:underline">
                  {a.title}
                </a>
                <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {a.keywords.map((k) => (
                    <span key={k} className="text-[11px] text-slate-400">#{k}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-[#E3E7EC] px-5 py-3 text-[11px] text-slate-400">
            기사 원문은 저장·복제하지 않습니다. 제목·언론사·발행일·URL·요약·키워드만 보관합니다.
          </p>
        </Card>
      </div>
    </div>
  );
}

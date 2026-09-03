import type {
  AiAnalysis,
  Article,
  ArticleCluster,
  GovernmentPolicy,
  MarketStatistic,
  Newsletter,
  NewsletterItem,
  NewsletterType,
  Persona,
} from "@/types";
import { PERSONA_LABEL } from "@/types";

/** EDM 렌더러가 기사 링크·원문 요약을 표시할 때 사용하는 축약형 */
export interface ArticleRef {
  title: string;
  publisher: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  tier: string;
}

function toArticleRef(a: Article): ArticleRef {
  return {
    title: a.title,
    publisher: a.publisher,
    url: a.url,
    excerpt: a.summary,
    publishedAt: a.publishedAt,
    tier: a.tier,
  };
}

let seq = 0;
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${(seq++).toString(36)}`;

export interface BuildInput {
  type: NewsletterType;
  periodStart: string;
  periodEnd: string;
  editionLabel: string;
  clusters: ArticleCluster[];
  analyses: Record<string, AiAnalysis>;
  policies: GovernmentPolicy[];
  statistics: MarketStatistic[];
  /** 기사 링크·원문 요약 표시용. 없으면 기사 목록은 비어 있습니다. */
  articles?: Article[];
  agentDisplayName: string;
  /** 관리자가 고른 클러스터 순서(상위 = 중요) */
  selectedClusterIds?: string[];
}

const RECOMMENDED_COUNT: Record<NewsletterType, { policy: number; news: number }> = {
  DAILY: { policy: 3, news: 5 },
  WEEKLY: { policy: 5, news: 10 },
  MONTHLY: { policy: 8, news: 12 },
};

const TITLE: Record<NewsletterType, string> = {
  DAILY: "오늘의 부동산 AI 브리핑",
  WEEKLY: "이번 주 부동산 AI 브리핑",
  MONTHLY: "한 달 부동산 시장 총정리",
};

function rankClusters(input: BuildInput): ArticleCluster[] {
  const { clusters, analyses, selectedClusterIds } = input;
  if (selectedClusterIds?.length) {
    const order = new Map(selectedClusterIds.map((id, i) => [id, i]));
    return [...clusters]
      .filter((c) => order.has(c.id))
      .sort((a, b) => (order.get(a.id)! - order.get(b.id)!));
  }
  return [...clusters].sort(
    (a, b) =>
      (analyses[b.id]?.compositeScore ?? 0) - (analyses[a.id]?.compositeScore ?? 0),
  );
}

/** "그래서 내 부동산에는?" 카드 본문 생성 */
export function personaCardBody(a: AiAnalysis): string {
  const order: Persona[] = ["none", "onePlus", "multi", "buyer", "seller", "landlord", "tenant"];
  return order
    .map((p) => {
      const imp = a.impactByPersona[p];
      const dots = "●".repeat(imp.level) + "○".repeat(5 - imp.level);
      return `${PERSONA_LABEL[p]}  ${dots}\n${imp.note}`;
    })
    .join("\n\n");
}

export function buildNewsletter(input: BuildInput): Newsletter {
  const ranked = rankClusters(input);
  const rec = RECOMMENDED_COUNT[input.type];
  const now = new Date().toISOString();
  const nlId = uid("nl");
  const items: NewsletterItem[] = [];
  let pos = 0;

  const articlesByCluster = (input.articles ?? []).reduce<Record<string, ArticleRef[]>>((acc, a) => {
    if (!a.clusterId) return acc;
    (acc[a.clusterId] ??= []).push(toArticleRef(a));
    return acc;
  }, {});
  const clusterArticles = (id: string) =>
    (articlesByCluster[id] ?? []).sort((x, y) => y.publishedAt.localeCompare(x.publishedAt));

  const topPolicyClusters = ranked
    .filter((c) => c.status !== "PRESS_REPORTED" && c.status !== "OUTLOOK")
    .slice(0, rec.policy);
  const policyPool = topPolicyClusters.length ? topPolicyClusters : ranked.slice(0, rec.policy);

  // 정책 TOP
  policyPool.forEach((c, i) => {
    const a = input.analyses[c.id];
    if (!a) return;
    const pol = input.policies.find((p) => p.clusterId === c.id);
    const arts = clusterArticles(c.id);
    items.push({
      id: uid("it"),
      newsletterId: nlId,
      clusterId: c.id,
      section: "policy_top",
      position: pos++,
      headline: `${String(i + 1).padStart(2, "0")}. ${a.oneLiner}`,
      body: [
        `[무슨 내용인가요?]\n${a.whatHappened}`,
        `[왜 중요한가요?]\n${a.whyItMatters}`,
        `[누구에게 영향을 줄까요?]\n${a.audienceTags.join("  ")}`,
        `[공인중개사 POINT]\n- ${a.agentPoints.join("\n- ")}`,
        `[지금 무엇을 확인해야 하나요?]\n- ${a.actionChecklist.join("\n- ")}`,
        `[FACT] ${a.fact}`,
        `[INTERPRETATION] ${a.interpretation}`,
        `[ACTION] ${a.action}`,
      ].join("\n\n"),
      sourceLabel: pol ? `${pol.agency}` : c.headline,
      sourceUrl: pol?.officialUrl ?? c.primarySourceUrl ?? arts[0]?.url,
      sourceDate: pol?.announcedAt ?? c.issueDate,
      verification: a.verification,
      meta: {
        status: c.status,
        scores: a.scores,
        composite: a.compositeScore,
        agency: pol?.agency,
        officialUrl: pol?.officialUrl,
        officialDocUrl: pol?.officialDocUrl,
        effectiveAt: pol?.effectiveAt ?? null,
        bullets: a.agentPoints.slice(0, 3),
        impactLabel: a.action,
        articles: arts.slice(0, 3),
      },
    });
  });

  // 뉴스 TOP — 기사 링크 + 원문 요약 포함 (클릭 시 원문으로 이동)
  ranked.slice(0, rec.news).forEach((c, i) => {
    const a = input.analyses[c.id];
    if (!a) return;
    const arts = clusterArticles(c.id);
    items.push({
      id: uid("it"),
      newsletterId: nlId,
      clusterId: c.id,
      section: "news_top",
      position: pos++,
      headline: `${String(i + 1).padStart(2, "0")}. ${c.headline}`,
      body: a.oneLiner,
      sourceLabel: `관련기사 ${c.articleIds.length}건`,
      sourceUrl: c.primarySourceUrl ?? arts[0]?.url,
      sourceDate: c.issueDate,
      verification: a.verification,
      meta: {
        articleCount: c.articleIds.length,
        status: c.status,
        primaryUrl: c.primarySourceUrl ?? arts[0]?.url ?? null,
        whatHappened: a.whatHappened,
        articles: arts.slice(0, 3),
      },
    });
  });

  // 오늘의 숫자 — 출처+기준일 검증된 것만
  const numbers = input.statistics.filter((s) => !!s.sourceUrl && !!s.asOfDate).slice(0, 6);
  numbers.forEach((s) => {
    items.push({
      id: uid("it"),
      newsletterId: nlId,
      section: "numbers",
      position: pos++,
      headline: s.label,
      body:
        `${formatValue(s.value, s.unit)}` +
        (s.momChange != null ? `  ·  전월 대비 ${fmtDelta(s.momChange)}` : "") +
        (s.yoyChange != null ? `  ·  전년 대비 ${fmtDelta(s.yoyChange)}` : ""),
      sourceLabel: `기준일 ${s.asOfDate}`,
      sourceUrl: s.sourceUrl,
      sourceDate: s.asOfDate,
      verification: s.verification,
      meta: {
        metricKey: s.metricKey,
        unit: s.unit,
        value: s.value,
        momChange: s.momChange ?? null,
        yoyChange: s.yoyChange ?? null,
        region: s.region ?? null,
        history: (s.history ?? []).slice(-6),
      },
    });
  });

  // 그래서 내 부동산에는? — 가장 중요한 이슈 기준
  const lead = ranked[0];
  if (lead && input.analyses[lead.id]) {
    items.push({
      id: uid("it"),
      newsletterId: nlId,
      clusterId: lead.id,
      section: "persona",
      position: pos++,
      headline: "그래서 내 부동산에는?",
      body: personaCardBody(input.analyses[lead.id]),
      sourceLabel: lead.headline,
      sourceUrl: lead.primarySourceUrl,
      sourceDate: lead.issueDate,
      verification: input.analyses[lead.id].verification,
    });
  }

  const agentComment = draftAgentComment(input.type, ranked, input.analyses);
  items.push({
    id: uid("it"),
    newsletterId: nlId,
    section: "comment",
    position: pos++,
    headline: `${input.agentDisplayName}의 한마디`,
    body: agentComment,
    verification: "VERIFIED",
  });

  const headline = draftHeadline(input.type, ranked, input.analyses);

  return {
    id: nlId,
    type: input.type,
    title: TITLE[input.type],
    editionLabel: input.editionLabel,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    status: "DRAFT",
    headline,
    agentComment,
    previewText: `${headline} · 정책 ${policyPool.length}건, 뉴스 ${Math.min(ranked.length, rec.news)}건 정리`,
    subjectLine: `[${TITLE[input.type]}] ${input.editionLabel} · ${headline}`,
    adPrefix: true,
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    items,
  };
}

function draftHeadline(
  type: NewsletterType,
  ranked: ArticleCluster[],
  analyses: Record<string, AiAnalysis>,
): string {
  const top = ranked[0] ? analyses[ranked[0].id] : undefined;
  if (!top) return "오늘 확인할 부동산 이슈를 정리했습니다";
  return top.oneLiner;
}

function draftAgentComment(
  type: NewsletterType,
  ranked: ArticleCluster[],
  analyses: Record<string, AiAnalysis>,
): string {
  const statuses = ranked
    .map((c) => c.status)
    .filter((s) => s === "UNDER_REVIEW" || s === "LEGISLATIVE_NOTICE" || s === "PRESS_REPORTED");
  const base =
    "정책은 '발표'보다 '적용 대상'과 '시행 시점'을 확인하는 것이 중요합니다.";
  if (statuses.length >= 2) {
    return `${base} 이번 회차는 검토·입법예고·언론 보도 단계의 사안이 많습니다. 확정된 내용과 논의 중인 내용을 구분해서 보시고, 개별 상황은 세무·법률 전문가와 함께 확인하시길 권합니다. (초안 — 관리자 수정 가능)`;
  }
  return `${base} 확정 정책과 검토 중 정책을 구분해서 판단하시고, 대출·세금 등 개인별 요건은 반드시 별도 확인하시길 권합니다. (초안 — 관리자 수정 가능)`;
}

export function formatValue(v: number, unit: string): string {
  if (unit === "만원") return `${v.toLocaleString("ko-KR")}만원`;
  if (unit === "건" || unit === "호") return `${v.toLocaleString("ko-KR")}${unit}`;
  if (unit === "%") return `${v > 0 ? "+" : ""}${v}%`;
  return `${v.toLocaleString("ko-KR")}${unit}`;
}

export function fmtDelta(v: number): string {
  if (v === 0) return "보합";
  const arrow = v > 0 ? "▲" : "▼";
  return `${arrow} ${Math.abs(v)}%`;
}

export { RECOMMENDED_COUNT, TITLE };

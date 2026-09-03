// ─────────────────────────────────────────────────────────────────────────────
// 데이터 접근 계층 (Repository)
// DATA_BACKEND=mock  → 인메모리 시드 데이터 (기본)
// DATA_BACKEND=prisma → 프로덕션 경로 (schema.prisma / 별도 구현 필요)
// 모든 함수는 async 로 선언되어 백엔드 교체 시 호출부 변경이 없습니다.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AiAnalysis,
  ArticleCluster,
  Campaign,
  ConsultationLead,
  GovernmentPolicy,
  MarketStatistic,
  Newsletter,
  NewsletterType,
  Source,
  Subscriber,
} from "@/types";
import { db, audit } from "@/lib/mock/store";

// ── 출처 ────────────────────────────────────────────────────────────
export async function listSources(): Promise<Source[]> {
  return db.sources;
}
export async function toggleSource(id: string, enabled: boolean) {
  const s = db.sources.find((x) => x.id === id);
  if (s) {
    s.enabled = enabled;
    audit({ actor: "admin", action: enabled ? "enable" : "disable", entity: "source", entityId: id });
  }
  return s;
}

// ── 클러스터 / 분석 / 기사 ─────────────────────────────────────────
export async function listClusters(): Promise<
  (ArticleCluster & { analysis?: AiAnalysis; articleCount: number })[]
> {
  return db.clusters.map((c) => ({
    ...c,
    analysis: db.analyses.find((a) => a.clusterId === c.id),
    articleCount: c.articleIds.length,
  }));
}

export async function getCluster(id: string) {
  const cluster = db.clusters.find((c) => c.id === id);
  if (!cluster) return null;
  return {
    cluster,
    analysis: db.analyses.find((a) => a.clusterId === id) ?? null,
    articles: db.articles.filter((a) => cluster.articleIds.includes(a.id)),
    policies: db.policies.filter((p) => cluster.policyIds.includes(p.id)),
  };
}

export async function topIssues(limit = 5) {
  const withScore = await listClusters();
  return withScore
    .filter((c) => c.analysis)
    .sort((a, b) => (b.analysis!.compositeScore ?? 0) - (a.analysis!.compositeScore ?? 0))
    .slice(0, limit);
}

export async function updateAnalysis(clusterId: string, patch: Partial<AiAnalysis>) {
  const a = db.analyses.find((x) => x.clusterId === clusterId);
  if (a) {
    Object.assign(a, patch);
    audit({ actor: "admin", action: "edit", entity: "analysis", entityId: a.id });
  }
  return a;
}

// ── 정책 ────────────────────────────────────────────────────────────
export async function listPolicies(): Promise<GovernmentPolicy[]> {
  return [...db.policies].sort((a, b) => b.announcedAt.localeCompare(a.announcedAt));
}

// ── 통계 ────────────────────────────────────────────────────────────
export async function listStatistics(): Promise<MarketStatistic[]> {
  return db.statistics;
}
/** 출처 URL·기준일이 있는 항목만 게시 가능 */
export async function publishableStatistics(): Promise<MarketStatistic[]> {
  return db.statistics.filter((s) => !!s.sourceUrl && !!s.asOfDate);
}

// ── 뉴스레터 ────────────────────────────────────────────────────────
export async function listNewsletters(type?: NewsletterType): Promise<Newsletter[]> {
  const all = [...db.newsletters].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return type ? all.filter((n) => n.type === type) : all;
}
export async function getNewsletter(id: string): Promise<Newsletter | null> {
  return db.newsletters.find((n) => n.id === id) ?? null;
}
export async function saveNewsletter(nl: Newsletter): Promise<Newsletter> {
  const idx = db.newsletters.findIndex((n) => n.id === nl.id);
  nl.updatedAt = new Date().toISOString();
  if (idx >= 0) db.newsletters[idx] = nl;
  else db.newsletters.unshift(nl);
  audit({ actor: "admin", action: idx >= 0 ? "update" : "create", entity: "newsletter", entityId: nl.id });
  return nl;
}
export async function setNewsletterStatus(id: string, status: Newsletter["status"], actor = "admin") {
  const nl = db.newsletters.find((n) => n.id === id);
  if (!nl) return null;
  nl.status = status;
  nl.updatedAt = new Date().toISOString();
  if (status === "APPROVED") {
    nl.approvedBy = actor;
    nl.approvedAt = new Date().toISOString();
  }
  audit({ actor, action: `status:${status}`, entity: "newsletter", entityId: id });
  return nl;
}
export async function updateNewsletterItem(
  newsletterId: string,
  itemId: string,
  patch: Partial<Newsletter["items"][number]>,
) {
  const nl = db.newsletters.find((n) => n.id === newsletterId);
  const item = nl?.items.find((i) => i.id === itemId);
  if (item) {
    Object.assign(item, patch);
    if (nl) nl.updatedAt = new Date().toISOString();
    audit({ actor: "admin", action: "edit-item", entity: "newsletter", entityId: newsletterId });
  }
  return item;
}

// ── 구독자 / 동의 / 수신거부 ──────────────────────────────────────
export async function listSubscribers(): Promise<Subscriber[]> {
  return db.subscribers;
}
export async function getSubscriber(id: string) {
  return db.subscribers.find((s) => s.id === id) ?? null;
}
export async function listConsentLogs() {
  return db.consentLogs;
}
export async function listSuppression() {
  return db.suppression;
}
export async function addSuppression(email: string, reason: "unsubscribe" | "bounce" | "complaint" | "manual") {
  if (db.suppression.some((s) => s.email === email)) return;
  db.suppression.push({
    id: `supp_${Date.now().toString(36)}`,
    email,
    reason,
    channel: "EMAIL",
    createdAt: new Date().toISOString(),
  });
  const sub = db.subscribers.find((s) => s.email === email);
  if (sub && reason === "unsubscribe") {
    sub.status = "UNSUBSCRIBED";
    sub.consentEmail = false;
    sub.consentKakao = false;
    sub.withdrawalDate = new Date().toISOString();
    db.consentLogs.push({
      id: `cl_${Date.now().toString(36)}`,
      subscriberId: sub.id,
      channel: "EMAIL",
      action: "withdraw",
      source: "unsubscribe_link",
      nightAd: false,
      createdAt: new Date().toISOString(),
    });
  }
  audit({ actor: "system", action: "suppress", entity: "subscriber", entityId: email });
}

/** 광고 발송 가능 대상 (동의 있음 + 수신거부 아님 + ACTIVE) */
export async function sendableSubscribers(channel: "EMAIL" | "KAKAO" = "EMAIL") {
  const suppressed = new Set(db.suppression.map((s) => s.email));
  return db.subscribers.filter((s) => {
    if (s.status !== "ACTIVE") return false;
    if (suppressed.has(s.email)) return false;
    return channel === "EMAIL" ? s.consentEmail : s.consentKakao;
  });
}

// ── 상담 리드 ──────────────────────────────────────────────────────
export async function listLeads(): Promise<ConsultationLead[]> {
  return [...db.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function updateLead(id: string, patch: Partial<ConsultationLead>) {
  const l = db.leads.find((x) => x.id === id);
  if (l) Object.assign(l, patch);
  return l;
}

// ── 캠페인 ──────────────────────────────────────────────────────────
export async function listCampaigns(): Promise<Campaign[]> {
  return [...db.campaigns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function getCampaign(id: string) {
  return db.campaigns.find((c) => c.id === id) ?? null;
}
export async function saveCampaign(c: Campaign) {
  const idx = db.campaigns.findIndex((x) => x.id === c.id);
  if (idx >= 0) db.campaigns[idx] = c;
  else db.campaigns.unshift(c);
  audit({ actor: "admin", action: idx >= 0 ? "update" : "create", entity: "campaign", entityId: c.id });
  return c;
}

// ── 설정 ────────────────────────────────────────────────────────────
export async function getBrand() {
  return db.brand;
}
export async function saveBrand(patch: Partial<typeof db.brand>) {
  Object.assign(db.brand, patch);
  audit({ actor: "admin", action: "update", entity: "brand" });
  return db.brand;
}
export async function getCompliance() {
  return db.compliance;
}
export async function saveCompliance(patch: Partial<typeof db.compliance>) {
  Object.assign(db.compliance, patch);
  audit({ actor: "admin", action: "update", entity: "compliance" });
  return db.compliance;
}
export async function listAudit(limit = 50) {
  return db.audit.slice(0, limit);
}

// ── 대시보드 KPI ───────────────────────────────────────────────────
export async function dashboardKpis() {
  const today = "2026-09-03";
  const collectedToday = db.articles.filter((a) => a.publishedAt.startsWith(today)).length;
  const policiesToday = db.policies.filter((p) => p.announcedAt.startsWith(today)).length;
  const analyzed = db.analyses.length;
  const needsReview = db.newsletters.filter((n) => n.status === "REVIEW" || n.status === "DRAFT").length +
    db.analyses.filter((a) => a.verification === "NEEDS_CHECK").length;
  const sentToday = db.campaigns.filter((c) => c.sentAt?.startsWith("2026-09-02") || c.sentAt?.startsWith(today)).length;
  const totalSubs = db.subscribers.filter((s) => s.status === "ACTIVE").length;

  const agg = db.campaigns.reduce(
    (acc, c) => {
      acc.sent += c.stats.sent;
      acc.opened += c.stats.opened;
      acc.clicked += c.stats.clicked;
      acc.leads += c.stats.leads;
      acc.unsub += c.stats.unsubscribed;
      return acc;
    },
    { sent: 0, opened: 0, clicked: 0, leads: 0, unsub: 0 },
  );

  return {
    collectedToday,
    policiesToday,
    analyzed,
    needsReview,
    sentToday,
    totalSubs,
    openRate: agg.sent ? Math.round((agg.opened / agg.sent) * 1000) / 10 : 0,
    clickRate: agg.sent ? Math.round((agg.clicked / agg.sent) * 1000) / 10 : 0,
    leads: agg.leads,
    unsubscribed: agg.unsub,
  };
}

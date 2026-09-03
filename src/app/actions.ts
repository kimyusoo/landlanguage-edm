"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Newsletter, NewsletterType } from "@/types";
import * as data from "@/lib/data";
import { db, audit } from "@/lib/mock/store";
import { buildNewsletter } from "@/lib/edm/build";
import { renderEmailHtml } from "@/lib/edm/render";
import { buildKakaoMessage } from "@/lib/kakao/message";
import { checkNewsletterCompliance, isNightNow } from "@/lib/compliance/check";
import { getAiAdapter } from "@/lib/adapters/ai";
import { getEmailAdapter } from "@/lib/adapters/email";
import type { RewriteMode } from "@/lib/adapters/types";
import { env } from "@/config/env";

// ── 데모 데이터 초기화 ───────────────────────────────────────────
export async function resetDemoData() {
  const { resetDb } = await import("@/lib/mock/store");
  resetDb();
  revalidatePath("/", "layout");
}

// ── 수집/분석 시뮬레이션 (Mock) ───────────────────────────────────
export async function runCollectionAndAnalysis() {
  // Mock: 이미 시드된 클러스터/분석을 '재분석' 처리하고 감사로그를 남깁니다.
  audit({ actor: "admin", action: "run", entity: "pipeline", entityId: "collect+analyze" });
  db.analyses.forEach((a) => {
    a.model = getAiAdapter().name;
  });
  revalidatePath("/");
  revalidatePath("/news");
}

// ── 뉴스레터 생성 ─────────────────────────────────────────────────
export async function createNewsletter(type: NewsletterType) {
  const analysesByCluster = Object.fromEntries(db.analyses.map((a) => [a.clusterId, a]));
  const now = new Date();
  const periods: Record<NewsletterType, { start: Date; end: Date; label: string }> = {
    DAILY: {
      start: new Date(now.getTime() - 86400000),
      end: now,
      label: now.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\.$/, ""),
    },
    WEEKLY: {
      start: new Date(now.getTime() - 7 * 86400000),
      end: now,
      label: `${new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10)} – ${now.toISOString().slice(0, 10)}`,
    },
    MONTHLY: {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0),
      label: `${now.getFullYear()}.${String(now.getMonth()).padStart(2, "0")} 총정리`,
    },
  };
  const p = periods[type];
  const nl = buildNewsletter({
    type,
    periodStart: p.start.toISOString(),
    periodEnd: p.end.toISOString(),
    editionLabel: p.label,
    clusters: db.clusters,
    analyses: analysesByCluster,
    policies: db.policies,
    statistics: db.statistics,
    articles: db.articles,
    agentDisplayName: db.brand.agentDisplayName,
  });
  nl.status = "DRAFT";
  await data.saveNewsletter(nl);
  revalidatePath("/edm");
  redirect(`/edm/${nl.id}`);
}

export async function updateNewsletterMeta(id: string, patch: Partial<Newsletter>) {
  const nl = await data.getNewsletter(id);
  if (!nl) return;
  Object.assign(nl, patch);
  await data.saveNewsletter(nl);
  revalidatePath(`/edm/${id}`);
}

export async function updateItem(
  newsletterId: string,
  itemId: string,
  patch: { headline?: string; body?: string; verification?: "VERIFIED" | "NEEDS_CHECK" | "UNVERIFIED" },
) {
  await data.updateNewsletterItem(newsletterId, itemId, patch);
  revalidatePath(`/edm/${newsletterId}`);
}

export async function rewriteItem(newsletterId: string, itemId: string, mode: RewriteMode) {
  const nl = await data.getNewsletter(newsletterId);
  const item = nl?.items.find((i) => i.id === itemId);
  if (!item) return { text: "" };
  const ai = getAiAdapter();
  const text = await ai.rewrite(item.body, mode);
  await data.updateNewsletterItem(newsletterId, itemId, {
    body: text,
    verification: mode === "recheck_source" ? "NEEDS_CHECK" : item.verification,
  });
  revalidatePath(`/edm/${newsletterId}`);
  return { text };
}

export async function suggestSubjects(newsletterId: string) {
  const nl = await data.getNewsletter(newsletterId);
  if (!nl) return { options: [] as string[] };
  const ai = getAiAdapter();
  const options = await ai.suggestSubjectLines(nl.headline, nl.previewText);
  return { options };
}

export async function setStatus(id: string, status: Newsletter["status"]) {
  const sessionActor = "admin";
  if (status === "SENT") {
    // 발송은 별도 sendCampaign 을 통해서만
    return;
  }
  await data.setNewsletterStatus(id, status, sessionActor);
  revalidatePath(`/edm/${id}`);
  revalidatePath("/edm");
  revalidatePath("/");
}

// ── 테스트 메일 ───────────────────────────────────────────────────
export async function sendTestEmail(newsletterId: string, to: string) {
  const nl = await data.getNewsletter(newsletterId);
  if (!nl) return { ok: false, error: "뉴스레터를 찾을 수 없습니다." };
  const brand = await data.getBrand();
  const compliance = await data.getCompliance();
  const html = renderEmailHtml(nl, brand, compliance, { withUtm: true });
  const subject =
    (nl.adPrefix && compliance.adPrefixEnabled ? `${compliance.adPrefixText} ` : "") +
    `[테스트] ${nl.subjectLine}`;
  const res = await getEmailAdapter().send({ to, subject, html });
  audit({ actor: "admin", action: "test-email", entity: "newsletter", entityId: newsletterId });
  return res;
}

// ── 캠페인 발송 ───────────────────────────────────────────────────
export async function sendCampaign(newsletterId: string, opts?: { ignoreNight?: boolean }) {
  const nl = await data.getNewsletter(newsletterId);
  if (!nl) return { ok: false, error: "뉴스레터를 찾을 수 없습니다." };
  const brand = await data.getBrand();
  const compliance = await data.getCompliance();

  const issues = checkNewsletterCompliance(nl, brand, compliance);
  const blockers = issues.filter((i) => i.severity === "block");
  if (blockers.length) {
    return { ok: false, error: "준법 검증 실패", issues: blockers };
  }
  if (compliance.requireApprovalBeforeSend && nl.status !== "APPROVED" && nl.status !== "SCHEDULED") {
    return { ok: false, error: "관리자 승인(APPROVED) 후에만 발송할 수 있습니다." };
  }
  if (compliance.nightAdBlockEnabled && isNightNow(compliance) && !opts?.ignoreNight) {
    return {
      ok: false,
      error: `야간(${compliance.nightAdStartHour}시~${compliance.nightAdEndHour}시) 광고 전송 제한. 야간 수신동의 대상만 별도 발송하거나 예약하세요.`,
    };
  }

  const recipients = await data.sendableSubscribers("EMAIL");
  const html = renderEmailHtml(nl, brand, compliance, { withUtm: true });
  const subject =
    (nl.adPrefix && compliance.adPrefixEnabled ? `${compliance.adPrefixText} ` : "") + nl.subjectLine;

  const results = await getEmailAdapter().sendBatch(
    recipients.map((r) => ({ to: r.email, subject, html })),
  );
  const sent = results.filter((r) => r.ok).length;

  const campaign = {
    id: `cmp_${Date.now().toString(36)}`,
    newsletterId,
    channel: "EMAIL" as const,
    name: `${nl.title} · ${nl.editionLabel}`,
    scheduledAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    status: "SENT" as const,
    utmCampaign: `${nl.type.toLowerCase()}_${nl.editionLabel.replace(/[^0-9A-Za-z]/g, "")}`,
    createdAt: new Date().toISOString(),
    stats: {
      sent,
      delivered: sent,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      bounced: results.length - sent,
      leads: 0,
      phoneClicks: 0,
      kakaoClicks: 0,
      blogClicks: 0,
    },
  };
  await data.saveCampaign(campaign);
  await data.setNewsletterStatus(newsletterId, "SENT", "admin");
  audit({ actor: "admin", action: "send", entity: "campaign", entityId: campaign.id });
  revalidatePath("/campaigns");
  revalidatePath("/edm");
  revalidatePath("/");
  return { ok: true, sent, total: recipients.length, provider: getEmailAdapter().name };
}

// ── 콘텐츠 변환 ───────────────────────────────────────────────────
export async function generateRepurpose(newsletterId: string) {
  const nl = await data.getNewsletter(newsletterId);
  if (!nl) return { outputs: [] };
  const brand = await data.getBrand();
  const ai = getAiAdapter();
  const text = nl.items
    .filter((i) => i.section === "policy_top" || i.section === "comment")
    .map((i) => `${i.headline}\n${i.body}`)
    .join("\n\n");
  const outputs = await ai.repurpose(text, `${brand.officeName} | ${brand.brandName}`, `${env.appUrl}/v/${nl.id}`);
  const kakao = buildKakaoMessage(nl, brand);
  return { outputs, kakao };
}

// ── 출처 토글 ────────────────────────────────────────────────────
export async function toggleSourceAction(id: string, enabled: boolean) {
  await data.toggleSource(id, enabled);
  revalidatePath("/sources");
}

// ── 구독자/수신거부 ──────────────────────────────────────────────
export async function addSuppressionAction(email: string) {
  await data.addSuppression(email, "manual");
  revalidatePath("/subscribers");
}

export async function unsubscribeByEmail(email: string) {
  await data.addSuppression(email, "unsubscribe");
  revalidatePath("/subscribers");
  return { ok: true };
}

// ── 리드 상태 ────────────────────────────────────────────────────
export async function updateLeadStatus(id: string, status: "new" | "contacted" | "converted" | "closed") {
  await data.updateLead(id, { status });
  revalidatePath("/leads");
}

// ── 설정 저장 ────────────────────────────────────────────────────
export async function saveBrandAction(formData: FormData) {
  const patch: Record<string, string> = {};
  formData.forEach((v, k) => {
    patch[k] = String(v);
  });
  await data.saveBrand(patch);
  revalidatePath("/settings/brand");
  revalidatePath("/edm");
}

export async function saveComplianceAction(formData: FormData) {
  const get = (k: string) => formData.get(k);
  await data.saveCompliance({
    adPrefixText: String(get("adPrefixText") ?? "(광고)"),
    adPrefixEnabled: get("adPrefixEnabled") === "on",
    requireExplicitConsent: get("requireExplicitConsent") === "on",
    nightAdBlockEnabled: get("nightAdBlockEnabled") === "on",
    nightAdStartHour: Number(get("nightAdStartHour") ?? 21),
    nightAdEndHour: Number(get("nightAdEndHour") ?? 8),
    autoSend: get("autoSend") === "on",
    requireApprovalBeforeSend: get("requireApprovalBeforeSend") === "on",
    propertyAdMode: get("propertyAdMode") === "on",
    mandatoryFooter: String(get("mandatoryFooter") ?? ""),
    legalDisclaimer: String(get("legalDisclaimer") ?? ""),
  });
  revalidatePath("/settings/compliance");
}

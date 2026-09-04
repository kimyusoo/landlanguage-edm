"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Newsletter, NewsletterItem } from "@/types";
import { PreviewFrame } from "./preview-frame";
import { cn } from "@/lib/utils";
import { REWRITE_MODE_LABEL, type RewriteMode } from "@/lib/adapters/types";
import {
  updateItem,
  rewriteItem,
  suggestSubjects,
  updateNewsletterMeta,
  setStatus,
  sendTestEmail,
  sendCampaign,
  sendBriefEmail,
  getKakaoText,
} from "@/app/actions";
import type { ComplianceIssue } from "@/lib/compliance/check";

const REWRITE_MODES: RewriteMode[] = [
  "easier",
  "shorter",
  "professional",
  "add_agent_view",
  "add_consumer_view",
  "tax_impact",
  "loan_impact",
  "seoul_impact",
  "redev_impact",
  "recheck_source",
];

const SECTION_LABEL: Record<string, string> = {
  policy_top: "정책 TOP",
  news_top: "뉴스 TOP",
  numbers: "오늘의 숫자",
  persona: "그래서 내 부동산에는?",
  comment: "공인중개사의 한마디",
};

export function EdmBuilder({
  newsletter,
  emailHtml,
  mobileHtml,
  issues,
  autoSend,
  emailProvider,
}: {
  newsletter: Newsletter;
  emailHtml: string;
  mobileHtml: string;
  issues: ComplianceIssue[];
  autoSend: boolean;
  emailProvider: string;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [msg, setMsg] = React.useState<string | null>(null);
  const [subjectOptions, setSubjectOptions] = React.useState<string[]>([]);
  const [testEmail, setTestEmail] = React.useState("");
  const [recipients, setRecipients] = React.useState("");

  const nl = newsletter;
  const blockers = issues.filter((i) => i.severity === "block");
  const warns = issues.filter((i) => i.severity === "warn");

  const run = (fn: () => Promise<unknown>, note?: string) =>
    start(async () => {
      setMsg(null);
      const r = (await fn()) as { ok?: boolean; error?: string; sent?: number; total?: number } | undefined;
      if (r && r.ok === false) setMsg(`⚠ ${r.error ?? "실패"}`);
      else if (r && typeof r.sent === "number") setMsg(`✅ ${r.sent}/${r.total} 발송 완료`);
      else if (note) setMsg(note);
      router.refresh();
    });

  const grouped = nl.items.reduce<Record<string, NewsletterItem[]>>((acc, it) => {
    (acc[it.section] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* 워크플로 바 */}
      <div className="card sticky top-14 z-10 flex flex-wrap items-center gap-2 p-3">
        <span className="text-xs text-slate-400">상태</span>
        <span className="chip !border-navy !bg-navy !text-white">{nl.status}</span>
        <div className="mx-1 h-4 w-px bg-[#E3E7EC]" />
        <button className="btn btn-ghost py-1.5 text-xs" disabled={pending}
          onClick={() => run(() => setStatus(nl.id, "REVIEW"), "검토 요청됨")}>
          검토 요청
        </button>
        <button className="btn btn-ghost py-1.5 text-xs" disabled={pending}
          onClick={() => run(() => setStatus(nl.id, "APPROVED"), "승인됨")}>
          승인
        </button>
        <button className="btn btn-ghost py-1.5 text-xs" disabled={pending}
          onClick={() => run(() => setStatus(nl.id, "SCHEDULED"), "발송예약됨")}>
          발송 예약
        </button>
        <button
          className="btn btn-gold py-1.5 text-xs"
          disabled={pending || blockers.length > 0}
          onClick={() =>
            run(() => sendCampaign(nl.id), undefined)
          }
          title={blockers.length ? "준법 차단 항목을 먼저 해결하세요" : ""}
        >
          지금 발송
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <input
            className="field !w-48 !py-1.5 text-xs"
            placeholder="테스트 수신 이메일"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <button
            className="btn btn-ghost py-1.5 text-xs"
            disabled={pending || !testEmail}
            onClick={() => run(() => sendTestEmail(nl.id, testEmail), "테스트 메일 발송(로그 확인)")}
          >
            테스트 발송
          </button>
        </div>
      </div>

      {msg && <div className="rounded-lg border border-[#E3E7EC] bg-white px-4 py-2 text-sm text-navy">{msg}</div>}

      {/* 다른 사람에게 보내기 */}
      <div className="card p-4">
        <div className="label-eyebrow mb-2">다른 사람에게 보내기</div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[240px] flex-1">
            <label className="mb-1 block text-xs text-slate-500">받는사람 이메일 (쉼표·줄바꿈으로 여러 명)</label>
            <input
              className="field text-sm"
              placeholder="hong@example.com, kim@example.com"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary text-xs"
            disabled={pending || !recipients.trim()}
            onClick={() => run(() => sendBriefEmail(nl.id, recipients))}
          >
            메일 보내기
          </button>
          <button
            className="btn btn-ghost text-xs"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await getKakaoText(nl.id);
                try {
                  await navigator.clipboard.writeText(r.text);
                  setMsg("카카오톡 메시지가 복사되었습니다. 카카오톡 채널/대화창에 붙여넣어 전송하세요.");
                } catch {
                  window.prompt("복사해서 카카오톡에 붙여넣으세요", r.text);
                }
              })
            }
          >
            카카오톡 메시지 복사
          </button>
          <a
            className="btn btn-ghost text-xs"
            href={`/v/${nl.id}`}
            target="_blank"
            rel="noreferrer"
          >
            공개 링크 열기 ↗
          </a>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          메일 어댑터가 <b>{emailProvider}</b> 입니다.
          {emailProvider === "MOCK"
            ? " 실제 발송 없이 발송관리 로그에만 기록됩니다. RESEND_API_KEY 등을 설정하면 실제 발송됩니다."
            : " 실제 메일이 발송됩니다."}
          {" "}카카오톡은 공식 API 연동 전에는 메시지를 복사해 채널에 붙여넣어 전송합니다.
        </p>
      </div>

      {/* 준법 검증 */}
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <span className="label-eyebrow">Compliance Check</span>
          {blockers.length === 0 ? (
            <span className="chip !border-emerald-300 !bg-emerald-50 !text-emerald-700">발송 가능</span>
          ) : (
            <span className="chip !border-rose-300 !bg-rose-50 !text-rose-700">차단 {blockers.length}건</span>
          )}
          <span className="text-xs text-slate-400">경고 {warns.length}건</span>
          {autoSend ? (
            <span className="ml-auto chip !border-rose-300 !bg-rose-50 !text-rose-700">AUTO_SEND=true</span>
          ) : (
            <span className="ml-auto chip">AUTO_SEND=false · 승인 후 수동 발송</span>
          )}
        </div>
        {issues.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs">
            {issues.map((i, idx) => (
              <li key={idx} className={i.severity === "block" ? "text-rose-600" : "text-amber-600"}>
                {i.severity === "block" ? "⛔" : "⚠"} [{i.ruleKey}] {i.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
        {/* 편집 */}
        <div className="space-y-5">
          <div className="card p-4">
            <div className="label-eyebrow mb-2">제목 · 프리뷰</div>
            <label className="mb-1 block text-xs text-slate-500">이메일 제목</label>
            <div className="flex gap-1.5">
              <input
                className="field"
                defaultValue={nl.subjectLine}
                onBlur={(e) => run(() => updateNewsletterMeta(nl.id, { subjectLine: e.target.value }))}
              />
              <button
                className="btn btn-ghost shrink-0 text-xs"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await suggestSubjects(nl.id);
                    setSubjectOptions(r.options);
                  })
                }
              >
                AI 제목 추천
              </button>
            </div>
            {subjectOptions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {subjectOptions.map((o) => (
                  <li key={o}>
                    <button
                      className="w-full rounded-md border border-[#E3E7EC] px-2 py-1.5 text-left text-xs hover:bg-cloud"
                      onClick={() => run(() => updateNewsletterMeta(nl.id, { subjectLine: o }), "제목 적용됨")}
                    >
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              {nl.adPrefix ? "발송 시 제목 앞에 (광고) 가 자동 부착됩니다." : "(광고) 표기가 꺼져 있습니다."}
            </p>

            <label className="mb-1 mt-3 block text-xs text-slate-500">프리뷰 텍스트</label>
            <input
              className="field"
              defaultValue={nl.previewText}
              onBlur={(e) => run(() => updateNewsletterMeta(nl.id, { previewText: e.target.value }))}
            />

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Hero 메인 카피(오버라이드)</label>
                <textarea
                  className="field h-20"
                  defaultValue={nl.heroMainCopy ?? ""}
                  placeholder="비워두면 브랜드설정 값 사용"
                  onBlur={(e) => run(() => updateNewsletterMeta(nl.id, { heroMainCopy: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Hero 서브 카피(오버라이드)</label>
                <textarea
                  className="field h-20"
                  defaultValue={nl.heroSubCopy ?? ""}
                  placeholder="비워두면 브랜드설정 값 사용"
                  onBlur={(e) => run(() => updateNewsletterMeta(nl.id, { heroSubCopy: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="label-eyebrow mb-2">오늘의 부동산 한 줄</div>
            <input
              className="field text-base font-semibold text-navy"
              defaultValue={nl.headline}
              onBlur={(e) => run(() => updateNewsletterMeta(nl.id, { headline: e.target.value }))}
            />
          </div>

          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="card">
              <div className="border-b border-[#E3E7EC] px-4 py-2.5">
                <span className="text-sm font-bold text-navy">{SECTION_LABEL[section] ?? section}</span>
                <span className="ml-2 text-xs text-slate-400">{items.length}개 항목</span>
              </div>
              <div className="divide-y divide-[#E3E7EC]">
                {items.map((it) => (
                  <ItemEditor
                    key={it.id}
                    item={it}
                    pending={pending}
                    onSave={(patch) => run(() => updateItem(nl.id, it.id, patch))}
                    onRewrite={(mode) => run(() => rewriteItem(nl.id, it.id, mode), `AI 편집 적용: ${REWRITE_MODE_LABEL[mode]}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 미리보기 */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-eyebrow">Live Preview</span>
              <div className="flex gap-2 text-xs">
                <a href={`/api/preview/${nl.id}`} target="_blank" rel="noreferrer" className="text-navy-premium hover:underline">
                  전체화면
                </a>
                <Link href={`/repurpose?nl=${nl.id}`} className="text-navy-premium hover:underline">
                  콘텐츠 변환 →
                </Link>
              </div>
            </div>
            <PreviewFrame emailHtml={emailHtml} mobileHtml={mobileHtml} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemEditor({
  item,
  pending,
  onSave,
  onRewrite,
}: {
  item: NewsletterItem;
  pending: boolean;
  onSave: (patch: { headline?: string; body?: string; verification?: "VERIFIED" | "NEEDS_CHECK" | "UNVERIFIED" }) => void;
  onRewrite: (mode: RewriteMode) => void;
}) {
  const [open, setOpen] = React.useState(item.section === "policy_top" || item.section === "comment");
  return (
    <div className="p-4">
      <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen((v) => !v)}>
        <span className="text-sm font-medium text-navy">{item.headline}</span>
        <span className="text-xs text-slate-400">{open ? "접기" : "펼치기"}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <input
            className="field text-sm"
            defaultValue={item.headline}
            onBlur={(e) => e.target.value !== item.headline && onSave({ headline: e.target.value })}
          />
          <textarea
            className="field h-40 text-sm leading-relaxed"
            defaultValue={item.body}
            onBlur={(e) => e.target.value !== item.body && onSave({ body: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              className="field !w-auto !py-1 text-xs"
              defaultValue={item.verification}
              onChange={(e) => onSave({ verification: e.target.value as "VERIFIED" })}
            >
              <option value="VERIFIED">출처 확인됨</option>
              <option value="NEEDS_CHECK">확인 필요</option>
              <option value="UNVERIFIED">미검증</option>
            </select>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-navy-premium hover:underline">
                출처 원문
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {REWRITE_MODES.map((m) => (
              <button
                key={m}
                disabled={pending}
                onClick={() => onRewrite(m)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  m === "recheck_source"
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-[#E3E7EC] bg-white text-slate-600 hover:bg-cloud",
                )}
              >
                {REWRITE_MODE_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

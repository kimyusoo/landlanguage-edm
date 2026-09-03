import * as React from "react";
import { cn } from "@/lib/utils";
import {
  POLICY_STATUS_LABEL,
  SOURCE_TIER_LABEL,
  NEWSLETTER_STATUS_LABEL,
  type PolicyStatus,
  type SourceTier,
  type NewsletterStatus,
  type VerificationState,
} from "@/types";

export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...p} />;
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-[#E3E7EC] px-5 py-4", className)}>
      <div>
        {eyebrow ? <div className="label-eyebrow mb-1">{eyebrow}</div> : null}
        <h3 className="text-[15px] font-bold text-navy">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {eyebrow ? <div className="label-eyebrow">{eyebrow}</div> : null}
      <h2 className="mt-1 text-xl font-bold tracking-tight text-navy">{children}</h2>
      <div className="mt-2 h-0.5 w-11 bg-navy" />
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "navy" | "gold" | "green" | "amber" | "rose" | "slate";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "border-[#E3E7EC] bg-white text-ink",
    navy: "border-navy bg-navy text-white",
    gold: "border-gold bg-gold/15 text-gold-dark",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-100 text-slate-600",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

const POLICY_TONE: Record<PolicyStatus, "green" | "navy" | "amber" | "slate" | "gold"> = {
  CONFIRMED: "green",
  SCHEDULED: "navy",
  LEGISLATIVE_NOTICE: "amber",
  IN_ASSEMBLY: "amber",
  UNDER_REVIEW: "gold",
  PRESS_REPORTED: "slate",
  OUTLOOK: "slate",
};

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  return <Badge tone={POLICY_TONE[status]}>{POLICY_STATUS_LABEL[status]}</Badge>;
}

export function TierBadge({ tier }: { tier: SourceTier }) {
  const tone = tier === "A" ? "navy" : tier === "B" ? "gold" : "slate";
  return <Badge tone={tone as "navy"}>{SOURCE_TIER_LABEL[tier]}</Badge>;
}

const NL_TONE: Record<NewsletterStatus, "slate" | "amber" | "navy" | "green" | "gold" | "rose"> = {
  COLLECTED: "slate",
  ANALYZED: "slate",
  DRAFT: "amber",
  REVIEW: "gold",
  APPROVED: "green",
  SCHEDULED: "navy",
  SENT: "green",
  FAILED: "rose",
};
export function NewsletterStatusBadge({ status }: { status: NewsletterStatus }) {
  return <Badge tone={NL_TONE[status]}>{NEWSLETTER_STATUS_LABEL[status]}</Badge>;
}

export function VerificationBadge({ v }: { v: VerificationState }) {
  if (v === "VERIFIED") return <Badge tone="green">출처 확인</Badge>;
  if (v === "NEEDS_CHECK") return <Badge tone="amber">확인 필요</Badge>;
  return <Badge tone="rose">미검증</Badge>;
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? "bg-rose-500" : value >= 55 ? "bg-amber-500" : "bg-navy-premium";
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-slate-500">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cloud">
        <span className={cn("block h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </span>
      <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "navy",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "navy" | "gold" | "rose";
}) {
  return (
    <Card className="p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={cn(
          "mt-1.5 text-2xl font-bold tabular-nums",
          tone === "gold" ? "text-gold-dark" : tone === "rose" ? "text-rose-600" : "text-navy",
        )}
      >
        {value}
      </div>
      {hint ? <div className="mt-1 text-[11px] text-slate-400">{hint}</div> : null}
    </Card>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <Card className="p-10 text-center">
      <div className="text-sm font-semibold text-navy">{title}</div>
      {children ? <div className="mt-2 text-sm text-slate-500">{children}</div> : null}
    </Card>
  );
}

export function DemoTag() {
  return (
    <span className="inline-flex items-center rounded border border-dashed border-gold px-1.5 py-0.5 font-serif text-[10px] uppercase tracking-widest text-gold-dark">
      Demo Data
    </span>
  );
}

import { NextResponse } from "next/server";
import type { NewsletterType } from "@/types";
import { env } from "@/config/env";
import { db, audit } from "@/lib/mock/store";
import { buildNewsletter } from "@/lib/edm/build";
import * as data from "@/lib/data";

export const dynamic = "force-dynamic";

const MAP: Record<string, NewsletterType> = {
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
};

export async function GET(req: Request, { params }: { params: { period: string } }) {
  return handle(req, params.period);
}
export async function POST(req: Request, { params }: { params: { period: string } }) {
  return handle(req, params.period);
}

async function handle(req: Request, period: string) {
  const url = new URL(req.url);
  const secret = req.headers.get("x-cron-secret") ?? url.searchParams.get("secret") ?? "";
  if (secret !== env.cronSecret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const type = MAP[period.toLowerCase()];
  if (!type) return NextResponse.json({ ok: false, error: "unknown period" }, { status: 400 });

  const now = new Date();
  const spanDays = type === "DAILY" ? 1 : type === "WEEKLY" ? 7 : 31;
  const nl = buildNewsletter({
    type,
    periodStart: new Date(now.getTime() - spanDays * 86400000).toISOString(),
    periodEnd: now.toISOString(),
    editionLabel:
      type === "MONTHLY"
        ? `${now.getFullYear()}.${String(now.getMonth()).padStart(2, "0")} 총정리`
        : now.toISOString().slice(0, 10),
    clusters: db.clusters,
    analyses: Object.fromEntries(db.analyses.map((a) => [a.clusterId, a])),
    policies: db.policies,
    statistics: db.statistics,
    articles: db.articles,
    agentDisplayName: db.brand.agentDisplayName,
  });
  nl.status = "DRAFT";
  await data.saveNewsletter(nl);
  audit({ actor: "cron", action: `generate:${type}`, entity: "newsletter", entityId: nl.id });

  return NextResponse.json({
    ok: true,
    generated: { id: nl.id, type, editionLabel: nl.editionLabel, items: nl.items.length },
    autoSend: env.autoSend,
    note: "초안이 생성되었습니다. 관리자 승인(APPROVED) 전에는 발송되지 않습니다.",
  });
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui";
import { EdmBuilder } from "@/components/edm/builder";
import * as data from "@/lib/data";
import { renderEmailHtml } from "@/lib/edm/render";
import { checkNewsletterCompliance } from "@/lib/compliance/check";
import { env } from "@/config/env";

export const dynamic = "force-dynamic";

export default async function EdmBuilderPage({ params }: { params: { id: string } }) {
  const nl = await data.getNewsletter(params.id);
  if (!nl) notFound();
  const [brand, compliance] = await Promise.all([data.getBrand(), data.getCompliance()]);
  const emailHtml = renderEmailHtml(nl, brand, compliance, { mode: "email", withUtm: false });
  const mobileHtml = renderEmailHtml(nl, brand, compliance, { mode: "mobile", withUtm: false });
  const issues = checkNewsletterCompliance(nl, brand, compliance);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/edm" className="text-xs text-slate-500 hover:underline">← EDM 목록</Link>
        <span className="text-xs text-slate-400">{nl.id}</span>
      </div>
      <SectionTitle eyebrow={`${nl.type} · ${nl.editionLabel}`}>{nl.title}</SectionTitle>
      <EdmBuilder
        newsletter={nl}
        emailHtml={emailHtml}
        mobileHtml={mobileHtml}
        issues={issues}
        autoSend={env.autoSend && compliance.autoSend}
      />
    </div>
  );
}

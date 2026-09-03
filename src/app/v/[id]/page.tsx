import { notFound } from "next/navigation";
import * as data from "@/lib/data";
import { renderEmailHtml } from "@/lib/edm/render";

export const dynamic = "force-dynamic";

// 공개 브리핑 뷰 (카카오톡/SNS 링크 대상).
export default async function PublicView({ params }: { params: { id: string } }) {
  const nl = await data.getNewsletter(params.id);
  if (!nl) notFound();
  const [brand, compliance] = await Promise.all([data.getBrand(), data.getCompliance()]);
  const html = renderEmailHtml(nl, brand, compliance, { withUtm: false });
  return (
    <iframe
      title={nl.title}
      srcDoc={html}
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  );
}

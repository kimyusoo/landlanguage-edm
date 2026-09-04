import { notFound } from "next/navigation";
import * as data from "@/lib/data";
import { renderEmailHtml } from "@/lib/edm/render";
import { buildKakaoMessage } from "@/lib/kakao/message";
import { ShareBar } from "@/components/share-bar";
import { env } from "@/config/env";

export const dynamic = "force-dynamic";

// 공개 브리핑 뷰 (카카오톡/SNS/메일 링크 대상).
export default async function PublicView({ params }: { params: { id: string } }) {
  const nl = await data.getNewsletter(params.id);
  if (!nl) notFound();
  const [brand, compliance] = await Promise.all([data.getBrand(), data.getCompliance()]);
  const html = renderEmailHtml(nl, brand, compliance, { withUtm: false });
  const url = `${env.appUrl}/v/${nl.id}`;
  const kakaoBody = buildKakaoMessage(nl, brand);

  return (
    <div style={{ minHeight: "100vh", background: "#f2f4f7", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #E3E7EC", background: "#fff", padding: "12px 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", letterSpacing: "0.2em", fontSize: 12, color: "#10243E" }}>
              LAND LANGUAGE
            </div>
            <div style={{ fontSize: 12, color: "#5B6B7C" }}>
              {nl.title} · {nl.editionLabel}
            </div>
          </div>
          <ShareBar payload={{ subject: `[${nl.title}] ${nl.editionLabel}`, body: kakaoBody, url }} />
        </div>
      </div>
      <iframe
        title={nl.title}
        srcDoc={html}
        style={{ border: "none", width: "100%", flex: 1, minHeight: "80vh", display: "block" }}
      />
    </div>
  );
}

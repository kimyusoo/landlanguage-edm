import { NextResponse } from "next/server";
import * as data from "@/lib/data";
import { renderEmailHtml } from "@/lib/edm/render";
import { renderKakaoCardHtml } from "@/lib/edm/render";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "email";
  const nl = await data.getNewsletter(params.id);
  if (!nl) return new NextResponse("Not found", { status: 404 });
  const [brand, compliance] = await Promise.all([data.getBrand(), data.getCompliance()]);

  const html =
    mode === "kakao"
      ? renderKakaoCardHtml(nl, brand)
      : renderEmailHtml(nl, brand, compliance, {
          mode: mode === "mobile" ? "mobile" : "email",
          withUtm: url.searchParams.get("utm") === "1",
        });

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

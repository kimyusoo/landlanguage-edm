import type { BrandSetting, Newsletter } from "@/types";
import { env } from "@/config/env";

/** 카카오톡 발송용 텍스트 문구 생성 (공식 API 연동 여부와 무관하게 항상 제공) */
export function buildKakaoMessage(nl: Newsletter, brand: BrandSetting): string {
  const url = `${env.appUrl}/v/${nl.id}`;
  const unsub = brand.unsubscribeUrl || `${env.appUrl}/unsubscribe`;
  const policy = nl.items
    .filter((i) => i.section === "policy_top")
    .slice(0, 3)
    .map((p, i) => {
      const circ = ["①", "②", "③"][i] ?? `${i + 1}.`;
      return `${circ} ${p.headline.replace(/^\d+\.\s*/, "")}`;
    })
    .join("\n");

  return [
    `[${nl.title}]`,
    "",
    "오늘 꼭 확인해야 할 부동산 이슈를 정리했습니다.",
    "",
    policy || "① 정부 주택정책\n② 대출·금리\n③ 서울 아파트 시장",
    "",
    "복잡한 정책을 일반인의 눈높이에서 쉽게 설명해드립니다.",
    "",
    "▶ 브리핑 보기",
    url,
    "",
    `${brand.officeName} | ${brand.brandName}`,
    brand.mobile,
    `광고 수신거부: ${unsub}`,
  ].join("\n");
}

export const EXPORT_RATIOS = [
  { key: "email", label: "EMAIL (640px 반응형 HTML)", w: 640, h: 0 },
  { key: "kakao", label: "KAKAO (모바일 세로형)", w: 1080, h: 1920 },
  { key: "instagram", label: "INSTAGRAM (1080×1350)", w: 1080, h: 1350 },
  { key: "instagram_sq", label: "INSTAGRAM SQUARE (1080×1080)", w: 1080, h: 1080 },
  { key: "story", label: "STORY (1080×1920)", w: 1080, h: 1920 },
  { key: "blog", label: "BLOG (1200×628)", w: 1200, h: 628 },
  { key: "pdf", label: "PDF (A4 리포트)", w: 794, h: 1123 },
] as const;

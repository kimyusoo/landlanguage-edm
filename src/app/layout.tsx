import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAND LANGUAGE — AI REAL ESTATE BRIEF",
  description:
    "AI 부동산 정책·뉴스 EDM 자동 제작 및 발송 시스템. 정부·언론 자료를 AI가 수집·분석·요약하고 공인중개사 관점으로 해설합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

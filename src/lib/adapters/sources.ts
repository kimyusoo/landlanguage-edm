import type { RawSourceItem, SourceAdapter } from "./types";
import { MOCK_ARTICLES } from "@/lib/mock/clusters";
import { MOCK_SOURCES, sourceById } from "@/lib/mock/sources";

// ─────────────────────────────────────────────────────────────────────────────
// Source Adapter — 정부기관/언론 수집기.
// 원칙: 정식 API·RSS·공개 피드 우선, robots·이용약관 준수, 기사 전문 저장 금지.
// 저장 항목: 제목 / 언론사 / 발행일 / URL / 이미지 사용가능 여부 / 요약 / 키워드.
// Mock 은 시드 기사에서 해당 출처 항목을 돌려줍니다.
// ─────────────────────────────────────────────────────────────────────────────

class MockSourceAdapter implements SourceAdapter {
  constructor(
    readonly adapterKey: string,
    readonly kind: "gov" | "press",
  ) {}
  async fetchRecent(sinceIso: string): Promise<RawSourceItem[]> {
    const since = new Date(sinceIso).getTime();
    const src = Object.values(MOCK_ARTICLES).filter((a) => {
      const s = sourceById(a.sourceId);
      return s?.adapterKey === this.adapterKey && new Date(a.publishedAt).getTime() >= since;
    });
    return src.map((a) => ({
      title: a.title,
      publisher: a.publisher,
      publishedAt: a.publishedAt,
      url: a.url,
      summaryHint: a.summary,
      keywords: a.keywords,
    }));
  }
}

// RSS 기반 실제 어댑터의 골격 (feedUrl 이 있을 때). XML 파서는 프로젝트 정책에 맞게 연결하세요.
class RssSourceAdapter implements SourceAdapter {
  constructor(
    readonly adapterKey: string,
    readonly kind: "gov" | "press",
    private feedUrl: string,
  ) {}
  async fetchRecent(sinceIso: string): Promise<RawSourceItem[]> {
    try {
      const res = await fetch(this.feedUrl, { headers: { "user-agent": "LandLanguageBot/0.1 (+contact)" } });
      if (!res.ok) return [];
      const xml = await res.text();
      // 매우 단순한 RSS item 추출 (프로덕션에서는 견고한 파서 사용 권장)
      const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/g)].map((m) => m[0]);
      const pick = (block: string, tag: string) =>
        block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]
          ?.replace(/<!\[CDATA\[|\]\]>/g, "")
          .trim() ?? "";
      const since = new Date(sinceIso).getTime();
      return items
        .map((b) => ({
          title: pick(b, "title"),
          publisher: this.adapterKey,
          publishedAt: new Date(pick(b, "pubDate") || Date.now()).toISOString(),
          url: pick(b, "link"),
          summaryHint: pick(b, "description").replace(/<[^>]+>/g, "").slice(0, 400),
        }))
        .filter((i) => i.url && new Date(i.publishedAt).getTime() >= since);
    } catch {
      return [];
    }
  }
}

export function getSourceAdapter(adapterKey: string): SourceAdapter {
  const meta = MOCK_SOURCES.find((s) => s.adapterKey === adapterKey);
  const kind: "gov" | "press" =
    meta?.kind === "PRESS" || meta?.kind === "SPECIALIST" ? "press" : "gov";
  // 실제 피드 연동을 원하면 아래 주석을 해제하세요. 기본은 Mock.
  // if (meta?.feedUrl) return new RssSourceAdapter(adapterKey, kind, meta.feedUrl);
  void RssSourceAdapter;
  return new MockSourceAdapter(adapterKey, kind);
}

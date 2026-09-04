// 서버 사이드(=GitHub Actions runner)에서 Google News RSS 를 수집해 news.json 으로 저장.
// 정적 페이지(index.html)는 same-origin 으로 news.json 을 읽으므로 CORS 프록시가 필요 없습니다.
// 저장 항목: 제목 / 언론사 / 발행일 / 실제 기사 URL / 요약  (기사 전문은 저장하지 않음)

import { writeFileSync } from "node:fs";

const TOPICS = [
  { id: "rate",   query: "한국은행 기준금리 부동산 대출" },
  { id: "supply", query: "수도권 주택 공급대책 국토교통부" },
  { id: "subs",   query: "청약제도 개편 무순위 청약 특별공급" },
  { id: "tax",    query: "다주택자 종합부동산세 양도소득세 보유세" },
  { id: "stat",   query: "서울 아파트 매매가격 거래량 실거래가 통계" },
];

const rssUrl = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:45d")}&hl=ko&gl=KR&ceid=KR:ko`;

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ")
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

async function fetchTopic(t) {
  const res = await fetch(rssUrl(t.query), {
    headers: { "user-agent": "Mozilla/5.0 (compatible; LandLanguageBot/1.0)" },
  });
  if (!res.ok) throw new Error(`${t.id}: HTTP ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  const articles = items
    .map((block) => {
      const rawTitle = decode(tag(block, "title"));
      const source = decode(tag(block, "source")) || rawTitle.split(" - ").slice(-1)[0] || "뉴스";
      const title = rawTitle.replace(new RegExp(`\\s*-\\s*${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`), "").trim();
      const link = decode(tag(block, "link"));
      const pub = tag(block, "pubDate");
      const d = new Date(pub || Date.now());
      let excerpt = decode(tag(block, "description"));
      // Google News RSS 의 description 은 대개 "제목" 링크뿐이므로 제목과 겹치면 비웁니다.
      if (!excerpt || excerpt.includes(title) || title.includes(excerpt.slice(0, 20))) excerpt = "";
      return {
        publisher: source,
        title,
        url: link,
        excerpt: excerpt.slice(0, 240),
        date: isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10),
      };
    })
    .filter((a) => a.url && a.title)
    .slice(0, 5);
  return articles;
}

const out = { generatedAt: new Date().toISOString(), source: "Google News RSS", topics: {} };
let ok = 0;
for (const t of TOPICS) {
  try {
    const arts = await fetchTopic(t);
    if (arts.length) {
      out.topics[t.id] = arts;
      ok++;
      console.log(`✓ ${t.id}: ${arts.length}건  (top: ${arts[0].title})`);
    } else {
      console.log(`· ${t.id}: 0건`);
    }
  } catch (e) {
    console.log(`✗ ${t.id}: ${e.message}`);
  }
}

if (ok === 0) {
  console.error("수집 결과가 없습니다. news.json 을 갱신하지 않습니다.");
  process.exit(1);
}

writeFileSync(new URL("../news.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`\nnews.json 저장 완료 — ${ok}/${TOPICS.length} 토픽`);

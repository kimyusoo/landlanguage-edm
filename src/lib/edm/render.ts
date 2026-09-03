import type {
  BrandSetting,
  ComplianceSetting,
  Newsletter,
  NewsletterItem,
} from "@/types";
import { POLICY_STATUS_LABEL, type PolicyStatus } from "@/types";
import type { ArticleRef } from "./build";

// ─────────────────────────────────────────────────────────────────────────────
// EDM 렌더러 — stitch_edm / DESIGN.md "Estate Letter Editorial" 디자인 시스템 적용.
// Corporate Modernism + Financial Editorial Precision.
// 뉴스 항목은 기사 링크 + 원문 요약을 보여주고, 클릭 시 원문 기사로 이동합니다.
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  surface: "#faf8ff",
  card: "#ffffff",
  cLow: "#f2f3ff",
  c: "#eaedff",
  cHigh: "#e2e7ff",
  cHighest: "#dae2fd",
  onSurface: "#131b2e",
  onVar: "#444651",
  outline: "#757682",
  outlineVar: "#c5c5d3",
  primary: "#00236f",
  primaryContainer: "#1e3a8a",
  onPrimary: "#ffffff",
  secondary: "#9b4500",
  secondaryContainer: "#fd8a42",
  secondaryFixed: "#ffdbca",
  secondaryFixedDim: "#ffb68e",
  onSecondaryFixed: "#331200",
  tertiary: "#00312d",
  tertiaryContainer: "#004944",
  tertiaryFixed: "#9cf2e8",
  onTertiaryFixed: "#00201d",
  error: "#ba1a1a",
  up: "#dc2626",
  down: "#2563eb",
};

function esc(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function nl2br(s: string): string {
  return esc(s).replace(/\n/g, "<br>");
}
function clampText(s: string, n: number): string {
  const t = (s ?? "").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
function stripNo(s: string): string {
  return s.replace(/^\s*\d{1,2}\.\s*/, "");
}
function ymd(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, ".");
}

function section(items: NewsletterItem[], sec: NewsletterItem["section"]) {
  return items.filter((i) => i.section === sec).sort((a, b) => a.position - b.position);
}

// ── inline SVG icons (currentColor) ──────────────────────────────────────────
const ico = {
  bank: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M18 10v11M10 10v11M14 10v11"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M7 15l3-4 3 3 5-7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>`,
  ext: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.2.4 2.4.8 3.5a2 2 0 0 1-.5 2.1L8.1 10.5a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1.1.4 2.3.7 3.5.8a2 2 0 0 1 1.7 2Z"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 20l1.3-3.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>`,
  agent: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5ZM4 20a8 8 0 0 1 16 0M9 22h6"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l1.8 4.9L18.7 9l-4.9 1.8L12 15.7l-1.8-4.9L5.3 9l4.9-2.1L12 2Z"/></svg>`,
};

interface AgencyStyle {
  bg: string;
  fg: string;
  bd: string;
  dot: string;
}
function agencyStyle(agency?: string): AgencyStyle {
  const a = agency ?? "";
  if (/국세청|세무/.test(a))
    return { bg: "#cffaf1", fg: "#0f3f3a", bd: "#99f0e2", dot: T.tertiary };
  if (/기획재정부|기재부|금융위|한국은행|금융/.test(a))
    return { bg: "#ffe6d1", fg: "#7a3300", bd: "#ffcda6", dot: T.secondary };
  // 국토교통부 / 서울시 / LH / 부동산원 등 → 네이비
  return { bg: "#e2e7ff", fg: T.primary, bd: "#c8d2ff", dot: T.primary };
}

function statusPill(status?: PolicyStatus): string {
  if (!status) return "";
  const confirmed = status === "CONFIRMED" || status === "SCHEDULED";
  const bg = confirmed ? "#dcfce7" : "#fef3c7";
  const fg = confirmed ? "#166534" : "#92400e";
  const bd = confirmed ? "#bbf7d0" : "#fde68a";
  return `<span class="pill" style="background:${bg};color:${fg};border-color:${bd}">${esc(POLICY_STATUS_LABEL[status])}</span>`;
}

function verifyTag(v: NewsletterItem["verification"]): string {
  if (v === "VERIFIED") return "";
  const txt = v === "NEEDS_CHECK" ? "확인 필요" : "미검증";
  return `<span class="pill" style="background:#fff;color:${T.secondary};border-color:${T.secondaryFixedDim}">${txt}</span>`;
}

function utm(url: string, nl: Newsletter, content: string): string {
  if (!url || url === "#") return "#";
  try {
    const u = new URL(url, "https://x.example");
    u.searchParams.set("utm_source", "edm");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", `${nl.type.toLowerCase()}_${nl.editionLabel.replace(/[^0-9A-Za-z]/g, "")}`);
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

// ── 기사 링크 리스트 (원문 요약 + 클릭 시 원문 이동) ────────────────────────
function articleLinks(arts: ArticleRef[] | undefined, nl: Newsletter, withUtm: boolean): string {
  const list = (arts ?? []).filter((a) => a.url);
  if (!list.length) return "";
  return `<div class="artlist">
    ${list
      .map((a) => {
        const href = withUtm ? utm(a.url, nl, "article") : a.url;
        return `<a class="art" href="${esc(href)}" target="_blank" rel="noreferrer noopener">
          <div class="art-meta">${esc(a.publisher)}${a.publishedAt ? ` · ${ymd(a.publishedAt)}` : ""}<span class="art-go">원문 ${ico.ext}</span></div>
          <div class="art-title">${esc(a.title)}</div>
          <div class="art-ex">${esc(clampText(a.excerpt, 110))}</div>
        </a>`;
      })
      .join("")}
  </div>`;
}

// ── 미니 막대 차트 (순수 div, JS 없음) ──────────────────────────────────────
function miniBars(history: { date: string; value: number }[] | undefined): string {
  const h = (history ?? []).filter((p) => typeof p.value === "number");
  if (h.length < 2) return "";
  const max = Math.max(...h.map((p) => p.value));
  const min = Math.min(...h.map((p) => p.value));
  const span = max - min || 1;
  return `<div class="bars">
    ${h
      .map((p, i) => {
        const pctH = 24 + Math.round(((p.value - min) / span) * 60); // 24~84px
        const last = i === h.length - 1;
        return `<div class="bar-col">
          <div class="bar" style="height:${pctH}px;background:${last ? T.primary : T.cHighest}"></div>
          <span class="bar-x">${esc(p.date)}</span>
        </div>`;
      })
      .join("")}
  </div>`;
}

export interface RenderOptions {
  mode?: "email" | "mobile";
  withUtm?: boolean;
}

export function renderEmailHtml(
  nl: Newsletter,
  brand: BrandSetting,
  compliance: ComplianceSetting,
  opts: RenderOptions = {},
): string {
  const width = opts.mode === "mobile" ? 400 : 600;
  const withUtm = !!opts.withUtm;
  const link = (u: string | undefined, c: string) => (!u ? "#" : withUtm ? utm(u, nl, c) : u);

  const heroMain = nl.heroMainCopy || brand.heroMainCopy;
  const heroSub = nl.heroSubCopy || brand.heroSubCopy;
  const briefingKind =
    nl.type === "DAILY" ? "DAILY BRIEFING" : nl.type === "WEEKLY" ? "WEEKLY BRIEFING" : "MONTHLY BRIEFING";
  const eyebrow =
    nl.type === "DAILY"
      ? "TODAY'S REAL ESTATE BRIEF"
      : nl.type === "WEEKLY"
        ? "WEEKLY REAL ESTATE BRIEF"
        : "MONTHLY REAL ESTATE BRIEF";

  const policyItems = section(nl.items, "policy_top");
  const newsItems = section(nl.items, "news_top");
  const numberItems = section(nl.items, "numbers");
  const personaItem = section(nl.items, "persona")[0];
  const commentItem = section(nl.items, "comment")[0];

  const subject =
    (nl.adPrefix && compliance.adPrefixEnabled ? `${compliance.adPrefixText} ` : "") + nl.subjectLine;

  // ── Hero heroMain: 가운데 줄을 골드로 ──
  const heroLines = heroMain.split("\n");
  const heroHtml = heroLines
    .map((ln, i) =>
      i === 1 ? `<span style="color:${T.secondaryFixed}">${esc(ln)}</span>` : esc(ln),
    )
    .join("<br>");

  // ── 정책 카드 ──
  const policyBlocks = policyItems
    .map((it) => {
      const m = (it.meta ?? {}) as Record<string, unknown>;
      const ag = agencyStyle(m.agency as string | undefined);
      const bullets = (m.bullets as string[] | undefined) ?? [];
      const eff = m.effectiveAt as string | null;
      const official = (m.officialUrl as string | undefined) ?? it.sourceUrl;
      const arts = m.articles as ArticleRef[] | undefined;
      return `<article class="pcard">
        <div class="pcard-top">
          <span class="badge" style="background:${ag.bg};color:${ag.fg};border-color:${ag.bd}">
            <span class="dot" style="background:${ag.dot}"></span>${esc((m.agency as string) || it.sourceLabel || "공식자료")}
          </span>
          <span class="pcard-date">${eff ? `${ymd(eff)} 시행` : it.sourceDate ? `${ymd(it.sourceDate)} 발표` : ""}</span>
        </div>
        <div class="pcard-tags">${statusPill(m.status as PolicyStatus)} ${verifyTag(it.verification)}</div>
        <h4 class="pcard-title">${esc(stripNo(it.headline))}</h4>
        ${
          bullets.length
            ? `<div class="pcard-bullets">
                ${bullets
                  .map(
                    (b) =>
                      `<div class="bl"><span class="bl-ic" style="color:${ag.dot}">${ico.check}</span><p>${esc(b)}</p></div>`,
                  )
                  .join("")}
              </div>`
            : ""
        }
        <div class="pcard-impact">
          <span class="lbl">전문가 영향도 분석</span>
          <span class="val">${esc(clampText((m.impactLabel as string) || "", 64))}</span>
        </div>
        <div class="srcrow">
          ${
            official
              ? `<a class="srcbtn" href="${esc(link(official, "policy_official"))}" target="_blank" rel="noreferrer noopener">공식 원문보기 ${ico.arrow}</a>`
              : `<span class="srcbtn srcbtn-off">공식자료 링크 없음</span>`
          }
          ${
            m.officialDocUrl
              ? `<a class="srcbtn ghost" href="${esc(m.officialDocUrl as string)}" target="_blank" rel="noreferrer noopener">첨부문서</a>`
              : ""
          }
        </div>
        ${articleLinks(arts, nl, withUtm)}
      </article>`;
    })
    .join("");

  // ── 뉴스 카드 ──
  const newsBlocks = newsItems
    .map((it) => {
      const m = (it.meta ?? {}) as Record<string, unknown>;
      const primary = (m.primaryUrl as string | null) ?? it.sourceUrl ?? null;
      const arts = m.articles as ArticleRef[] | undefined;
      const headline = stripNo(it.headline);
      return `<article class="ncard">
        <div class="ncard-head">
          ${statusPill(m.status as PolicyStatus)} ${verifyTag(it.verification)}
          <span class="ncard-cnt">관련기사 ${String((m.articleCount as number) ?? (arts?.length ?? 0))}건</span>
        </div>
        ${
          primary
            ? `<a class="ncard-title" href="${esc(link(primary, "news_headline"))}" target="_blank" rel="noreferrer noopener">${esc(headline)} <span class="ncard-go">${ico.ext}</span></a>`
            : `<div class="ncard-title">${esc(headline)}</div>`
        }
        <p class="ncard-ex">${esc(clampText((m.whatHappened as string) || it.body, 150))}</p>
        ${articleLinks(arts, nl, withUtm)}
      </article>`;
    })
    .join("");

  // ── 숫자 타일 + 미니차트 ──
  const tiles = numberItems
    .map((it) => {
      const m = (it.meta ?? {}) as Record<string, unknown>;
      const mom = m.momChange as number | null;
      const valMain = it.body.split("·")[0].trim();
      const deltaTxt =
        mom == null
          ? ""
          : mom === 0
            ? "보합"
            : `${mom > 0 ? "▲" : "▼"} ${Math.abs(mom)}%`;
      const deltaColor = mom == null || mom === 0 ? T.onVar : mom > 0 ? T.up : T.down;
      return `<div class="tile">
        <span class="tile-lbl">${esc(it.headline)}</span>
        <div class="tile-val"><b>${esc(valMain)}</b>${deltaTxt ? `<span style="color:${deltaColor}">${deltaTxt}</span>` : ""}</div>
        <span class="tile-src">${esc(it.sourceLabel || "")}${
          it.sourceUrl
            ? ` · <a href="${esc(it.sourceUrl)}" target="_blank" rel="noreferrer noopener">출처</a>`
            : ""
        }</span>
      </div>`;
    })
    .join("");

  const chartItem =
    numberItems.find(
      (it) =>
        Array.isArray((it.meta as Record<string, unknown> | undefined)?.history) &&
        ((it.meta as Record<string, unknown>).history as unknown[]).length >= 2,
    ) ?? null;
  const chartHtml = chartItem
    ? `<div class="chart">
        <div class="chart-head"><span>${esc(chartItem.headline)} 추이</span><span class="chart-src">${esc(chartItem.sourceLabel || "")}</span></div>
        ${miniBars((chartItem.meta as Record<string, unknown>).history as { date: string; value: number }[])}
      </div>`
    : "";

  const numbersSection = numberItems.length
    ? `<section class="sec">
        ${secHead(ico.chart, "오늘의 숫자", "출처·기준일이 확인된 수치만 게시")}
        <div class="card">
          <div class="tiles">${tiles}</div>
          ${chartHtml}
          <p class="note">※ 출처와 기준일이 확인되지 않은 수치는 표시하지 않습니다.</p>
        </div>
      </section>`
    : "";

  // ── 페르소나 카드 ──
  const personaBlock = personaItem
    ? `<section class="sec">
        ${secHead(ico.sparkle, "그래서 내 부동산에는?", esc(personaItem.sourceLabel || ""))}
        <div class="card persona">
          ${personaRows(personaItem.body)}
          <p class="note">※ 매수·매도 판단을 단정적으로 권하지 않습니다. 적용 여부는 주택 수·취득시기·지역·보유기간 등에 따라 달라질 수 있습니다.</p>
        </div>
      </section>`
    : "";

  // ── 공인중개사 한마디 ──
  const commentBlock = commentItem
    ? `<section class="sec">
        <div class="comment">
          <div class="comment-head">
            <span class="avatar">${esc((brand.agentDisplayName || "공인중개사").slice(0, 1))}</span>
            <div>
              <span class="comment-name">${esc(commentItem.headline)}</span>
              <span class="comment-tag">${ico.agent} 전문가 코멘트</span>
            </div>
          </div>
          <p class="comment-body">${nl2br(commentItem.body)}</p>
        </div>
      </section>`
    : "";

  // ── CTA ──
  const telHref = brand.mobile ? `tel:${brand.mobile.replace(/[^0-9+]/g, "")}` : "#";
  const ctaBlock = `<section class="sec">
    <div class="cta">
      <span class="cta-ic">${ico.chat}</span>
      <h3>이 정책이 내 집에 어떤 영향을 주는지 궁금하신가요?</h3>
      <p>지금 매도할지 보유할지, 갈아타기를 계획 중이신지 — 전문 공인중개사가 AI 분석과 함께 정리해 드립니다.</p>
      <div class="cta-btns">
        <a class="cta-btn primary" href="${esc(telHref)}">${ico.phone}<span>${esc(brand.mobile || "전화 상담")}</span></a>
        ${
          brand.kakaoChannel
            ? `<a class="cta-btn kakao" href="${esc(link(brand.kakaoChannel, "cta_kakao"))}" target="_blank" rel="noreferrer noopener">${ico.chat}<span>카카오톡 상담</span></a>`
            : `<span class="cta-btn kakao off">${ico.chat}<span>카카오톡 채널 미설정</span></span>`
        }
        ${
          brand.reservationUrl
            ? `<a class="cta-btn ghost" href="${esc(link(brand.reservationUrl, "cta_reserve"))}" target="_blank" rel="noreferrer noopener"><span>상담 예약</span> ${ico.arrow}</a>`
            : ""
        }
      </div>
    </div>
  </section>`;

  // ── Footer ──
  const footer = `<footer class="foot">
    <div class="foot-id">
      <div class="foot-id-head">${esc(brand.officeName)}${brand.brandName ? ` · ${esc(brand.brandName)}` : ""} 중개사무소 정보</div>
      <div class="foot-grid">
        ${brand.repName ? `<p><b>대표 공인중개사</b> ${esc(brand.repName)}</p>` : ""}
        ${brand.registrationNo ? `<p><b>등록번호</b> ${esc(brand.registrationNo)}</p>` : ""}
        <p><b>연락처</b> ${[brand.phone, brand.mobile].filter(Boolean).map(esc).join(" · ") || "-"}</p>
        ${brand.email ? `<p><b>이메일</b> ${esc(brand.email)}</p>` : ""}
        <p><b>소재지</b> ${esc(brand.address || "-")}</p>
      </div>
    </div>
    <div class="foot-legal">
      <p>${esc(compliance.legalDisclaimer)}</p>
      <p>${esc(compliance.mandatoryFooter)}</p>
    </div>
    <div class="foot-links">
      <a href="${esc(brand.unsubscribeUrl || "#")}" target="_blank" rel="noreferrer noopener">수신거부</a>
      <span>·</span>
      <a href="${esc(brand.privacyUrl || "#")}" target="_blank" rel="noreferrer noopener">개인정보처리방침</a>
    </div>
  </footer>`;

  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
<style>
${styleSheet(width)}
</style>
</head>
<body>
<span class="preheader">${esc(nl.previewText)}</span>
<div class="ll-edm"><div class="wrap">

  <header class="masthead">
    <div class="mh-brand">
      <div class="mh-name">${esc(brand.officeName)}<span class="mh-pill">공인중개</span></div>
      <div class="mh-sub">${esc(brand.brandName || "Newsletter Feed")}</div>
    </div>
    ${brand.mobile ? `<a class="mh-ic" href="${esc(telHref)}">${ico.phone}</a>` : ""}
  </header>

  <section class="sec">
    <div class="keyrow">
      <span class="keychip">${ico.sparkle}<span>${briefingKind} · ${esc(nl.editionLabel)}</span></span>
      <span class="keyvol">${esc(nl.type)}</span>
    </div>
    <div class="keynote">
      <span class="quote">&ldquo;</span>
      <h2>${heroHtml}</h2>
      <div class="keynote-sub">${ico.sparkle}<p>${esc(heroSub)}</p></div>
    </div>
  </section>

  <section class="sec">
    <div class="lede">
      <span class="lede-eyebrow">${esc(eyebrow)} · ${esc(nl.editionLabel)}</span>
      <h3>${esc(nl.headline)}</h3>
    </div>
  </section>

  ${
    policyBlocks
      ? `<section class="sec">
          ${secHead(ico.bank, nl.type === "DAILY" ? "오늘 꼭 알아야 할 정책" : "정부정책 핵심 브리핑", "공식 고시·발표 종합")}
          <div class="stack">${policyBlocks}</div>
        </section>`
      : ""
  }

  ${
    newsBlocks
      ? `<section class="sec">
          ${secHead(ico.chart, nl.type === "DAILY" ? "오늘의 주요 뉴스" : "부동산 뉴스 브리핑", "기사 제목을 누르면 원문으로 이동합니다")}
          <div class="stack">${newsBlocks}</div>
        </section>`
      : ""
  }

  ${numbersSection}
  ${personaBlock}
  ${commentBlock}
  ${ctaBlock}
  ${footer}

</div></div>
</body></html>`;
}

function secHead(icon: string, title: string, sub: string): string {
  return `<div class="sechead">
    <div class="sechead-l"><span class="sechead-ic">${icon}</span><h3>${esc(title)}</h3></div>
    <span class="sechead-sub">${sub}</span>
  </div>`;
}

function personaRows(body: string): string {
  // body 형식: "라벨  ●●●○○\n설명" 블록이 빈 줄로 구분
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return `<div class="prows">${blocks
    .map((b) => {
      const [head, ...rest] = b.split("\n");
      const m = head.match(/^(.*?)\s+([●○]{3,})\s*$/);
      const label = m ? m[1] : head;
      const dots = m ? m[2] : "";
      const note = rest.join(" ").trim();
      return `<div class="prow">
        <div class="prow-head"><span class="prow-lbl">${esc(label)}</span><span class="prow-dots">${esc(dots)}</span></div>
        <p class="prow-note">${esc(note)}</p>
      </div>`;
    })
    .join("")}</div>`;
}

function styleSheet(width: number): string {
  return `
  .preheader{display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden}
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');
  .ll-edm *{box-sizing:border-box;margin:0;padding:0}
  .ll-edm{background:${T.surface};padding:16px 0 40px;font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif;color:${T.onSurface};-webkit-font-smoothing:antialiased;line-height:1.62}
  .ll-edm .wrap{max-width:${width}px;margin:0 auto;padding:0 14px}
  :where(.ll-edm) a{color:inherit;text-decoration:none}
  .ll-edm h2,.ll-edm h3,.ll-edm h4,.ll-edm .tile-val b,.ll-edm .keyvol{font-family:'Plus Jakarta Sans','Noto Sans KR',sans-serif}
  .ll-edm svg{display:block}

  .masthead{display:flex;align-items:center;justify-content:space-between;padding:6px 4px 14px}
  .mh-name{display:flex;align-items:center;gap:7px;font-size:17px;font-weight:800;color:${T.primary};letter-spacing:-.01em}
  .mh-pill{font-size:10px;font-weight:700;letter-spacing:.04em;padding:2px 6px;border-radius:4px;background:${T.cHighest};color:${T.primary}}
  .mh-sub{font-size:11px;color:${T.onVar};margin-top:2px;letter-spacing:.02em}
  .mh-ic{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:999px;color:${T.primary};background:${T.card};border:1px solid ${T.outlineVar}}

  .sec{margin-bottom:16px}
  .sechead{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
  .sechead-l{display:flex;align-items:center;gap:7px}
  .sechead-ic{color:${T.primary};display:flex}
  .sechead h3{font-size:17px;font-weight:800;color:${T.onSurface};letter-spacing:-.01em}
  .sechead-sub{font-size:11px;color:${T.onVar};text-align:right;padding-top:3px;max-width:44%}

  .keyrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
  .keychip{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:5px;background:${T.cHighest};color:${T.primary};font-size:11px;font-weight:700;letter-spacing:.03em}
  .keyvol{font-size:11px;font-weight:700;color:${T.onVar};letter-spacing:.06em}
  .keynote{position:relative;overflow:hidden;border-radius:14px;background:${T.primaryContainer};color:${T.onPrimary};padding:20px 20px 18px}
  .keynote .quote{font-family:Georgia,serif;font-size:44px;line-height:0;color:${T.secondaryContainer};opacity:.9;display:block;height:20px}
  .keynote h2{font-size:${width < 500 ? 19 : 21}px;font-weight:800;line-height:1.4;letter-spacing:-.015em;margin-top:10px}
  .keynote-sub{display:flex;align-items:flex-start;gap:7px;margin-top:16px;background:rgba(0,0,0,.18);border-radius:9px;padding:10px 11px}
  .keynote-sub svg{color:${T.secondaryContainer};flex-shrink:0;margin-top:2px}
  .keynote-sub p{font-size:12px;line-height:1.55;color:#e7ebff}

  .lede{background:${T.cLow};border-radius:12px;border-left:3px solid ${T.primary};padding:14px 16px}
  .lede-eyebrow{font-family:'Plus Jakarta Sans',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.14em;color:${T.secondary};text-transform:uppercase}
  .lede h3{font-size:${width < 500 ? 17 : 19}px;font-weight:800;color:${T.primary};line-height:1.45;margin-top:6px;letter-spacing:-.01em}

  .stack{display:flex;flex-direction:column;gap:12px}
  .card{background:${T.card};border:1px solid ${T.outlineVar};border-radius:14px;padding:16px}

  .pcard{background:${T.card};border:1px solid ${T.outlineVar};border-radius:14px;padding:16px;box-shadow:0 2px 4px -1px rgba(15,23,42,.03)}
  .pcard-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:5px;border:1px solid;font-size:11px;font-weight:700;letter-spacing:.01em}
  .badge .dot{width:6px;height:6px;border-radius:999px;flex-shrink:0}
  .pcard-date{font-size:11px;color:${T.onVar};white-space:nowrap}
  .pcard-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
  .pill{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;border:1px solid;font-size:10.5px;font-weight:700;letter-spacing:.01em}
  .pcard-title{font-size:16px;font-weight:800;color:${T.onSurface};line-height:1.45;margin-top:10px;letter-spacing:-.01em}
  .pcard-bullets{background:${T.cLow};border-radius:10px;padding:11px 12px;margin-top:11px;display:flex;flex-direction:column;gap:8px}
  .bl{display:flex;align-items:flex-start;gap:7px}
  .bl-ic{flex-shrink:0;margin-top:2px;display:flex}
  .bl p{font-size:12.5px;line-height:1.5;color:${T.onSurface}}
  .pcard-impact{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:11px;background:${T.c};border-radius:6px;padding:7px 10px}
  .pcard-impact .lbl{font-size:10.5px;font-weight:700;color:${T.primary};letter-spacing:.02em;flex-shrink:0}
  .pcard-impact .val{font-size:11px;font-weight:700;color:${T.secondary};text-align:right;line-height:1.4}

  .srcrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
  .ll-edm .srcbtn{display:inline-flex;align-items:center;gap:5px;padding:8px 12px;border-radius:6px;background:${T.primary};color:#fff;font-size:12px;font-weight:700}
  .ll-edm .srcbtn.ghost{background:#fff;color:${T.primary};border:1.5px solid ${T.primary}}
  .ll-edm .srcbtn-off{background:${T.c};color:${T.outline};font-weight:600}

  .ncard{background:${T.card};border:1px solid ${T.outlineVar};border-radius:14px;padding:15px}
  .ncard-head{display:flex;flex-wrap:wrap;align-items:center;gap:5px}
  .ncard-cnt{font-size:10.5px;color:${T.onVar};margin-left:auto}
  .ll-edm .ncard-title{display:block;font-size:15px;font-weight:800;color:${T.primary};line-height:1.45;margin-top:9px;letter-spacing:-.01em}
  .ncard-title .ncard-go{display:inline-flex;color:${T.outline};vertical-align:middle;margin-left:2px}
  .ncard-ex{font-size:12.5px;line-height:1.6;color:${T.onSurface};margin-top:6px}

  .artlist{display:flex;flex-direction:column;gap:6px;margin-top:11px;border-top:1px solid ${T.cLow};padding-top:10px}
  .art{display:block;background:${T.surface};border:1px solid ${T.cHigh};border-radius:9px;padding:9px 10px}
  .art-meta{display:flex;align-items:center;gap:6px;font-size:10.5px;color:${T.onVar};font-weight:600}
  .art-go{display:inline-flex;align-items:center;gap:3px;margin-left:auto;color:${T.primary};font-weight:700}
  .art-title{font-size:12.5px;font-weight:700;color:${T.onSurface};line-height:1.42;margin-top:3px}
  .art-ex{font-size:11.5px;line-height:1.5;color:${T.onVar};margin-top:3px}

  .tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .tile{background:${T.cLow};border-radius:10px;padding:11px 12px}
  .tile-lbl{font-size:10.5px;color:${T.onVar};display:block;line-height:1.4}
  .tile-val{display:flex;align-items:baseline;gap:6px;margin-top:5px;flex-wrap:wrap}
  .tile-val b{font-size:19px;font-weight:800;color:${T.onSurface};letter-spacing:-.02em}
  .tile-val span{font-size:11px;font-weight:700}
  .tile-src{font-size:9.5px;color:${T.outline};display:block;margin-top:5px}
  .tile-src a{color:${T.primary};text-decoration:underline}

  .chart{background:${T.surface};border-radius:10px;padding:11px 12px;margin-top:10px}
  .chart-head{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:10.5px;color:${T.onVar};font-weight:600}
  .chart-src{color:${T.outline};font-weight:400}
  .bars{display:flex;align-items:flex-end;justify-content:space-between;gap:6px;height:96px;margin-top:10px}
  .bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px}
  .bar{width:100%;border-radius:4px 4px 0 0}
  .bar-x{font-size:9px;color:${T.outline};white-space:nowrap}

  .persona .prows{display:flex;flex-direction:column}
  .prow{padding:10px 0;border-bottom:1px solid ${T.cLow}}
  .prow:last-child{border-bottom:0}
  .prow-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .prow-lbl{font-size:13px;font-weight:700;color:${T.onSurface}}
  .prow-dots{font-size:12px;letter-spacing:2px;color:${T.secondary}}
  .prow-note{font-size:11.5px;line-height:1.55;color:${T.onVar};margin-top:4px}

  .note{font-size:10px;color:${T.outline};line-height:1.5;margin-top:11px}

  .comment{background:linear-gradient(160deg,${T.primaryContainer},${T.primary});border-radius:14px;padding:18px;color:${T.onPrimary}}
  .comment-head{display:flex;align-items:center;gap:10px}
  .avatar{width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0}
  .comment-name{display:block;font-size:13px;font-weight:800;color:#fff}
  .comment-tag{display:flex;align-items:center;gap:5px;font-size:10.5px;color:${T.secondaryFixed};margin-top:2px}
  .comment-tag svg{width:13px;height:13px}
  .comment-body{font-size:12.5px;line-height:1.7;color:#e7ebff;margin-top:11px}

  .cta{background:linear-gradient(150deg,${T.primaryContainer},${T.primary});border-radius:14px;padding:22px 20px;text-align:center;color:${T.onPrimary}}
  .cta-ic{display:inline-flex;color:${T.secondaryContainer};margin-bottom:6px}
  .cta h3{font-size:16px;font-weight:800;line-height:1.45;letter-spacing:-.01em}
  .cta p{font-size:11.5px;line-height:1.55;color:#dfe4ff;margin:8px auto 0;max-width:320px}
  .cta-btns{display:flex;flex-direction:column;gap:8px;margin-top:16px}
  .cta-btn{display:flex;align-items:center;justify-content:center;gap:7px;height:44px;border-radius:7px;font-size:13px;font-weight:800;letter-spacing:-.01em}
  .cta-btn.primary{background:#fff;color:${T.primary}}
  .cta-btn.kakao{background:#FEE500;color:#191919}
  .cta-btn.kakao.off{opacity:.55}
  .cta-btn.ghost{background:rgba(255,255,255,.12);color:#fff}

  .foot{margin-top:6px}
  .foot-id{background:${T.cLow};border-radius:12px;padding:14px 15px}
  .foot-id-head{font-size:12px;font-weight:800;color:${T.primary};display:flex;align-items:center;gap:5px}
  .foot-grid{margin-top:8px;display:flex;flex-direction:column;gap:3px}
  .foot-grid p{font-size:10.5px;color:${T.onVar};line-height:1.6}
  .foot-grid b{color:${T.onSurface};font-weight:700;margin-right:5px}
  .foot-legal{margin-top:10px;padding:0 3px}
  .foot-legal p{font-size:9.5px;color:${T.outline};line-height:1.6;margin-top:5px}
  .foot-links{margin-top:10px;text-align:center;font-size:10.5px}
  .foot-links a{color:${T.primary};text-decoration:underline}
  .foot-links span{color:${T.outlineVar};margin:0 6px}
  `;
}

/** 카카오톡용 모바일 세로형 카드 HTML (이미지 캡처/저장용, 1080px 기준) */
export function renderKakaoCardHtml(nl: Newsletter, brand: BrandSetting): string {
  const policy = section(nl.items, "policy_top").slice(0, 3);
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(nl.title)} 카드</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Noto+Sans+KR:wght@500;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:${T.primaryContainer}}
.k{width:1080px;min-height:1350px;padding:80px 72px;font-family:'Noto Sans KR',sans-serif;color:#fff;background:linear-gradient(165deg,${T.primaryContainer},${T.primary})}
.k .brand{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;letter-spacing:.02em;font-size:34px}
.k .brand small{display:block;font-size:20px;font-weight:700;color:${T.secondaryContainer};letter-spacing:.06em;margin-top:8px}
.k .ed{margin-top:56px;font-size:30px;color:${T.secondaryFixed};font-weight:700}
.k h1{margin-top:18px;font-size:60px;font-weight:800;line-height:1.32;letter-spacing:-.02em}
.k .rule{margin-top:52px;width:120px;height:5px;background:${T.secondaryContainer};border-radius:3px}
.k ol{margin-top:44px;list-style:none;display:flex;flex-direction:column;gap:30px}
.k li{font-size:36px;line-height:1.45;display:flex;gap:20px}
.k li b{color:${T.secondaryContainer};font-family:'Plus Jakarta Sans',sans-serif}
.k .tail{margin-top:64px;font-size:28px;color:#c7d0ec;line-height:1.6}
.k .foot{margin-top:52px;font-size:30px;font-weight:700}
</style></head>
<body><div class="k">
  <div class="brand">${esc(brand.officeName)}<small>${esc(brand.brandName || "LAND LANGUAGE")}</small></div>
  <div class="ed">${esc(nl.editionLabel)}</div>
  <h1>${esc(nl.headline)}</h1>
  <div class="rule"></div>
  <ol>
    ${policy
      .map(
        (p, i) =>
          `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(stripNo(p.headline))}</span></li>`,
      )
      .join("")}
  </ol>
  <p class="tail">복잡한 부동산 정책을 일반인의 눈높이에서 쉽게 설명해드립니다.</p>
  <div class="foot">${esc(brand.officeName)} · ${esc(brand.mobile || "")}</div>
</div></body></html>`;
}

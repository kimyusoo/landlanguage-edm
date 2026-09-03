import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | undefined, withTime = false): string {
  if (!iso) return "-";
  const d = new Date(iso);
  const base = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  if (!withTime) return base;
  return `${base} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function rel(iso: string | undefined): string {
  if (!iso) return "-";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.round(h / 24);
  return `${d}일 전`;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function dots(level: number, max = 5): string {
  return "●".repeat(Math.max(0, Math.min(max, level))) + "○".repeat(Math.max(0, max - level));
}

export function scoreColor(score: number): string {
  if (score >= 75) return "text-rose-600";
  if (score >= 55) return "text-amber-600";
  return "text-slate-500";
}

/**
 * DEMO 데이터는 실제 원문 URL 이 없으므로, "제목·내용이 일치하는" 기사/자료 목록으로
 * 이동하도록 네이버 검색 링크를 만듭니다. 실제 운영에서는 수집된 원문 URL 을 그대로 사용합니다.
 */
export function sourceSearchUrl(query: string, kind: "news" | "all" = "news"): string {
  const q = (query ?? "")
    .replace(/\s*\(DEMO DATA\)\s*$/, "")
    .replace(/["'“”…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const base = "https://search.naver.com/search.naver";
  return kind === "news"
    ? `${base}?where=news&sm=tab_jum&query=${encodeURIComponent(q)}`
    : `${base}?query=${encodeURIComponent(q)}`;
}

/** 실제 원문 URL(경로 포함)이면 그대로, 홈페이지/데모 URL 이면 검색 링크로 폴백 */
export function resolveSourceUrl(
  url: string | null | undefined,
  fallbackQuery: string,
  kind: "news" | "all" = "news",
): string {
  try {
    const u = new URL(url ?? "");
    if (u.pathname.replace(/\/+$/, "").length > 0 && !/example/.test(u.pathname)) {
      return url as string;
    }
  } catch {
    /* not a valid absolute URL */
  }
  return sourceSearchUrl(fallbackQuery, kind);
}

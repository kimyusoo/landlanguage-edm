import type { RepurposeOutput } from "@/types";

export type RewriteMode =
  | "easier"
  | "shorter"
  | "professional"
  | "add_agent_view"
  | "add_consumer_view"
  | "tax_impact"
  | "loan_impact"
  | "seoul_impact"
  | "redev_impact"
  | "recheck_source";

export const REWRITE_MODE_LABEL: Record<RewriteMode, string> = {
  easier: "더 쉽게",
  shorter: "더 짧게",
  professional: "더 전문적으로",
  add_agent_view: "공인중개사 관점 추가",
  add_consumer_view: "소비자 관점 추가",
  tax_impact: "세금 영향 분석",
  loan_impact: "대출 영향 분석",
  seoul_impact: "서울 영향 분석",
  redev_impact: "재개발·재건축 영향 분석",
  recheck_source: "출처 다시 확인",
};

export interface AiAdapter {
  readonly name: string;
  readonly isMock: boolean;
  rewrite(text: string, mode: RewriteMode): Promise<string>;
  suggestSubjectLines(headline: string, context: string): Promise<string[]>;
  repurpose(edmText: string, brandLine: string, url: string): Promise<RepurposeOutput[]>;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  headers?: Record<string, string>;
}

export interface EmailSendResult {
  ok: boolean;
  providerId?: string;
  error?: string;
  mock?: boolean;
}

export interface EmailAdapter {
  readonly name: string;
  readonly isMock: boolean;
  send(msg: EmailMessage): Promise<EmailSendResult>;
  sendBatch(msgs: EmailMessage[]): Promise<EmailSendResult[]>;
}

export interface KakaoMessage {
  to: string; // 전화번호(알림톡) 또는 채널 친구 식별자(친구톡)
  templateCode?: string;
  text: string;
  linkUrl?: string;
  imageUrl?: string;
  type: "alimtalk" | "friendtalk";
}

export interface KakaoAdapter {
  readonly name: string;
  readonly isMock: boolean;
  send(msg: KakaoMessage): Promise<EmailSendResult>;
}

export interface RawSourceItem {
  title: string;
  publisher: string;
  publishedAt: string;
  url: string;
  summaryHint?: string;
  keywords?: string[];
}

export interface SourceAdapter {
  readonly adapterKey: string;
  readonly kind: "gov" | "press";
  /** RSS/API/공개 피드 우선. robots·이용약관 준수. 기사 전문 저장 금지. */
  fetchRecent(sinceIso: string): Promise<RawSourceItem[]>;
}

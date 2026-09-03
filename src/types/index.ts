// ─────────────────────────────────────────────────────────────────────────────
// LAND LANGUAGE — 도메인 타입 (Mock/Prisma 공통)
// ─────────────────────────────────────────────────────────────────────────────

export type SourceTier = "A" | "B" | "C" | "D";

export type SourceKind =
  | "GOV_OFFICIAL"
  | "STATISTICS"
  | "LAW"
  | "PRESS"
  | "SPECIALIST"
  | "BLOG_COMMUNITY";

export type PolicyStatus =
  | "CONFIRMED"
  | "SCHEDULED"
  | "LEGISLATIVE_NOTICE"
  | "IN_ASSEMBLY"
  | "UNDER_REVIEW"
  | "PRESS_REPORTED"
  | "OUTLOOK";

export const POLICY_STATUS_LABEL: Record<PolicyStatus, string> = {
  CONFIRMED: "확정",
  SCHEDULED: "시행 예정",
  LEGISLATIVE_NOTICE: "입법예고",
  IN_ASSEMBLY: "국회 심의 중",
  UNDER_REVIEW: "정부 검토",
  PRESS_REPORTED: "언론 보도",
  OUTLOOK: "전망/분석",
};

export const SOURCE_TIER_LABEL: Record<SourceTier, string> = {
  A: "A · 정부·공공·법령·공식통계",
  B: "B · 주요 언론사",
  C: "C · 전문매체",
  D: "D · 블로그·커뮤니티·SNS",
};

export type VerificationState = "VERIFIED" | "NEEDS_CHECK" | "UNVERIFIED";

export type NewsletterType = "DAILY" | "WEEKLY" | "MONTHLY";

export type NewsletterStatus =
  | "COLLECTED"
  | "ANALYZED"
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "SENT"
  | "FAILED";

export const NEWSLETTER_STATUS_LABEL: Record<NewsletterStatus, string> = {
  COLLECTED: "수집됨",
  ANALYZED: "분석완료",
  DRAFT: "초안",
  REVIEW: "검토중",
  APPROVED: "승인됨",
  SCHEDULED: "발송예약",
  SENT: "발송완료",
  FAILED: "실패",
};

export type DeliveryChannel = "EMAIL" | "KAKAO";

export type Persona =
  | "none"
  | "onePlus"
  | "multi"
  | "buyer"
  | "seller"
  | "landlord"
  | "tenant";

export const PERSONA_LABEL: Record<Persona, string> = {
  none: "무주택자",
  onePlus: "1주택자",
  multi: "다주택자",
  buyer: "매수 예정자",
  seller: "매도 예정자",
  landlord: "임대인",
  tenant: "임차인",
};

export interface Source {
  id: string;
  name: string;
  kind: SourceKind;
  tier: SourceTier;
  homepageUrl?: string;
  feedUrl?: string;
  adapterKey: string;
  enabled: boolean;
  region?: string;
  notes?: string;
}

export interface Article {
  id: string;
  sourceId: string;
  title: string;
  publisher: string;
  publishedAt: string; // ISO
  url: string;
  imageUsable: boolean;
  summary: string;
  keywords: string[];
  clusterId?: string;
  tier: SourceTier;
}

export interface ImpactScores {
  policyImportance: number;
  marketImpact: number;
  consumerInterest: number;
  agentRelevance: number;
  seoulMetroImpact: number;
  taxImpact: number;
  loanFinanceImpact: number;
  investmentImpact: number;
  enduserImpact: number;
  urgency: number;
}

export interface PersonaImpact {
  /** 0~5 (●●●○○ 표시용) */
  level: number;
  note: string;
}

export interface AiAnalysis {
  id: string;
  clusterId: string;
  scores: ImpactScores;
  compositeScore: number;
  oneLiner: string;
  whatHappened: string;
  whyItMatters: string;
  audienceTags: string[];
  agentPoints: string[];
  actionChecklist: string[];
  /** FACT / INTERPRETATION / ACTION 3단 구분 */
  fact: string;
  interpretation: string;
  action: string;
  impactByPersona: Record<Persona, PersonaImpact>;
  model: string;
  verification: VerificationState;
}

export interface GovernmentPolicy {
  id: string;
  sourceId: string;
  clusterId?: string;
  title: string;
  agency: string;
  announcedAt: string;
  effectiveAt?: string;
  status: PolicyStatus;
  officialUrl: string;
  officialDocUrl?: string;
  plainSummary: string;
  rawExcerpt?: string;
  verification: VerificationState;
}

export interface ArticleCluster {
  id: string;
  headline: string;
  issueDate: string;
  primarySourceUrl?: string;
  status: PolicyStatus;
  articleIds: string[];
  policyIds: string[];
  analysisId?: string;
  isDemo: boolean;
}

export interface MarketStatistic {
  id: string;
  sourceId: string;
  metricKey: string;
  label: string;
  value: number;
  unit: string;
  asOfDate: string;
  momChange?: number;
  yoyChange?: number;
  region?: string;
  sourceUrl: string;
  verification: VerificationState;
  history?: { date: string; value: number }[];
}

export interface NewsletterItem {
  id: string;
  newsletterId: string;
  clusterId?: string;
  section: "policy_top" | "news_top" | "numbers" | "persona" | "comment" | "hero";
  position: number;
  headline: string;
  body: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sourceDate?: string;
  verification: VerificationState;
  meta?: Record<string, unknown>;
}

export interface Newsletter {
  id: string;
  type: NewsletterType;
  title: string;
  editionLabel: string;
  periodStart: string;
  periodEnd: string;
  status: NewsletterStatus;
  headline: string;
  agentComment: string;
  previewText: string;
  subjectLine: string;
  adPrefix: boolean;
  heroMainCopy?: string;
  heroSubCopy?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  items: NewsletterItem[];
}

export type SubscriberStatus = "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "PENDING";

export interface Subscriber {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  status: SubscriberStatus;
  consentEmail: boolean;
  consentKakao: boolean;
  consentDate?: string;
  consentSource?: string;
  consentIp?: string;
  withdrawalDate?: string;
  regions: string[];
  topics: string[];
  frequency: NewsletterType[];
  createdAt: string;
}

export interface ConsentLog {
  id: string;
  subscriberId: string;
  channel: DeliveryChannel;
  action: "grant" | "withdraw";
  source: string;
  ip?: string;
  nightAd: boolean;
  createdAt: string;
}

export interface SuppressionEntry {
  id: string;
  email?: string;
  phone?: string;
  reason: "unsubscribe" | "bounce" | "complaint" | "manual";
  channel?: DeliveryChannel;
  createdAt: string;
}

export interface Campaign {
  id: string;
  newsletterId: string;
  channel: DeliveryChannel;
  name: string;
  scheduledAt?: string;
  sentAt?: string;
  status: NewsletterStatus;
  utmCampaign: string;
  stats: CampaignStats;
  createdAt: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  leads: number;
  phoneClicks: number;
  kakaoClicks: number;
  blogClicks: number;
}

export type LeadType =
  | "PHONE"
  | "KAKAO"
  | "SELL"
  | "BUY"
  | "SWITCH"
  | "POLICY"
  | "RESERVATION";

export interface ConsultationLead {
  id: string;
  subscriberId?: string;
  campaignId?: string;
  type: LeadType;
  name?: string;
  phone?: string;
  memo?: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
}

export interface BrandSetting {
  officeName: string;
  brandName: string;
  repName: string;
  registrationNo: string;
  phone: string;
  mobile: string;
  email: string;
  homepage: string;
  naverBlog: string;
  naverPlace: string;
  kakaoChannel: string;
  address: string;
  logoUrl: string;
  heroPhotoUrl: string;
  qrUrl: string;
  reservationUrl: string;
  privacyUrl: string;
  unsubscribeUrl: string;
  heroMainCopy: string;
  heroSubCopy: string;
  heroSubCopyAlt: string;
  agentDisplayName: string;
}

export interface ComplianceSetting {
  adPrefixText: string;
  adPrefixEnabled: boolean;
  requireExplicitConsent: boolean;
  nightAdBlockEnabled: boolean;
  nightAdStartHour: number;
  nightAdEndHour: number;
  autoSend: boolean;
  requireApprovalBeforeSend: boolean;
  mandatoryFooter: string;
  legalDisclaimer: string;
  propertyAdMode: boolean;
  rules: ComplianceRule[];
}

export interface ComplianceRule {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
  severity: "block" | "warn";
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  createdAt: string;
}

export interface RepurposeOutput {
  channel:
    | "naver_blog"
    | "kakao_message"
    | "instagram_card"
    | "instagram_caption"
    | "youtube_shorts"
    | "naver_band"
    | "sms"
    | "client_summary";
  title: string;
  body: string;
}

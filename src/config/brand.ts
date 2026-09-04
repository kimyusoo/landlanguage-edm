import type { BrandSetting, ComplianceSetting, ComplianceRule } from "@/types";

// 관리자가 브랜드설정 화면에서 편집. 아래는 초기 기본값.
// 아직 입력되지 않은 정보는 빈 문자열로 두고, 관리자에게 입력을 요청합니다. (임의 생성 금지)
export const DEFAULT_BRAND: BrandSetting = {
  officeName: "홍길동부동산",
  brandName: "LAND LANGUAGE / 랜드랭귀지",
  repName: "", // 관리자 입력 필요
  registrationNo: "", // 관리자 입력 필요
  phone: "", // 관리자 입력 필요
  mobile: "010-9030-0157",
  email: "", // 관리자 입력 필요
  homepage: "",
  naverBlog: "",
  naverPlace: "",
  kakaoChannel: "",
  address: "서울시 송파구 방이동 160-2 402호 랜드랭귀지",
  logoUrl: "",
  heroPhotoUrl: "",
  qrUrl: "",
  reservationUrl: "",
  privacyUrl: "",
  unsubscribeUrl: "",
  heroMainCopy: "AI는 중개사를 대체하지 못합니다.\nAI를 아는 중개사가 대체합니다.",
  heroSubCopy:
    "복잡한 부동산 정책과 시장뉴스, AI와 공인중개사의 시선으로 쉽고 빠르게 정리해드립니다.",
  heroSubCopyAlt: "뉴스는 많지만, 내 부동산에 필요한 뉴스는 따로 있습니다.",
  agentDisplayName: "홍길동 공인중개사",
};

export const MANDATORY_FOOTER =
  "본 자료는 일반적인 부동산 정보 제공을 목적으로 작성되었으며 개별적인 투자·세무·법률 판단을 대신하지 않습니다. 세무·법률 사항은 관련 전문가에게 별도 확인하시기 바랍니다. 광고성 정보 수신에 동의한 고객에게 발송되었습니다.";

export const LEGAL_DISCLAIMER =
  "본 자료는 정부·공공기관의 발표자료 및 공개된 언론보도를 바탕으로 일반적인 부동산 정보를 제공하기 위해 작성되었습니다. 개별 부동산의 매수·매도·세무·법률 판단은 개인별 상황에 따라 달라질 수 있으므로 필요한 경우 관련 전문가의 별도 확인을 권합니다.";

// 법령은 변경될 수 있으므로 하드코딩하지 않고 편집 가능한 규칙 세트로 관리 (Configurable Compliance Rule)
export const DEFAULT_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    key: "ad_prefix",
    label: "광고성 메일 제목 앞 (광고) 표기",
    enabled: true,
    severity: "block",
    description:
      "광고성 정보전송 시 제목이 시작되는 부분에 (광고) 를 표시하도록 요구합니다. 실제 적용 문구·예외는 최신 정보통신망법 및 사업자 정책을 관리자가 확인하여 조정합니다.",
  },
  {
    key: "explicit_consent",
    label: "명시적 광고 수신동의 기록 필수",
    enabled: true,
    severity: "block",
    description:
      "수신자별 consentEmail / consentKakao / consentDate / consentSource / consentIP 기록이 있어야 발송 대상에 포함됩니다.",
  },
  {
    key: "night_ad_block",
    label: "야간(21:00~08:00) 광고 전송 통제",
    enabled: true,
    severity: "block",
    description:
      "야간 시간대에는 별도의 야간 수신동의가 있는 대상에게만 광고성 메시지를 전송합니다. 시간대는 설정에서 조정 가능합니다.",
  },
  {
    key: "opt_out_link",
    label: "수신거부 및 개인정보처리방침 링크 포함",
    enabled: true,
    severity: "block",
    description: "모든 광고성 EDM 하단에 수신거부/개인정보처리방침 링크가 있어야 합니다.",
  },
  {
    key: "sender_identity",
    label: "전송자 명칭·연락처 명시",
    enabled: true,
    severity: "block",
    description: "상호, 연락처 등 전송자 정보를 EDM 하단에 표시해야 합니다.",
  },
  {
    key: "suppression_respect",
    label: "수신거부(Suppression) 목록 즉시 반영",
    enabled: true,
    severity: "block",
    description: "수신거부 요청은 즉시 Suppression List 에 반영되고 이후 광고 발송에서 제외됩니다.",
  },
  {
    key: "no_unverified_numbers",
    label: "출처·기준일 없는 숫자 게시 금지",
    enabled: true,
    severity: "block",
    description:
      "세율·대출비율·거래량·가격 등 수치는 source URL 과 source date 가 있어야 화면/EDM 에 게시됩니다.",
  },
  {
    key: "policy_status_required",
    label: "정책 상태값(확정/검토 등) 표기 필수",
    enabled: true,
    severity: "warn",
    description: "확정 정책과 검토 중 정책을 구분하여 표기합니다. '검토 중'을 '시행된다'로 서술하지 않습니다.",
  },
  {
    key: "property_ad_legal_fields",
    label: "매물 광고 모드 법정 표시사항 검증",
    enabled: true,
    severity: "block",
    description:
      "PROPERTY_AD_MODE 에서는 중개사무소 명칭/소재지/연락처/등록번호/개업공인중개사 성명 및 중개대상물 정보가 없으면 발행이 차단됩니다. 항목은 최신 공인중개사법령 기준으로 관리자가 확인합니다.",
  },
];

export const DEFAULT_COMPLIANCE: ComplianceSetting = {
  adPrefixText: "(광고)",
  adPrefixEnabled: true,
  requireExplicitConsent: true,
  nightAdBlockEnabled: true,
  nightAdStartHour: 21,
  nightAdEndHour: 8,
  autoSend: false, // 초기 기본값 — 관리자 검증 후에만 활성화
  requireApprovalBeforeSend: true,
  mandatoryFooter: MANDATORY_FOOTER,
  legalDisclaimer: LEGAL_DISCLAIMER,
  propertyAdMode: false,
  rules: DEFAULT_COMPLIANCE_RULES,
};

// 매물 광고 모드에서 요구되는 법정 표시 필드(참고용 체크리스트).
// 실제 항목은 시행 중인 공인중개사법·시행령·고시를 관리자가 확인하여 갱신합니다.
export const PROPERTY_AD_REQUIRED_FIELDS = [
  { key: "officeName", label: "중개사무소 명칭" },
  { key: "officeAddress", label: "중개사무소 소재지" },
  { key: "officePhone", label: "연락처" },
  { key: "registrationNo", label: "중개사무소 등록번호" },
  { key: "repName", label: "개업공인중개사 성명" },
  { key: "propertyAddress", label: "중개대상물 소재지" },
  { key: "area", label: "면적" },
  { key: "price", label: "가격" },
  { key: "dealType", label: "거래형태(매매/전세/월세)" },
  { key: "propertyType", label: "중개대상물 종류" },
];

export const PROPERTY_AD_CHECKLIST = [
  "존재하지 않는 매물이 아닌가",
  "이미 계약되어 거래할 수 없는 매물이 아닌가",
  "가격·면적·층 등 정보가 사실과 일치하는가",
  "과장·허위 표현(예: '급매 확정', '무조건 수익')이 없는가",
  "중개대상물의 표시·광고 명시사항이 모두 기재되었는가",
  "소재지 표기가 관련 규정에 부합하는가",
];

import type {
  Subscriber,
  ConsentLog,
  SuppressionEntry,
  ConsultationLead,
} from "@/types";

export const REGION_OPTIONS = [
  { code: "seoul_all", label: "서울 전체" },
  { code: "gangnam", label: "강남구" },
  { code: "seocho", label: "서초구" },
  { code: "songpa", label: "송파구" },
  { code: "gangdong", label: "강동구" },
  { code: "mapo", label: "마포구" },
  { code: "yongsan", label: "용산구" },
  { code: "seongdong", label: "성동구" },
  { code: "gwangjin", label: "광진구" },
  { code: "yeongdeungpo", label: "영등포구" },
  { code: "dongjak", label: "동작구" },
  { code: "gyeonggi", label: "경기도" },
  { code: "incheon", label: "인천" },
  { code: "sejong", label: "세종" },
  { code: "daejeon", label: "대전" },
  { code: "daegu", label: "대구" },
  { code: "busan", label: "부산" },
];

export const TOPIC_OPTIONS = [
  { code: "apartment", label: "아파트" },
  { code: "redevelopment", label: "재개발" },
  { code: "reconstruction", label: "재건축" },
  { code: "presale", label: "분양" },
  { code: "subscription", label: "청약" },
  { code: "tax", label: "세금" },
  { code: "loan", label: "대출" },
  { code: "retail", label: "상가" },
  { code: "building", label: "빌딩" },
  { code: "land", label: "토지" },
  { code: "lease", label: "임대차" },
  { code: "auction", label: "경매" },
  { code: "investment", label: "투자" },
  { code: "residence", label: "실거주" },
  { code: "switch", label: "갈아타기" },
];

const NAMES = [
  "김민준", "이서연", "박도윤", "최지우", "정하준", "강수아", "조은우", "윤지호",
  "임하은", "한서준", "오유진", "서예준", "신아린", "권민재", "황시우", "안다은",
  "송지안", "전우빈", "홍세라", "고나현",
];

function iso(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 86400000).toISOString();
}

export const MOCK_SUBSCRIBERS: Subscriber[] = Array.from({ length: 26 }).map((_, i) => {
  const unsub = i % 13 === 12;
  const bounced = i === 7;
  const pending = i === 3 || i === 19;
  const status: Subscriber["status"] = bounced
    ? "BOUNCED"
    : unsub
      ? "UNSUBSCRIBED"
      : pending
        ? "PENDING"
        : "ACTIVE";
  const consented = status === "ACTIVE";
  const regionPool = REGION_OPTIONS.map((r) => r.code);
  const topicPool = TOPIC_OPTIONS.map((t) => t.code);
  return {
    id: `sub_${(i + 1).toString().padStart(3, "0")}`,
    email: `demo.subscriber${i + 1}@example.com`,
    phone: i % 3 === 0 ? `010-0000-${(1000 + i).toString()}` : undefined,
    name: NAMES[i % NAMES.length] ?? `구독자${i + 1}`,
    status,
    consentEmail: consented,
    consentKakao: consented && i % 2 === 0,
    consentDate: consented ? iso(30 + (i % 40)) : undefined,
    consentSource: consented ? (i % 2 === 0 ? "web_form" : "offline_event") : undefined,
    consentIp: consented ? `203.0.113.${10 + i}` : undefined,
    withdrawalDate: unsub ? iso(2) : undefined,
    regions: [regionPool[i % 4 === 0 ? 0 : (i % regionPool.length)]],
    topics: [topicPool[i % topicPool.length], topicPool[(i + 5) % topicPool.length]],
    frequency: i % 4 === 0 ? ["DAILY", "WEEKLY"] : i % 3 === 0 ? ["WEEKLY"] : ["DAILY", "WEEKLY", "MONTHLY"],
    createdAt: iso(45 + i),
  } satisfies Subscriber;
});

export const MOCK_CONSENT_LOGS: ConsentLog[] = MOCK_SUBSCRIBERS.filter(
  (s) => s.consentEmail,
).flatMap((s) => {
  const logs: ConsentLog[] = [
    {
      id: `cl_${s.id}_grant`,
      subscriberId: s.id,
      channel: "EMAIL",
      action: "grant",
      source: s.consentSource ?? "web_form",
      ip: s.consentIp,
      nightAd: false,
      createdAt: s.consentDate ?? iso(30),
    },
  ];
  if (s.consentKakao) {
    logs.push({
      id: `cl_${s.id}_kakao`,
      subscriberId: s.id,
      channel: "KAKAO",
      action: "grant",
      source: s.consentSource ?? "web_form",
      ip: s.consentIp,
      nightAd: false,
      createdAt: s.consentDate ?? iso(30),
    });
  }
  return logs;
});

export const MOCK_SUPPRESSION: SuppressionEntry[] = [
  {
    id: "supp_1",
    email: "demo.subscriber13@example.com",
    reason: "unsubscribe",
    channel: "EMAIL",
    createdAt: iso(2),
  },
  {
    id: "supp_2",
    email: "demo.subscriber8@example.com",
    reason: "bounce",
    channel: "EMAIL",
    createdAt: iso(9),
  },
  {
    id: "supp_3",
    email: "old.contact@example.com",
    reason: "complaint",
    channel: "EMAIL",
    createdAt: iso(20),
  },
];

export const MOCK_LEADS: ConsultationLead[] = [
  {
    id: "lead_1",
    subscriberId: "sub_002",
    campaignId: "cmp_daily_sent",
    type: "KAKAO",
    name: "이서연",
    phone: "010-0000-0002",
    memo: "송파구 재건축 문의 — 규제 완화 포함 여부 궁금",
    status: "new",
    createdAt: iso(1),
  },
  {
    id: "lead_2",
    subscriberId: "sub_005",
    campaignId: "cmp_daily_sent",
    type: "SELL",
    name: "강수아",
    phone: "010-0000-0005",
    memo: "1주택 갈아타기 상담 요청",
    status: "contacted",
    createdAt: iso(2),
  },
  {
    id: "lead_3",
    subscriberId: undefined,
    campaignId: "cmp_weekly_sent",
    type: "PHONE",
    name: "미상",
    phone: "010-0000-9999",
    memo: "전화상담 버튼 클릭 후 콜백 요청",
    status: "new",
    createdAt: iso(3),
  },
  {
    id: "lead_4",
    subscriberId: "sub_010",
    campaignId: "cmp_weekly_sent",
    type: "POLICY",
    name: "한서준",
    memo: "청약 입법예고 관련 자격 상담",
    status: "converted",
    createdAt: iso(5),
  },
];

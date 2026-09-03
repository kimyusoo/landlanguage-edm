import type {
  Article,
  ArticleCluster,
  AiAnalysis,
  GovernmentPolicy,
  Persona,
  PersonaImpact,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA — 아래 내용은 UI/워크플로 확인용 예시입니다.
// 실제 정책·통계가 아니며 모든 항목은 isDemo=true, verification=NEEDS_CHECK 입니다.
// 실제 운영 시 정부 공식자료와 언론 보도로 대체됩니다.
// ─────────────────────────────────────────────────────────────────────────────

const DEMO = " (DEMO DATA)";

function persona(level: number, note: string): PersonaImpact {
  return { level, note };
}

interface Bundle {
  cluster: ArticleCluster;
  articles: Article[];
  policies: GovernmentPolicy[];
  analysis: AiAnalysis;
}

// ── 이슈 1: 주택공급 대책 (검토 단계) ─────────────────────────────────
const issue1: Bundle = {
  cluster: {
    id: "cl_supply",
    headline: "정부, 수도권 주택공급 확대 방안 검토" + DEMO,
    issueDate: "2026-09-03T08:10:00+09:00",
    primarySourceUrl: "https://www.molit.go.kr",
    status: "UNDER_REVIEW",
    articleIds: ["a_supply_1", "a_supply_2", "a_supply_3", "a_supply_4"],
    policyIds: ["pol_supply"],
    analysisId: "an_supply",
    isDemo: true,
  },
  policies: [
    {
      id: "pol_supply",
      sourceId: "src_molit_house",
      clusterId: "cl_supply",
      title: "수도권 주택공급 확대 방안" + DEMO,
      agency: "국토교통부",
      announcedAt: "2026-09-03T09:00:00+09:00",
      effectiveAt: undefined, // 시행일 미정 — 발표일과 구분
      status: "UNDER_REVIEW",
      officialUrl: "https://www.molit.go.kr",
      officialDocUrl: undefined,
      plainSummary:
        "정부가 수도권에서 주택을 더 지을 수 있는 방안을 여러 갈래로 살펴보고 있다는 내용입니다. 아직 확정된 계획이 아니라 검토 단계입니다.",
      rawExcerpt: "…공급 기반 확충을 위한 다양한 방안을 관계기관과 협의 중…",
      verification: "NEEDS_CHECK",
    },
  ],
  articles: [
    {
      id: "a_supply_1",
      sourceId: "src_yna",
      title: "정부, 수도권 공급 확대 카드 만지작…택지·정비사업 병행 검토" + DEMO,
      publisher: "연합뉴스",
      publishedAt: "2026-09-03T08:12:00+09:00",
      url: "https://www.yna.co.kr",
      imageUsable: false,
      summary:
        "정부가 수도권 주택 공급을 늘리기 위한 방안을 검토 중이라는 보도. 신규 택지와 정비사업 속도 조절이 함께 언급됨. 구체적 물량·일정은 미정.",
      keywords: ["주택공급", "수도권", "택지", "정비사업"],
      clusterId: "cl_supply",
      tier: "B",
    },
    {
      id: "a_supply_2",
      sourceId: "src_hankyung",
      title: "\"공급 시그널\" 주는 정부…시장은 일정·물량에 주목" + DEMO,
      publisher: "한국경제",
      publishedAt: "2026-09-03T08:40:00+09:00",
      url: "https://www.hankyung.com",
      imageUsable: false,
      summary:
        "시장에서는 발표 시기와 실제 공급 물량이 관건이라는 분석. 검토 단계라 영향은 제한적이라는 전문가 의견 포함.",
      keywords: ["공급", "정비사업", "시장전망"],
      clusterId: "cl_supply",
      tier: "B",
    },
    {
      id: "a_supply_3",
      sourceId: "src_mk",
      title: "수도권 공급 확대 검토…재건축 규제 완화 여부가 변수" + DEMO,
      publisher: "매일경제",
      publishedAt: "2026-09-03T09:05:00+09:00",
      url: "https://www.mk.co.kr",
      imageUsable: false,
      summary:
        "재건축 관련 규제 완화가 포함될지가 관심사. 관계부처 협의가 필요해 확정까지 시간이 걸릴 수 있다는 내용.",
      keywords: ["재건축", "규제완화", "수도권"],
      clusterId: "cl_supply",
      tier: "B",
    },
    {
      id: "a_supply_4",
      sourceId: "src_edaily",
      title: "정부 \"공급 방안 협의 중\"…확정된 것은 없다" + DEMO,
      publisher: "이데일리",
      publishedAt: "2026-09-03T09:30:00+09:00",
      url: "https://www.edaily.co.kr",
      imageUsable: false,
      summary:
        "국토부는 아직 확정된 계획이 없다고 선을 그음. 언론 보도와 정부 공식 입장 사이에 온도차가 있다는 점을 강조.",
      keywords: ["국토교통부", "공급", "검토"],
      clusterId: "cl_supply",
      tier: "B",
    },
  ],
  analysis: {
    id: "an_supply",
    clusterId: "cl_supply",
    scores: {
      policyImportance: 82,
      marketImpact: 68,
      consumerInterest: 74,
      agentRelevance: 79,
      seoulMetroImpact: 85,
      taxImpact: 20,
      loanFinanceImpact: 30,
      investmentImpact: 61,
      enduserImpact: 70,
      urgency: 45,
    },
    compositeScore: 71.4,
    oneLiner: "수도권 공급 확대, 아직 '검토 단계'입니다",
    whatHappened:
      "정부가 수도권에 주택을 더 공급하기 위한 방안을 여러 갈래로 살펴보고 있습니다. 신규 택지 지정, 정비사업(재개발·재건축) 속도 조절 등이 함께 거론됩니다. 다만 국토교통부는 확정된 계획은 없다고 밝혔고, 구체적인 물량과 일정도 나오지 않았습니다.",
    whyItMatters:
      "공급이 늘어난다는 신호는 중장기적으로 가격 기대에 영향을 줄 수 있습니다. 특히 정비사업 규제가 조정되면 서울·수도권 정비구역의 사업성 판단이 달라질 수 있습니다. 그러나 지금은 방향만 언급된 상태라 실제 영향은 제한적입니다.",
    audienceTags: ["#무주택자", "#매수예정자", "#재개발", "#재건축", "#공인중개사"],
    agentPoints: [
      "고객에게 '확정'이 아니라 '검토'라는 점을 명확히 설명하세요.",
      "정비사업 문의 시, 규제 완화 포함 여부는 아직 미정임을 안내하세요.",
      "발표 시점·대상지역·물량 3가지가 공개될 때 다시 상담하도록 안내하세요.",
    ],
    actionChecklist: [
      "공식 발표문(국토교통부) 원문이 나오면 대상지역을 먼저 확인하세요.",
      "관심 지역이 정비구역이라면 조합·구청 일정과 함께 교차 확인하세요.",
      "매수를 서두르기보다 확정 발표까지 자금계획을 점검하세요.",
    ],
    fact: "국토교통부가 수도권 주택공급 확대 방안을 관계기관과 협의 중이라고 밝혔습니다. 물량·일정·대상지역은 공개되지 않았습니다.",
    interpretation:
      "공인중개사 관점에서는, 서울·수도권 정비사업 관련 문의가 늘어날 가능성이 있으나 규제 완화 포함 여부가 정해지지 않아 사업성 판단을 확정적으로 안내하기 어렵습니다.",
    action:
      "매수·정비사업 투자를 검토 중이라면 공식 발표의 대상지역·시행시점·물량을 확인한 뒤 판단하는 것이 안전합니다.",
    impactByPersona: {
      none: persona(3, "공급 확대 신호는 중장기 매수 계획에 참고가 되지만, 지금 당장 달라지는 것은 없습니다."),
      onePlus: persona(2, "보유 주택에 미치는 즉각적 영향은 제한적입니다. 지역이 정비구역이면 소식을 추적하세요."),
      multi: persona(2, "세제·대출 변화는 언급되지 않았습니다. 정비사업 보유분은 규제 방향을 지켜보세요."),
      buyer: persona(3, "발표 시점·대상지역에 따라 매수 타이밍 판단이 달라질 수 있습니다. 자금계획을 미리 점검하세요."),
      seller: persona(2, "공급 확대 기대가 매수심리에 영향을 줄 수 있으나 현재는 신호 수준입니다."),
      landlord: persona(1, "임대차 관련 직접적 변화는 없습니다."),
      tenant: persona(1, "전월세에 미치는 즉각적 영향은 확인되지 않았습니다."),
    },
    model: "mock-analyzer",
    verification: "NEEDS_CHECK",
  },
};

// ── 이슈 2: 기준금리 동결 (확정) ─────────────────────────────────────
const issue2: Bundle = {
  cluster: {
    id: "cl_rate",
    headline: "한국은행 기준금리 동결 결정" + DEMO,
    issueDate: "2026-09-02T10:00:00+09:00",
    primarySourceUrl: "https://www.bok.or.kr",
    status: "CONFIRMED",
    articleIds: ["a_rate_1", "a_rate_2", "a_rate_3"],
    policyIds: [],
    analysisId: "an_rate",
    isDemo: true,
  },
  policies: [],
  articles: [
    {
      id: "a_rate_1",
      sourceId: "src_yna",
      title: "한국은행, 기준금리 현 수준 동결…\"물가·경기 함께 고려\"" + DEMO,
      publisher: "연합뉴스",
      publishedAt: "2026-09-02T10:05:00+09:00",
      url: "https://www.yna.co.kr",
      imageUsable: false,
      summary:
        "금융통화위원회가 기준금리를 동결. 물가 흐름과 경기 상황을 함께 고려했다는 설명. 가계부채도 주요 변수로 언급.",
      keywords: ["기준금리", "한국은행", "금통위", "가계부채"],
      clusterId: "cl_rate",
      tier: "B",
    },
    {
      id: "a_rate_2",
      sourceId: "src_mt",
      title: "금리 동결에 대출자 '숨통'…변동금리 영향은 제한적" + DEMO,
      publisher: "머니투데이",
      publishedAt: "2026-09-02T11:20:00+09:00",
      url: "https://www.mt.co.kr",
      imageUsable: false,
      summary:
        "기준금리 동결로 급격한 이자 부담 증가는 피했다는 평가. 다만 시장금리는 별도로 움직일 수 있다는 점 강조.",
      keywords: ["대출", "변동금리", "이자부담"],
      clusterId: "cl_rate",
      tier: "B",
    },
    {
      id: "a_rate_3",
      sourceId: "src_sedaily",
      title: "부동산 시장, 금리 방향 전환 신호 기다린다" + DEMO,
      publisher: "서울경제",
      publishedAt: "2026-09-02T13:00:00+09:00",
      url: "https://www.sedaily.com",
      imageUsable: false,
      summary:
        "시장은 금리 인하 시점에 촉각. 거래량 회복 여부는 금융 여건과 함께 볼 필요가 있다는 분석.",
      keywords: ["부동산시장", "거래량", "금리전망"],
      clusterId: "cl_rate",
      tier: "B",
    },
  ],
  analysis: {
    id: "an_rate",
    clusterId: "cl_rate",
    scores: {
      policyImportance: 70,
      marketImpact: 72,
      consumerInterest: 80,
      agentRelevance: 76,
      seoulMetroImpact: 66,
      taxImpact: 10,
      loanFinanceImpact: 90,
      investmentImpact: 64,
      enduserImpact: 78,
      urgency: 55,
    },
    compositeScore: 73.2,
    oneLiner: "기준금리 동결, 대출 이자 급증은 일단 피했습니다",
    whatHappened:
      "한국은행이 기준금리를 현재 수준에서 유지하기로 했습니다. 물가와 경기, 가계부채 상황을 함께 고려했다는 설명입니다. 기준금리가 그대로라도 은행에서 실제로 받는 대출 금리는 시장 상황에 따라 달라질 수 있습니다.",
    whyItMatters:
      "대출 금리는 매수 여력과 직접 연결됩니다. 동결은 이자 부담이 갑자기 커지지 않는다는 의미지만, 인하가 시작된 것은 아닙니다. 거래량 회복 여부를 판단할 때 금융 여건을 함께 봐야 합니다.",
    audienceTags: ["#무주택자", "#1주택자", "#다주택자", "#매수예정자", "#임차인"],
    agentPoints: [
      "'기준금리 동결 = 내 대출금리 동결'이 아님을 설명하세요(가산금리·시장금리 별도).",
      "매수 상담 시 변동/혼합/고정 금리 구조와 상환계획을 함께 점검하세요.",
      "전세대출 이용 임차인에게도 금리 시나리오를 안내하세요.",
    ],
    actionChecklist: [
      "본인 대출의 금리 유형(변동·고정)과 다음 금리변경일을 확인하세요.",
      "매수 예정이라면 여러 은행의 실제 적용금리와 한도를 비교하세요.",
      "전세대출은 보증기관·상품별 조건을 다시 확인하세요.",
    ],
    fact: "한국은행 금융통화위원회가 기준금리를 동결했습니다. (확정)",
    interpretation:
      "공인중개사 관점에서는, 급격한 이자 상승 우려가 줄어 관망하던 실수요 문의가 늘 수 있으나 금리 인하 기대가 실현된 것은 아닙니다.",
    action:
      "매수·전세대출을 고려한다면 본인 대출의 금리 유형과 변경일, 은행별 실제 적용금리를 비교해 상환계획을 세우는 것이 좋습니다.",
    impactByPersona: {
      none: persona(4, "이자 부담이 갑자기 커지지 않아 매수 시뮬레이션을 해볼 만한 시점입니다. 다만 한도는 별도 확인이 필요합니다."),
      onePlus: persona(3, "기존 대출 이자 부담이 안정적으로 유지될 가능성이 큽니다. 금리변경일을 확인하세요."),
      multi: persona(3, "보유 부담이 급증하진 않지만, 대출 규제·총부채 기준은 별도로 점검하세요."),
      buyer: persona(4, "자금 조달 여건이 급변하지 않아 계획 수립에 유리합니다. 은행별 조건을 비교하세요."),
      seller: persona(3, "매수심리에 숨통이 트일 수 있으나 즉각적 거래 급증으로 보기는 이릅니다."),
      landlord: persona(2, "보유·대출 여건은 대체로 유지. 임대차 정책과는 별개입니다."),
      tenant: persona(3, "전세대출 이자 부담이 급증하지 않을 가능성이 큽니다. 상품별 조건은 확인하세요."),
    },
    model: "mock-analyzer",
    verification: "NEEDS_CHECK",
  },
};

// ── 이슈 3: 다주택자 세금 관련 언론 보도 (전망/분석) ────────────────
const issue3: Bundle = {
  cluster: {
    id: "cl_tax",
    headline: "다주택자 보유세 관련 논의 보도" + DEMO,
    issueDate: "2026-09-01T14:00:00+09:00",
    primarySourceUrl: undefined,
    status: "PRESS_REPORTED",
    articleIds: ["a_tax_1", "a_tax_2"],
    policyIds: [],
    analysisId: "an_tax",
    isDemo: true,
  },
  policies: [],
  articles: [
    {
      id: "a_tax_1",
      sourceId: "src_joongang",
      title: "다주택자 보유세 손질 가능성 거론…정부 \"결정된 바 없다\"" + DEMO,
      publisher: "중앙일보",
      publishedAt: "2026-09-01T14:10:00+09:00",
      url: "https://www.joongang.co.kr",
      imageUsable: false,
      summary:
        "보유세 제도 조정 가능성이 정치권에서 거론됨. 기획재정부는 결정된 바 없다는 입장. 구체안·일정 없음.",
      keywords: ["보유세", "다주택자", "종부세", "세제"],
      clusterId: "cl_tax",
      tier: "B",
    },
    {
      id: "a_tax_2",
      sourceId: "src_fnnews",
      title: "\"세제 불확실성\"에 다주택자 관망…전문가 의견 갈려" + DEMO,
      publisher: "파이낸셜뉴스",
      publishedAt: "2026-09-01T16:30:00+09:00",
      url: "https://www.fnnews.com",
      imageUsable: false,
      summary:
        "세제 변화 가능성에 다주택자들이 매도·보유 판단을 미루는 분위기. 전문가 전망이 엇갈린다는 내용.",
      keywords: ["세제", "다주택자", "매도", "보유"],
      clusterId: "cl_tax",
      tier: "B",
    },
  ],
  analysis: {
    id: "an_tax",
    clusterId: "cl_tax",
    scores: {
      policyImportance: 40,
      marketImpact: 45,
      consumerInterest: 66,
      agentRelevance: 72,
      seoulMetroImpact: 58,
      taxImpact: 80,
      loanFinanceImpact: 20,
      investmentImpact: 62,
      enduserImpact: 35,
      urgency: 30,
    },
    compositeScore: 55.1,
    oneLiner: "다주택자 세금 '논의' 단계 — 확정된 변경은 없습니다",
    whatHappened:
      "다주택자 보유세를 손볼 수 있다는 이야기가 언론과 정치권에서 나오고 있습니다. 정부는 결정된 것이 없다고 밝혔습니다. 구체적인 세율이나 시행 시점 같은 내용은 아직 없습니다.",
    whyItMatters:
      "세금은 다주택자의 보유·매도 판단에 큰 영향을 줍니다. 다만 지금은 '논의' 단계이므로, 확정된 것처럼 판단하면 위험합니다. 세제는 주택 수, 취득 시기, 지역, 보유 기간에 따라 적용이 크게 달라집니다.",
    audienceTags: ["#다주택자", "#1주택자", "#매도예정자", "#법인", "#공인중개사"],
    agentPoints: [
      "'논의'와 '확정'을 분명히 구분해 설명하세요.",
      "세액 계산은 개별 요건(주택 수·취득시기·지역·보유기간)에 따라 달라짐을 안내하세요.",
      "구체 상담은 세무사 확인을 함께 권하세요.",
    ],
    actionChecklist: [
      "현재 보유 주택의 취득시기·지역·보유기간을 정리해 두세요.",
      "공식 세제개편안(기획재정부) 발표 전에는 확정으로 간주하지 마세요.",
      "매도 계획이 있다면 세무 전문가와 시나리오별로 상담하세요.",
    ],
    fact: "다주택자 보유세 조정 가능성이 언론에 보도되었으나, 기획재정부는 결정된 바가 없다고 밝혔습니다. (언론 보도 / 전망)",
    interpretation:
      "공인중개사 관점에서는, 세제 불확실성으로 다주택자 매도 문의가 관망세로 돌아설 수 있습니다. 다만 안내는 '확정 아님'을 전제로 해야 합니다.",
    action:
      "다주택자는 보유 주택의 취득시기·지역·보유기간을 정리하고, 공식 세제개편안 발표 전까지는 확정으로 간주하지 않는 것이 안전합니다. 세무사 상담을 병행하세요.",
    impactByPersona: {
      none: persona(1, "직접적인 영향은 거의 없습니다."),
      onePlus: persona(2, "1주택은 논의 대상과 거리가 있으나, 갈아타기 계획이 있다면 흐름을 지켜보세요."),
      multi: persona(4, "보유세 변화 가능성은 보유·매도 판단의 핵심 변수입니다. 다만 현재는 확정이 아닙니다."),
      buyer: persona(2, "추가 매수(다주택 전환) 시 세 부담 시나리오를 미리 점검할 필요가 있습니다."),
      seller: persona(3, "세제 불확실성으로 매도 타이밍 판단이 복잡해졌습니다. 세무 상담을 권합니다."),
      landlord: persona(3, "임대 목적 보유분의 세 부담 변화 가능성을 염두에 두세요."),
      tenant: persona(1, "직접적인 영향은 확인되지 않았습니다."),
    },
    model: "mock-analyzer",
    verification: "NEEDS_CHECK",
  },
};

// ── 이슈 4: 청약제도 일부 개선 (입법예고) ──────────────────────────
const issue4: Bundle = {
  cluster: {
    id: "cl_sub",
    headline: "청약제도 일부 개선안 입법예고" + DEMO,
    issueDate: "2026-09-02T09:30:00+09:00",
    primarySourceUrl: "https://www.molit.go.kr",
    status: "LEGISLATIVE_NOTICE",
    articleIds: ["a_sub_1", "a_sub_2"],
    policyIds: ["pol_sub"],
    analysisId: "an_sub",
    isDemo: true,
  },
  policies: [
    {
      id: "pol_sub",
      sourceId: "src_molit_house",
      clusterId: "cl_sub",
      title: "주택공급규칙 일부개정안(청약제도 개선)" + DEMO,
      agency: "국토교통부",
      announcedAt: "2026-09-02T09:30:00+09:00",
      effectiveAt: undefined,
      status: "LEGISLATIVE_NOTICE",
      officialUrl: "https://www.molit.go.kr",
      officialDocUrl: undefined,
      plainSummary:
        "청약 관련 규칙을 일부 바꾸는 안이 입법예고되었습니다. 입법예고는 의견을 듣는 단계로, 아직 시행이 확정된 것은 아닙니다.",
      rawExcerpt: "…입법예고 기간 동안 국민 의견을 수렴하여…",
      verification: "NEEDS_CHECK",
    },
  ],
  articles: [
    {
      id: "a_sub_1",
      sourceId: "src_chosunbiz",
      title: "청약제도 손질 입법예고…실수요 요건 조정 담겨" + DEMO,
      publisher: "조선비즈",
      publishedAt: "2026-09-02T10:00:00+09:00",
      url: "https://biz.chosun.com",
      imageUsable: false,
      summary:
        "청약 실수요 요건 일부 조정이 입법예고에 포함. 의견수렴 후 확정 예정. 시행일은 아직 정해지지 않음.",
      keywords: ["청약", "입법예고", "실수요", "주택공급규칙"],
      clusterId: "cl_sub",
      tier: "B",
    },
    {
      id: "a_sub_2",
      sourceId: "src_asiae",
      title: "\"청약 대기수요 영향\" 관심…확정까지 변수 남아" + DEMO,
      publisher: "아시아경제",
      publishedAt: "2026-09-02T11:10:00+09:00",
      url: "https://www.asiae.co.kr",
      imageUsable: false,
      summary:
        "청약 대기수요에 영향이 있을 수 있다는 관측. 입법예고 내용이 확정 과정에서 바뀔 수 있다는 점도 지적.",
      keywords: ["청약", "대기수요", "분양"],
      clusterId: "cl_sub",
      tier: "B",
    },
  ],
  analysis: {
    id: "an_sub",
    clusterId: "cl_sub",
    scores: {
      policyImportance: 62,
      marketImpact: 40,
      consumerInterest: 72,
      agentRelevance: 68,
      seoulMetroImpact: 55,
      taxImpact: 10,
      loanFinanceImpact: 25,
      investmentImpact: 38,
      enduserImpact: 74,
      urgency: 40,
    },
    compositeScore: 55.8,
    oneLiner: "청약제도 개선안 '입법예고' — 의견수렴 단계입니다",
    whatHappened:
      "청약과 관련한 규칙을 일부 바꾸는 안이 입법예고되었습니다. 실수요 요건 조정 등이 담긴 것으로 보도되었습니다. 입법예고는 국민 의견을 듣는 절차로, 내용이 바뀔 수도 있고 시행일도 아직 정해지지 않았습니다.",
    whyItMatters:
      "청약을 준비하는 실수요자에게는 자격 요건 변화가 중요합니다. 다만 지금 확정안이 아니므로, 기존 청약 계획을 급하게 바꾸기보다 확정 공고를 기다리는 편이 안전합니다.",
    audienceTags: ["#무주택자", "#매수예정자", "#청약", "#분양", "#공인중개사"],
    agentPoints: [
      "입법예고안은 확정 전이며 변경될 수 있음을 설명하세요.",
      "청약 상담 시 현행 기준으로 안내하되, 개정 가능성을 함께 언급하세요.",
      "확정 공고·시행일이 나오면 자격 요건을 재확인하도록 안내하세요.",
    ],
    actionChecklist: [
      "본인의 현재 청약 자격(무주택 기간·가입기간·지역요건)을 확인하세요.",
      "입법예고 의견제출 기간과 방법을 확인하세요.",
      "관심 단지의 예정 공고 일정을 청약홈 등에서 확인하세요.",
    ],
    fact: "국토교통부가 청약제도 개선 내용을 담은 주택공급규칙 개정안을 입법예고했습니다. (입법예고 / 시행일 미정)",
    interpretation:
      "공인중개사 관점에서는, 청약 대기 실수요자의 문의가 늘 수 있으나 확정안이 아니므로 현행 기준으로 안내하고 변경 가능성을 함께 설명해야 합니다.",
    action:
      "청약 준비자는 현재 자격 요건을 확인하고, 입법예고 의견제출 기간과 관심 단지의 공고 일정을 함께 점검하는 것이 좋습니다.",
    impactByPersona: {
      none: persona(4, "청약 자격 요건 변화 가능성은 무주택 실수요자에게 직접적입니다. 확정 공고를 주시하세요."),
      onePlus: persona(2, "1주택 처분조건부 청약 등을 고려 중이라면 개정 방향을 확인하세요."),
      multi: persona(1, "직접적인 영향은 제한적입니다."),
      buyer: persona(3, "청약과 일반 매수를 함께 고려한다면 자격 변화 여부를 반영해 계획하세요."),
      seller: persona(1, "직접적인 영향은 크지 않습니다."),
      landlord: persona(1, "관련이 낮습니다."),
      tenant: persona(2, "청약을 준비하는 임차인이라면 자격 요건 변화를 확인하세요."),
    },
    model: "mock-analyzer",
    verification: "NEEDS_CHECK",
  },
};

// ── 이슈 5: 서울 아파트 거래량·가격 통계 (확정 통계) ────────────────
const issue5: Bundle = {
  cluster: {
    id: "cl_seoul_stat",
    headline: "서울 아파트 거래량·가격 최신 통계 공개" + DEMO,
    issueDate: "2026-09-01T11:00:00+09:00",
    primarySourceUrl: "https://www.reb.or.kr",
    status: "CONFIRMED",
    articleIds: ["a_stat_1", "a_stat_2"],
    policyIds: [],
    analysisId: "an_stat",
    isDemo: true,
  },
  policies: [],
  articles: [
    {
      id: "a_stat_1",
      sourceId: "src_reb",
      title: "한국부동산원, 주간 아파트가격 동향 발표" + DEMO,
      publisher: "한국부동산원",
      publishedAt: "2026-09-01T11:00:00+09:00",
      url: "https://www.reb.or.kr",
      imageUsable: false,
      summary:
        "주간 아파트 매매·전세 가격 동향 통계 공개. 지역별 편차가 있으며 구체 수치는 원자료 기준으로 확인 필요.",
      keywords: ["아파트가격", "주간동향", "한국부동산원", "전세"],
      clusterId: "cl_seoul_stat",
      tier: "A",
    },
    {
      id: "a_stat_2",
      sourceId: "src_seoul_land",
      title: "서울부동산정보광장, 월간 아파트 매매 신고 건수 갱신" + DEMO,
      publisher: "서울부동산정보광장",
      publishedAt: "2026-09-01T12:00:00+09:00",
      url: "https://land.seoul.go.kr",
      imageUsable: false,
      summary:
        "서울 아파트 매매 신고 건수가 갱신됨. 신고 기한 때문에 최근 월 수치는 이후 늘어날 수 있음.",
      keywords: ["거래량", "서울", "매매신고"],
      clusterId: "cl_seoul_stat",
      tier: "A",
    },
  ],
  analysis: {
    id: "an_stat",
    clusterId: "cl_seoul_stat",
    scores: {
      policyImportance: 20,
      marketImpact: 66,
      consumerInterest: 70,
      agentRelevance: 74,
      seoulMetroImpact: 80,
      taxImpact: 10,
      loanFinanceImpact: 25,
      investmentImpact: 58,
      enduserImpact: 60,
      urgency: 25,
    },
    compositeScore: 53.6,
    oneLiner: "서울 아파트 최신 통계 공개 — 숫자는 원자료 기준으로 확인",
    whatHappened:
      "한국부동산원의 주간 가격 동향과 서울부동산정보광장의 매매 신고 건수가 갱신되었습니다. 지역별로 흐름이 다르고, 매매 신고는 기한이 있어 최근 수치가 나중에 더 늘 수 있습니다.",
    whyItMatters:
      "거래량과 가격 흐름은 매도·매수 타이밍을 가늠하는 기본 지표입니다. 다만 통계는 기준일과 집계 방식에 따라 해석이 달라지므로, 출처와 기준일을 반드시 함께 봐야 합니다.",
    audienceTags: ["#매수예정자", "#매도예정자", "#1주택자", "#공인중개사"],
    agentPoints: [
      "고객에게 수치를 전달할 때 기준일과 출처를 함께 제시하세요.",
      "최근 월 거래량은 신고 지연으로 잠정치임을 설명하세요.",
      "동일 지역이라도 단지·평형별 편차가 크다는 점을 안내하세요.",
    ],
    actionChecklist: [
      "관심 지역의 최근 실거래가를 실거래가 공개시스템에서 직접 확인하세요.",
      "매도/매수 판단 시 최소 3~6개월 추세를 함께 보세요.",
      "호가와 실거래가의 차이를 구분해 확인하세요.",
    ],
    fact: "한국부동산원 주간 가격 동향과 서울 매매 신고 건수 통계가 갱신되었습니다. (공식 통계)",
    interpretation:
      "공인중개사 관점에서는, 통계 공개 시점에 매수·매도 문의가 늘 수 있으나 지역·단지별 편차와 신고 지연을 감안해 안내해야 합니다.",
    action:
      "매수·매도를 검토한다면 관심 지역 실거래가를 직접 확인하고 3~6개월 추세와 호가·실거래가 차이를 함께 살펴보는 것이 좋습니다.",
    impactByPersona: {
      none: persona(3, "거래량·가격 추세는 매수 진입 시점 판단에 참고가 됩니다."),
      onePlus: persona(3, "보유 자산 가치 흐름을 점검하고 갈아타기 시나리오에 반영하세요."),
      multi: persona(2, "지역별 흐름 차이를 포트폴리오 점검에 활용하세요."),
      buyer: persona(4, "관심 지역의 최신 실거래가와 추세를 확인할 좋은 타이밍입니다."),
      seller: persona(4, "호가 설정 전 최신 실거래가·거래량을 반드시 확인하세요."),
      landlord: persona(2, "전세가 흐름은 임대 조건 설정에 참고가 됩니다."),
      tenant: persona(3, "전세가 추세는 재계약·이사 판단에 참고가 됩니다."),
    },
    model: "mock-analyzer",
    verification: "NEEDS_CHECK",
  },
};

export const MOCK_BUNDLES: Bundle[] = [issue1, issue2, issue3, issue4, issue5];

export const MOCK_CLUSTERS: ArticleCluster[] = MOCK_BUNDLES.map((b) => b.cluster);
export const MOCK_ARTICLES: Article[] = MOCK_BUNDLES.flatMap((b) => b.articles);
export const MOCK_POLICIES: GovernmentPolicy[] = MOCK_BUNDLES.flatMap((b) => b.policies);
export const MOCK_ANALYSES: AiAnalysis[] = MOCK_BUNDLES.map((b) => b.analysis);

export type { Bundle };

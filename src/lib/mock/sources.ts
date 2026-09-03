import type { Source } from "@/types";

// 출처 카탈로그. tier A(정부·공공·법령·통계)를 최우선 신뢰도로 취급합니다.
export const MOCK_SOURCES: Source[] = [
  // ── A등급: 국토·주택 ──────────────────────────────────────────────
  { id: "src_molit", name: "국토교통부", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "molit", enabled: true, region: "national", homepageUrl: "https://www.molit.go.kr", feedUrl: "https://www.molit.go.kr/rss/news.xml" },
  { id: "src_molit_house", name: "국토교통부 주택토지 보도자료", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "molit_house", enabled: true, region: "national", homepageUrl: "https://www.molit.go.kr" },
  { id: "src_rtms", name: "국토교통부 실거래가 공개시스템", kind: "STATISTICS", tier: "A", adapterKey: "rtms", enabled: true, region: "national", homepageUrl: "https://rt.molit.go.kr" },
  { id: "src_reb", name: "한국부동산원", kind: "STATISTICS", tier: "A", adapterKey: "reb", enabled: true, region: "national", homepageUrl: "https://www.reb.or.kr" },
  { id: "src_lh", name: "LH 한국토지주택공사", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "lh", enabled: true, region: "national", homepageUrl: "https://www.lh.or.kr" },
  { id: "src_hug", name: "HUG 주택도시보증공사", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "hug", enabled: true, region: "national", homepageUrl: "https://www.khug.or.kr" },
  { id: "src_hf", name: "HF 한국주택금융공사", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "hf", enabled: true, region: "national", homepageUrl: "https://www.hf.go.kr" },

  // ── A등급: 경제·세제 ──────────────────────────────────────────────
  { id: "src_moef", name: "기획재정부", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "moef", enabled: true, region: "national", homepageUrl: "https://www.moef.go.kr" },
  { id: "src_nts", name: "국세청", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "nts", enabled: true, region: "national", homepageUrl: "https://www.nts.go.kr" },
  { id: "src_fsc", name: "금융위원회", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "fsc", enabled: true, region: "national", homepageUrl: "https://www.fsc.go.kr" },
  { id: "src_bok", name: "한국은행", kind: "STATISTICS", tier: "A", adapterKey: "bok", enabled: true, region: "national", homepageUrl: "https://www.bok.or.kr" },
  { id: "src_fss", name: "금융감독원", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "fss", enabled: true, region: "national", homepageUrl: "https://www.fss.or.kr" },

  // ── A등급: 법률·제도 ──────────────────────────────────────────────
  { id: "src_law", name: "국가법령정보센터", kind: "LAW", tier: "A", adapterKey: "law", enabled: true, region: "national", homepageUrl: "https://www.law.go.kr" },
  { id: "src_korea_kr", name: "대한민국 정책브리핑", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "korea_kr", enabled: true, region: "national", homepageUrl: "https://www.korea.kr" },
  { id: "src_gov24", name: "정부24", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "gov24", enabled: true, region: "national", homepageUrl: "https://www.gov.kr" },

  // ── A등급: 지역정책 ──────────────────────────────────────────────
  { id: "src_seoul", name: "서울특별시", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "seoul", enabled: true, region: "seoul", homepageUrl: "https://www.seoul.go.kr" },
  { id: "src_seoul_housing", name: "서울주거포털", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "seoul_housing", enabled: true, region: "seoul", homepageUrl: "https://housing.seoul.go.kr" },
  { id: "src_seoul_land", name: "서울부동산정보광장", kind: "STATISTICS", tier: "A", adapterKey: "seoul_land", enabled: true, region: "seoul", homepageUrl: "https://land.seoul.go.kr" },
  { id: "src_gg", name: "경기도", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "gg", enabled: true, region: "gyeonggi", homepageUrl: "https://www.gg.go.kr" },
  { id: "src_gg_land", name: "경기부동산포털", kind: "STATISTICS", tier: "A", adapterKey: "gg_land", enabled: true, region: "gyeonggi", homepageUrl: "https://gris.gg.go.kr" },
  { id: "src_incheon", name: "인천광역시", kind: "GOV_OFFICIAL", tier: "A", adapterKey: "incheon", enabled: true, region: "incheon", homepageUrl: "https://www.incheon.go.kr" },

  // ── B등급: 주요 언론 ─────────────────────────────────────────────
  { id: "src_yna", name: "연합뉴스", kind: "PRESS", tier: "B", adapterKey: "yna", enabled: true, region: "national", feedUrl: "https://www.yna.co.kr/rss/economy.xml" },
  { id: "src_hankyung", name: "한국경제", kind: "PRESS", tier: "B", adapterKey: "hankyung", enabled: true, region: "national" },
  { id: "src_mk", name: "매일경제", kind: "PRESS", tier: "B", adapterKey: "mk", enabled: true, region: "national" },
  { id: "src_sedaily", name: "서울경제", kind: "PRESS", tier: "B", adapterKey: "sedaily", enabled: true, region: "national" },
  { id: "src_edaily", name: "이데일리", kind: "PRESS", tier: "B", adapterKey: "edaily", enabled: true, region: "national" },
  { id: "src_mt", name: "머니투데이", kind: "PRESS", tier: "B", adapterKey: "mt", enabled: true, region: "national" },
  { id: "src_asiae", name: "아시아경제", kind: "PRESS", tier: "B", adapterKey: "asiae", enabled: true, region: "national" },
  { id: "src_fnnews", name: "파이낸셜뉴스", kind: "PRESS", tier: "B", adapterKey: "fnnews", enabled: true, region: "national" },
  { id: "src_chosunbiz", name: "조선비즈", kind: "PRESS", tier: "B", adapterKey: "chosunbiz", enabled: true, region: "national" },
  { id: "src_joongang", name: "중앙일보", kind: "PRESS", tier: "B", adapterKey: "joongang", enabled: true, region: "national" },
  { id: "src_donga", name: "동아일보", kind: "PRESS", tier: "B", adapterKey: "donga", enabled: true, region: "national" },

  // ── C등급: 전문매체 ─────────────────────────────────────────────
  { id: "src_specialist_a", name: "부동산 전문매체 A", kind: "SPECIALIST", tier: "C", adapterKey: "specialist_a", enabled: false, region: "national" },
];

export function sourceById(id: string): Source | undefined {
  return MOCK_SOURCES.find((s) => s.id === id);
}

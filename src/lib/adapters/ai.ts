import type { RepurposeOutput } from "@/types";
import { env, hasAiKey } from "@/config/env";
import type { AiAdapter, RewriteMode } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock AI — 결정적(deterministic) 변환. 키가 없어도 편집기/추천이 동작합니다.
// AI 가 숫자·날짜·세율을 추측해 만들지 않도록, Mock 은 원문을 재구성만 합니다.
// ─────────────────────────────────────────────────────────────────────────────
class MockAiAdapter implements AiAdapter {
  readonly name = "mock";
  readonly isMock = true;

  async rewrite(text: string, mode: RewriteMode): Promise<string> {
    const t = text.trim();
    switch (mode) {
      case "shorter": {
        const firstSentences = t.split(/(?<=[.。!?])\s+/).slice(0, 2).join(" ");
        return firstSentences || t.slice(0, 120);
      }
      case "easier":
        return t
          .replace(/조정대상지역/g, "일부 규제 지역")
          .replace(/1세대\s?\d주택/g, "여러 채를 보유한 경우")
          .replace(/양도소득세/g, "집을 팔 때 내는 세금")
          .replace(/취득세/g, "집을 살 때 내는 세금")
          .replace(/종합부동산세/g, "일정 기준을 넘는 부동산에 매기는 세금")
          .concat(
            "\n\n(쉽게 정리: 어려운 용어를 풀어 썼습니다. 정확한 적용 여부는 주택 수·취득시기·지역·보유기간에 따라 달라질 수 있습니다.)",
          );
      case "professional":
        return `${t}\n\n※ 실무 참고: 적용 대상·시행시점·경과규정을 원문(공식자료) 기준으로 확인하고, 개별 요건은 세무·법률 전문가 검토를 권합니다.`;
      case "add_agent_view":
        return `${t}\n\n[공인중개사 관점] 상담 시 확인 포인트: (1) 적용 지역·대상 여부 (2) 시행일과 경과조치 (3) 대출·세금 연계 영향 (4) 고객의 보유·거래 계획과의 정합성.`;
      case "add_consumer_view":
        return `${t}\n\n[소비자 관점] 지금 할 일: (1) 내 상황(주택 수·지역·기간) 정리 (2) 공식 발표문 원문 확인 (3) 자금·대출 계획 점검 (4) 필요 시 전문가 상담.`;
      case "tax_impact":
        return `${t}\n\n[세금 영향 분석] 세액은 주택 수, 취득시기, 지역, 보유·거주기간에 따라 크게 달라집니다. 본 내용만으로 세액을 단정하지 마시고, 국세청 자료 및 세무사 확인을 병행하세요. (추정 수치는 표시하지 않습니다.)`;
      case "loan_impact":
        return `${t}\n\n[대출·금융 영향 분석] 기준금리와 실제 대출금리(가산금리 포함)는 다르게 움직일 수 있습니다. LTV·DSR 등 규제 비율은 지역·주택 수·상품에 따라 달라지므로 은행별 실제 조건을 비교하세요.`;
      case "seoul_impact":
        return `${t}\n\n[서울·수도권 영향 분석] 서울은 지역·단지·평형별 편차가 큽니다. 통계 흐름과 개별 실거래가를 함께 확인하고, 정비사업지의 경우 조합·구청 일정을 교차 확인하세요.`;
      case "redev_impact":
        return `${t}\n\n[재개발·재건축 영향 분석] 규제 완화 포함 여부가 사업성 판단의 핵심입니다. 확정 전 단계에서는 조합원 분담금·사업 일정 변동 가능성을 감안해 보수적으로 접근하세요.`;
      case "recheck_source":
        return `${t}\n\n[출처 재확인 필요] 이 문단의 수치·날짜·법령 표현은 공식 원문(source URL) 및 기준일(source date)과 대조가 필요합니다. 확인 전까지 '확인 필요' 상태로 둡니다.`;
      default:
        return t;
    }
  }

  async suggestSubjectLines(headline: string, context: string): Promise<string[]> {
    const base = headline.replace(/\s*\(DEMO DATA\)\s*/g, "").trim();
    return [
      `[오늘의 부동산 AI 브리핑] ${base}`,
      `${base} — 무주택·1주택·다주택 영향 한눈에`,
      `오늘 꼭 확인할 부동산 이슈: ${base}`,
      `${base} | 공인중개사의 3가지 확인 포인트`,
      `뉴스는 많지만, 내 부동산에 필요한 건 따로 있습니다 — ${base}`,
    ].map((s) => s.slice(0, 60));
  }

  async repurpose(edmText: string, brandLine: string, url: string): Promise<RepurposeOutput[]> {
    const clean = edmText.replace(/\s*\(DEMO DATA\)\s*/g, " ").trim();
    const head = clean.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "부동산 브리핑";
    const bullets = clean
      .split("\n")
      .filter((l) => /^\d+\.|^0\d\.|^-\s/.test(l.trim()))
      .slice(0, 5)
      .map((l) => l.replace(/^\d+\.|^0\d\.|^-\s/, "").trim());
    const bulletBlock = bullets.length
      ? bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")
      : "① 정부 주택정책 ② 대출·금리 ③ 서울 아파트 시장";

    return [
      {
        channel: "kakao_message",
        title: "카카오톡 메시지",
        body: `[오늘의 부동산 AI 브리핑]\n오늘 꼭 확인해야 할 부동산 이슈를 정리했습니다.\n\n${bulletBlock}\n\n복잡한 정책을 일반인의 눈높이에서 쉽게 설명해드립니다.\n\n▶ 오늘의 브리핑 보기\n${url}\n\n${brandLine}\n광고 수신거부: ${url}/unsubscribe`,
      },
      {
        channel: "naver_blog",
        title: "네이버 블로그 포스팅",
        body: `제목: ${head} — 공인중개사가 쉽게 풀어드립니다\n\n안녕하세요. ${brandLine} 입니다.\n오늘은 최근 부동산 정책과 시장 뉴스 중 꼭 알아두면 좋은 내용을 정리했습니다.\n\n${bulletBlock}\n\n각 이슈가 무주택자·1주택자·다주택자에게 어떤 의미인지, 지금 무엇을 확인해야 하는지 아래에서 자세히 설명드리겠습니다.\n\n(본문 — EDM 내용 기반, 사실/해설/행동을 구분해 서술)\n\n※ 본 글은 일반적인 정보 제공을 위한 것으로 개별 투자·세무·법률 판단을 대신하지 않습니다.`,
      },
      {
        channel: "instagram_card",
        title: "인스타그램 카드뉴스 (문안)",
        body: `[표지] ${head}\n[카드1] 무슨 일이 있었나\n[카드2] 왜 중요한가\n[카드3] 무주택 / 1주택 / 다주택 영향\n[카드4] 지금 확인할 것 3가지\n[카드5] 상담 안내 — ${brandLine}`,
      },
      {
        channel: "instagram_caption",
        title: "인스타그램 캡션",
        body: `${head}\n\n복잡한 부동산 정책, 공인중개사의 시선으로 쉽게 정리했습니다.\n자세한 내용은 프로필 링크에서 확인하세요.\n\n#부동산 #부동산정책 #부동산뉴스 #공인중개사 #내집마련 #${brandLine.replace(/\s/g, "")}`,
      },
      {
        channel: "youtube_shorts",
        title: "유튜브 쇼츠 60초 대본",
        body: `(0-5초) 오늘 부동산에서 꼭 알아야 할 이슈, 60초로 정리합니다.\n(5-20초) 첫째, ${bullets[0] ?? "정부 정책 동향"}.\n(20-35초) 둘째, ${bullets[1] ?? "대출·금리"}.\n(35-50초) 셋째, ${bullets[2] ?? "서울 시장 흐름"}.\n(50-60초) 내 상황에 맞는 해석이 필요하면 ${brandLine} 로 문의하세요. 구독과 알림 설정!`,
      },
      {
        channel: "naver_band",
        title: "네이버 밴드 게시글",
        body: `📌 ${head}\n\n${bulletBlock}\n\n전체 브리핑: ${url}\n${brandLine} / 문의 환영합니다.`,
      },
      {
        channel: "sms",
        title: "문자 메시지 (단문)",
        body: `[${brandLine}] 오늘의 부동산 브리핑: ${head}. 자세히 보기 ${url} (무료수신거부 ${url}/unsubscribe)`,
      },
      {
        channel: "client_summary",
        title: "상담 고객용 요약문",
        body: `고객님, 최근 이슈를 간단히 정리해 드립니다.\n\n${bulletBlock}\n\n각 항목이 고객님 상황(주택 수·지역·계획)에 어떤 의미인지 상담 때 함께 살펴보겠습니다.`,
      },
    ];
  }
}

// ── Anthropic / OpenAI (키가 있을 때만) ────────────────────────────
class RemoteAiAdapter implements AiAdapter {
  readonly isMock = false;
  constructor(readonly name: "anthropic" | "openai") {}

  private async chat(system: string, user: string): Promise<string> {
    if (this.name === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: env.anthropicModel,
          max_tokens: 1200,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
      const json = (await res.json()) as { content: { text: string }[] };
      return json.content.map((c) => c.text).join("");
    }
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: env.openaiModel,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return json.choices[0]?.message.content ?? "";
  }

  private readonly editorialSystem =
    "당신은 대한민국 공인중개사를 돕는 부동산 정책·뉴스 에디터입니다. 규칙: (1) 숫자·세율·날짜·법령 조문을 추측해서 만들지 마세요. 원문에 없으면 '확인 필요'로 두세요. (2) 사실(FACT)과 해설(INTERPRETATION), 행동(ACTION)을 명확히 구분하세요. (3) '무조건 매수', '반드시 상승' 같은 단정 표현을 쓰지 마세요. (4) 확정 정책과 검토 중 정책을 구분하세요. (5) 40~60대도 읽기 쉬운 한국어로 씁니다.";

  async rewrite(text: string, mode: RewriteMode): Promise<string> {
    const { REWRITE_MODE_LABEL } = await import("./types");
    return this.chat(
      this.editorialSystem,
      `아래 문단을 '${REWRITE_MODE_LABEL[mode]}' 방향으로 다시 써주세요. 원문에 없는 수치·날짜는 추가하지 마세요.\n\n---\n${text}`,
    );
  }

  async suggestSubjectLines(headline: string, context: string): Promise<string[]> {
    const out = await this.chat(
      this.editorialSystem,
      `다음 브리핑의 이메일 제목 후보 5개를 60자 이내로, 과장 없이 제안해주세요. 한 줄에 하나씩.\n헤드라인: ${headline}\n맥락: ${context}`,
    );
    return out
      .split("\n")
      .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  async repurpose(edmText: string, brandLine: string, url: string): Promise<RepurposeOutput[]> {
    // 안전을 위해 Mock 의 구조를 재사용하고, 문구만 원격 모델로 다듬습니다.
    const mock = new MockAiAdapter();
    return mock.repurpose(edmText, brandLine, url);
  }
}

let _ai: AiAdapter | null = null;
export function getAiAdapter(): AiAdapter {
  if (_ai) return _ai;
  if ((env.aiProvider === "anthropic" || env.aiProvider === "openai") && hasAiKey()) {
    _ai = new RemoteAiAdapter(env.aiProvider);
  } else {
    _ai = new MockAiAdapter();
  }
  return _ai;
}

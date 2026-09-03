# LAND LANGUAGE — AI REAL ESTATE BRIEF

AI 부동산 정책·뉴스 EDM 자동 제작 및 발송 시스템.

> 정부·언론 자료 자동 수집 → AI 중요도 분석 → 중복기사 통합 → 일반인용 정책해설 생성
> → "그래서 내 부동산에는?" 분석 → 공인중개사 Comment → EDM 자동 디자인 → 관리자 검토
> → 이메일 HTML / 카카오톡 이미지·문구 생성 → 발송 → 오픈·클릭·상담전환 분석

프리미엄 부동산 리서치 리포트 톤의 관리자 콘솔 + EDM 빌더. **외부 API 키·DB 없이도 전체 화면과
워크플로가 동작하는 Mock Mode** 를 기본으로 하며, 이후 실제 서비스는 Adapter 교체만으로 연결됩니다.

---

## 1. 빠른 시작

```bash
npm install
cp .env.example .env      # 값은 모두 비워둬도 됩니다 (Mock Mode)
npm run dev               # http://localhost:3000
```

- 로그인 없이 바로 `/` 대시보드로 진입합니다. (초기 데모 편의를 위해 인증 게이트 제거)
  운영 배포 시에는 리버스 프록시 basic-auth 또는 별도 인증 미들웨어를 앞단에 두는 것을 권장합니다.
- 첫 화면부터 데모 데이터(정책 5건·기사 13건·통계 10종·구독자 26명·캠페인 2건)로 채워져 있습니다.
- 화면의 모든 정책·뉴스·수치에는 **DEMO DATA** 표기가 있으며 `verification = 확인 필요` 상태입니다.
- EDM 미리보기 디자인은 `stitch_edm/DESIGN.md` 의 "Estate Letter Editorial" 시스템(Plus Jakarta Sans +
  Noto Sans, 딥 네이비 `#00236f` / 번트 앰버 / 파인 틸, 하이라인 보더 카드)을 따릅니다. 렌더러는
  `src/lib/edm/render.ts` 한 곳이며 이메일 미리보기 · 전체화면(`/api/preview/[id]`) · 공개뷰(`/v/[id]`)가
  모두 동일한 출력을 사용합니다.

### 프로덕션 빌드

```bash
npm run build && npm start
```

### 타입 체크

```bash
npm run typecheck
```

### 배포

- **GitHub Pages** — 저장소 루트의 [`index.html`](index.html) 만 정적으로 서빙합니다.
  서버·빌드 없이 열리는 EDM 미리보기 데모(일간/주간/월간 · 이메일/모바일/카카오 카드/인스타 카드뉴스)입니다.
  → `https://kimyusoo.github.io/landlanguage-edm/`
- **전체 관리자 앱**(Next.js)은 Server Actions·API Routes·동적 라우트를 사용하므로 정적 호스팅(Pages)에서는 동작하지 않습니다.
  Vercel 등 Node 런타임 호스팅에 배포하고 환경변수를 주입하세요. (`.env.example` 참고)

---

## 2. 기술 스택

| 영역 | 사용 |
|------|------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend | Next.js Server Actions + Route Handlers |
| DB (프로덕션 경로) | PostgreSQL · Prisma (`prisma/schema.prisma`) |
| 인증 | (데모) 게이트 없음 — 배포 시 프록시 인증 권장 |
| AI | Adapter — `mock` / `anthropic` / `openai` |
| Email | Adapter — `mock` / `resend` (+ `ses`·`sendgrid` 골격) |
| KakaoTalk | Adapter — `mock` / `bizmessage` (알림톡·친구톡 공식 API) |
| Charts | Recharts (자체 제작, 언론사 이미지 미사용) |
| Scheduler | Route Handler `/api/cron/{daily|weekly|monthly}` (외부 크론이 호출) |

특정 모델·벤더에 종속되지 않도록 모든 외부 연동은 `src/lib/adapters/*` 의 인터페이스를 통합니다.

---

## 3. 환경변수 (`.env`)

키가 비어 있으면 해당 어댑터는 자동으로 **Mock** 으로 폴백합니다. 상세는 관리자 화면 `시스템설정` 에도 표시됩니다.

| 변수 | 역할 |
|------|------|
| `NEXT_PUBLIC_APP_URL` | 링크·UTM·수신거부 URL 생성 기준 |
| `AI_PROVIDER` | `mock` \| `anthropic` \| `openai` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Anthropic 사용 시 |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | OpenAI 사용 시 |
| `EMAIL_PROVIDER` | `mock` \| `resend` \| `ses` \| `sendgrid` |
| `RESEND_API_KEY` / `EMAIL_FROM` | Resend 사용 시 |
| `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | SES 사용 시 |
| `SENDGRID_API_KEY` | SendGrid 사용 시 |
| `KAKAO_PROVIDER` | `mock` \| `bizmessage` |
| `KAKAO_API_KEY` / `KAKAO_CHANNEL_ID` / `KAKAO_SENDER_KEY` | 카카오 공식 채널/비즈메시지 |
| `DATA_BACKEND` | `mock`(인메모리) \| `prisma`(PostgreSQL) |
| `DATABASE_URL` | Prisma 사용 시 PostgreSQL 접속 문자열 |
| `CRON_SECRET` | `/api/cron/*` 호출 인증 헤더 `x-cron-secret` |
| `AUTO_SEND` | 자동발송 마스터 스위치. **기본 `false`** — 관리자 승인 후에만 발송 |

> ⚠️ API Key 는 소스코드에 저장하지 않습니다. `.env` 는 `.gitignore` 에 포함되어 있습니다.

---

## 4. 폴더 구조

```
src/
  app/
    (admin)/               # 관리자 콘솔 (좌측 메뉴 전체)
      page.tsx             # 대시보드 (KPI + 오늘 다뤄야 하는 이슈 TOP 5)
      news/                # 오늘의 뉴스 · 이슈 클러스터 상세(FACT/INTERPRETATION/ACTION, 페르소나 영향)
      policies/            # 정부정책 (발표일/시행일/상태 구분)
      statistics/          # 시장통계 (기준일·전월/전년·출처 필수)
      edm/                 # EDM 목록 + 빌더([id]) — 라이브 프리뷰·AI 편집·준법검증·워크플로
      repurpose/           # 콘텐츠 변환 (원소스 멀티유즈)
      subscribers/         # 구독자·수신동의·수신거부(Suppression)
      leads/               # 상담고객(전환 리드)
      campaigns/           # 발송관리 + 발송 로그
      analytics/           # 통계 (오픈/CTR/클릭 분해/관심 뉴스 TOP 10)
      sources/             # 출처관리 (Adapter 목록·등급·on/off)
      settings/brand/      # 브랜드설정
      settings/compliance/ # 준법설정 (Configurable Compliance Rule)
      settings/system/     # 어댑터 상태·환경변수·크론
    v/[id]/                # 공개 브리핑 뷰 (카카오/SNS 링크 대상, 인증 불필요)
    unsubscribe/           # 수신거부 신청 (즉시 Suppression 반영)
    api/preview/[id]/      # EDM HTML (email|mobile|kakao) 렌더
    api/cron/[period]/     # daily|weekly|monthly Draft 자동 생성
    api/health/            # 상태 점검
    actions.ts             # 모든 Server Action (생성/편집/승인/발송/설정)
  components/               # UI 프리미티브 · 사이드바 · 차트 · EDM 빌더/프리뷰
  config/                  # env · 브랜드 기본값 · 준법 규칙 · 좌측 메뉴
  lib/
    adapters/              # ai · email · kakao · sources (+ types 인터페이스)
    data/                  # Repository 계층 (mock ↔ prisma 교체 지점)
    edm/                   # build(초안 조립) · render(이메일/모바일/카카오 HTML)
    compliance/            # 발송 전 준법 검증
    kakao/                 # 카카오 문구 생성 · Export 비율
    mock/                  # 시드 데이터 + 인메모리 스토어
  types/                   # 도메인 타입
prisma/schema.prisma       # 프로덕션 DB 스키마 (20개 테이블)
```

---

## 5. 핵심 워크플로

### 5.1 상태 머신

```
COLLECTED → ANALYZED → DRAFT → REVIEW → APPROVED → SCHEDULED → SENT
                                                          └→ FAILED
```

- `대시보드 → 수집·분석 실행` : (Mock) 수집·중요도 분석 재실행
- `EDM 만들기 → DAILY/WEEKLY/MONTHLY 초안 생성` : 이슈 랭킹 → 섹션 구성 → 초안
- `EDM 빌더` : 항목별 인라인 편집 + AI 편집 10종(`더 쉽게`·`더 짧게`·`더 전문적으로`·
  `공인중개사/소비자 관점 추가`·`세금/대출/서울/재개발 영향 분석`·`출처 다시 확인`)
- `준법 검증(Compliance Check)` : 차단(block) 항목이 하나라도 있으면 발송 불가
- `승인(APPROVED)` 후 `지금 발송` 또는 `발송 예약`
- `테스트 발송` : 임의 주소로 미리보기 메일 (Mock 은 로그만 기록)

### 5.2 안전장치 (요구사항 43번)

- AI 가 **날짜·세율·대출비율·거래량**을 추측 생성하지 않음 — Mock 은 원문 재구성만 수행
- **출처 URL + 기준일 없는 수치**는 화면·EDM 에 게시 불가 (`오늘의 숫자` 검증)
- 정책 **발표일 ≠ 시행일**, **확정 ↔ 검토** 상태를 항상 구분 표기
- **FACT / INTERPRETATION / ACTION** 3단 분리 (사실과 의견을 섞지 않음)
- `AUTO_SEND=false` 기본값 — 관리자 승인 전 자동 발송 금지
- 광고 수신동의(`consentEmail`·`consentKakao`) + 수신거부(Suppression) 즉시 반영
- 야간(21~08시) 광고 전송 통제 · 제목 앞 `(광고)` 자동 부착 (준법설정에서 조정)
- 기사 원문 미저장 — 제목·언론사·발행일·URL·요약·키워드만 보관
- 매물 광고(`PROPERTY_AD_MODE`) 시 법정 표시사항 검증 체크리스트 제공

### 5.3 스케줄러

배포 플랫폼(Vercel Cron / GitHub Actions / OS crontab)에서 아래를 호출:

```bash
curl -H "x-cron-secret: $CRON_SECRET" $NEXT_PUBLIC_APP_URL/api/cron/daily
curl -H "x-cron-secret: $CRON_SECRET" $NEXT_PUBLIC_APP_URL/api/cron/weekly
curl -H "x-cron-secret: $CRON_SECRET" $NEXT_PUBLIC_APP_URL/api/cron/monthly
```

생성된 초안은 **관리자 승인 후에만** 발송됩니다.

---

## 6. 실제 API 연결 방법

| 목표 | 작업 |
|------|------|
| Claude/OpenAI 연결 | `.env` 에 `AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY` (또는 openai). `src/lib/adapters/ai.ts` 의 `RemoteAiAdapter` 사용 |
| 실제 메일 발송 | `EMAIL_PROVIDER=resend` + `RESEND_API_KEY`. SES/SendGrid 는 `src/lib/adapters/email.ts` 골격 확장 |
| 카카오 알림톡/친구톡 | `KAKAO_PROVIDER=bizmessage` + 발신프로필·템플릿 승인 후 `BizMessageKakaoAdapter` 구현 |
| PostgreSQL 전환 | `DATA_BACKEND=prisma` + `DATABASE_URL`, `npx prisma migrate dev`, `src/lib/data/index.ts` 를 Prisma 구현으로 교체, `prisma/seed.ts` 작성 |
| 정부·언론 수집 | `src/lib/adapters/sources.ts` 의 `RssSourceAdapter` 활성화 (robots·이용약관 준수, 정식 API·RSS 우선) |
| EDM 이미지 Export | `콘텐츠 변환` 화면의 각 비율 미리보기를 headless 렌더러(puppeteer 등)에 연결하면 PNG/JPG/PDF 자동화 |

---

## 7. 데이터베이스 (프로덕션)

`prisma/schema.prisma` 에 20개 테이블 정의:

`sources` · `articles` · `article_clusters`(ArticleCluster) · `government_policies` · `market_statistics` ·
`ai_analysis` · `newsletters` · `newsletter_items` · `subscribers` · `subscriber_preferences` ·
`consent_logs` · `suppression_list`(SuppressionEntry) · `campaigns` · `email_deliveries` ·
`kakao_deliveries` · `click_events` · `consultation_leads` · `brand_settings` · `compliance_settings` · `audit_logs`

---

## 8. 보안 · 준법 체크리스트

- [x] API Key 는 `.env` 로만 주입, 저장소 커밋 금지 (`.gitignore` 반영)
- [ ] 인증 게이트는 데모를 위해 제거됨 — 운영 배포 시 프록시 basic-auth/SSO 등을 앞단에 둘 것
- [x] 관리자 승인 전 자동발송 차단 (`AUTO_SEND=false` + 준법설정 이중 스위치)
- [x] 수신동의·수신거부 기록 및 즉시 반영, 발송 대상 자동 필터
- [x] 광고 표기·전송자 정보·수신거부/개인정보처리방침 링크 검증
- [x] 출처 없는 수치 게시 차단, 정책 상태값 표기 유도
- [x] 저작권: 기사 전문 미저장·미복제, 자체 제작 차트만 사용
- [x] 모바일 가독성(본문 최소 크기·줄간격·명암비·큰 CTA), 40~60대 고려
- [ ] 실제 법령 문구·시간대·예외는 최신 정보통신망법·공인중개사법령을 확인해 `준법설정` 에서 조정

---

## 9. 알려진 제약 (데모 단계)

- `DATA_BACKEND=mock` 은 인메모리 — 서버 재시작 시 시드 상태로 복원 (`시스템설정 → 초기화` 버튼도 제공)
- 오픈/클릭 추적 픽셀·리다이렉트 엔드포인트는 통계 스키마만 준비 (실제 집계는 배포 시 연결)
- 이미지(PNG/JPG/PDF) 자동 Export 는 미리보기 URL + 수동 캡처/인쇄로 대체, headless 렌더러 연결 시 자동화
- Next.js 14.2.x 라인 사용 — 배포 전 최신 패치 버전 확인 권장

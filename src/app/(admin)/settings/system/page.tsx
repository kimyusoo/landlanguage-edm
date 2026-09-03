import { Card, CardHeader, SectionTitle, Badge } from "@/components/ui";
import { ActionButton } from "@/components/action-button";
import { resetDemoData } from "@/app/actions";
import { providerStatus, env } from "@/config/env";

const ENV_DOCS: { key: string; role: string }[] = [
  { key: "NEXT_PUBLIC_APP_URL", role: "링크/UTM/수신거부 URL 생성 기준" },
  { key: "AI_PROVIDER / ANTHROPIC_API_KEY / OPENAI_API_KEY", role: "AI 어댑터 선택. 없으면 Mock(결정적 재구성)" },
  { key: "EMAIL_PROVIDER / RESEND_API_KEY", role: "메일 어댑터. 없으면 Mock(로그만 기록)" },
  { key: "KAKAO_PROVIDER / KAKAO_API_KEY / KAKAO_CHANNEL_ID", role: "카카오 공식 채널/비즈메시지. 없으면 Mock" },
  { key: "DATA_BACKEND / DATABASE_URL", role: "mock(인메모리) 또는 prisma(PostgreSQL)" },
  { key: "CRON_SECRET", role: "외부 크론이 /api/cron/* 호출 시 인증" },
  { key: "AUTO_SEND", role: "자동발송 마스터 스위치. 기본 false" },
];

const CRON = [
  { path: "/api/cron/daily", when: "매일 오전", desc: "최근 24시간 수집 → AI 분석 → DAILY Draft 생성" },
  { path: "/api/cron/weekly", when: "매주 월요일", desc: "최근 7일 분석 → WEEKLY Draft 생성" },
  { path: "/api/cron/monthly", when: "매월 1일", desc: "이전 달 전체 분석 → MONTHLY Draft 생성" },
];

export default function SystemSettingsPage() {
  const st = providerStatus();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Settings">시스템설정</SectionTitle>

      <Card>
        <CardHeader title="어댑터 상태" eyebrow="Providers" />
        <div className="grid gap-3 p-5 sm:grid-cols-4">
          {[
            ["AI", st.ai],
            ["Email", st.email],
            ["Kakao", st.kakao],
            ["Data", st.data],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-[#E3E7EC] p-3">
              <div className="text-xs text-slate-400">{k}</div>
              <div className="mt-1">
                <Badge tone={v === "MOCK" ? "gold" : "green"}>{v}</Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-[#E3E7EC] px-5 py-3 text-xs text-slate-500">
          AUTO_SEND: <Badge tone={env.autoSend ? "rose" : "slate"}>{String(env.autoSend)}</Badge> · 앱 URL: {env.appUrl}
        </p>
      </Card>

      <Card>
        <CardHeader title="환경변수 역할" eyebrow=".env" />
        <ul className="divide-y divide-[#E3E7EC] text-sm">
          {ENV_DOCS.map((e) => (
            <li key={e.key} className="px-5 py-3">
              <code className="text-xs text-navy">{e.key}</code>
              <p className="mt-0.5 text-xs text-slate-500">{e.role}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="자동화 스케줄" eyebrow="Scheduler / Cron" />
        <ul className="divide-y divide-[#E3E7EC] text-sm">
          {CRON.map((c) => (
            <li key={c.path} className="px-5 py-3">
              <div className="flex items-center gap-2">
                <code className="text-xs text-navy">{c.path}</code>
                <Badge tone="slate">{c.when}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{c.desc}</p>
            </li>
          ))}
        </ul>
        <p className="border-t border-[#E3E7EC] px-5 py-3 text-xs text-slate-500">
          호출 예: <code>curl -H &quot;x-cron-secret: $CRON_SECRET&quot; {env.appUrl}/api/cron/daily</code>. 크론 시간은 배포 플랫폼(예: Vercel Cron, GitHub Actions, OS crontab)에서 설정합니다. 생성된 초안은 <b>관리자 승인 후에만</b> 발송됩니다.
        </p>
      </Card>

      <Card>
        <CardHeader title="데모 데이터" eyebrow="Danger Zone" />
        <div className="flex items-center justify-between p-5">
          <p className="text-sm text-slate-500">
            인메모리 시드 데이터를 초기 상태로 되돌립니다. (Mock Mode 전용)
          </p>
          <ActionButton action={resetDemoData} className="btn-ghost" confirm="데모 데이터를 초기화할까요?">
            초기화
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}

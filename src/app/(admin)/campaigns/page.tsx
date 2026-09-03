import Link from "next/link";
import { Card, CardHeader, SectionTitle, Badge } from "@/components/ui";
import * as data from "@/lib/data";
import { mailLog } from "@/lib/adapters/email";
import { kakaoLog } from "@/lib/adapters/kakao";
import { formatDate, pct } from "@/lib/utils";
import { providerStatus } from "@/config/env";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await data.listCampaigns();
  const mails = mailLog().slice(0, 30);
  const kakaos = kakaoLog().slice(0, 20);
  const st = providerStatus();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Delivery">발송관리</SectionTitle>
      <div className="rounded-xl border border-[#E3E7EC] bg-white px-4 py-2 text-xs text-slate-500">
        메일 어댑터: <b className={st.email === "MOCK" ? "text-gold-dark" : "text-emerald-600"}>{st.email}</b>
        {" · "}카카오 어댑터: <b className={st.kakao === "MOCK" ? "text-gold-dark" : "text-emerald-600"}>{st.kakao}</b>
        {" · "}Mock 모드에서는 실제 발송 없이 로그만 기록됩니다.
      </div>

      <Card>
        <CardHeader title="캠페인" eyebrow="Campaigns" />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-[#E3E7EC] text-left text-xs text-slate-400">
                <th className="px-4 py-2 font-medium">캠페인</th>
                <th className="px-3 py-2 font-medium">채널</th>
                <th className="px-3 py-2 font-medium">발송</th>
                <th className="px-3 py-2 font-medium">도달</th>
                <th className="px-3 py-2 font-medium">오픈</th>
                <th className="px-3 py-2 font-medium">클릭</th>
                <th className="px-3 py-2 font-medium">수신거부</th>
                <th className="px-3 py-2 font-medium">상담</th>
                <th className="px-3 py-2 font-medium">발송일</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const s = c.stats;
                return (
                  <tr key={c.id} className="border-b border-[#E3E7EC] last:border-0">
                    <td className="px-4 py-2.5">
                      <Link href={`/v/${c.newsletterId}`} className="font-medium text-navy hover:underline">
                        {c.name}
                      </Link>
                      <div className="text-[11px] text-slate-400">utm_campaign={c.utmCampaign}</div>
                    </td>
                    <td className="px-3 py-2.5"><Badge tone="slate">{c.channel}</Badge></td>
                    <td className="px-3 py-2.5 tabular-nums">{s.sent}</td>
                    <td className="px-3 py-2.5 tabular-nums">{s.delivered}</td>
                    <td className="px-3 py-2.5 tabular-nums">{s.opened} <span className="text-[11px] text-slate-400">({pct(s.sent ? (s.opened / s.sent) * 100 : 0)})</span></td>
                    <td className="px-3 py-2.5 tabular-nums">{s.clicked} <span className="text-[11px] text-slate-400">({pct(s.sent ? (s.clicked / s.sent) * 100 : 0)})</span></td>
                    <td className="px-3 py-2.5 tabular-nums">{s.unsubscribed}</td>
                    <td className="px-3 py-2.5 tabular-nums text-gold-dark">{s.leads}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-400">{formatDate(c.sentAt, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={`이메일 발송 로그 (${mails.length})`} eyebrow="Mail Log" />
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {mails.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">아직 발송 로그가 없습니다. EDM 빌더에서 테스트 발송 또는 캠페인 발송을 실행하세요.</p>
            ) : (
              <table className="w-full text-xs">
                <tbody>
                  {mails.map((m, i) => (
                    <tr key={i} className="border-b border-[#E3E7EC] last:border-0">
                      <td className="px-4 py-2">{m.ok ? "✅" : "❌"}</td>
                      <td className="px-2 py-2 font-mono">{m.to}</td>
                      <td className="px-2 py-2 text-slate-500">{m.subject}</td>
                      <td className="px-2 py-2 text-slate-400">{m.provider}</td>
                      <td className="px-4 py-2 text-slate-400">{formatDate(m.at, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title={`카카오 발송 로그 (${kakaos.length})`} eyebrow="Kakao Log" />
          <div className="max-h-80 overflow-y-auto scrollbar-thin p-5 text-sm text-slate-500">
            {kakaos.length === 0 ? (
              <p>
                카카오 공식 API(알림톡/친구톡) 연동 시 발송 로그가 기록됩니다. 연동 전에는 콘텐츠 변환 화면에서 문구/이미지를
                생성해 채널에 직접 게시하세요.
              </p>
            ) : (
              <ul className="space-y-1">
                {kakaos.map((k, i) => (
                  <li key={i} className="font-mono text-xs">
                    {k.ok ? "✅" : "❌"} {k.to} · {k.type} · {formatDate(k.at, true)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

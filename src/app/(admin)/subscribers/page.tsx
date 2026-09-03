import { Card, CardHeader, SectionTitle, Badge, KpiCard } from "@/components/ui";
import * as data from "@/lib/data";
import { addSuppressionAction } from "@/app/actions";
import { formatDate } from "@/lib/utils";
import { REGION_OPTIONS, TOPIC_OPTIONS } from "@/lib/mock/subscribers";

const regionLabel = (c: string) => REGION_OPTIONS.find((r) => r.code === c)?.label ?? c;
const topicLabel = (c: string) => TOPIC_OPTIONS.find((t) => t.code === c)?.label ?? c;

export default async function SubscribersPage() {
  const [subs, consent, suppression] = await Promise.all([
    data.listSubscribers(),
    data.listConsentLogs(),
    data.listSuppression(),
  ]);
  const active = subs.filter((s) => s.status === "ACTIVE");
  const kakaoConsent = subs.filter((s) => s.consentKakao).length;

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Audience">구독자 · 수신동의 관리</SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="전체" value={subs.length} />
        <KpiCard label="ACTIVE" value={active.length} />
        <KpiCard label="이메일 동의" value={subs.filter((s) => s.consentEmail).length} />
        <KpiCard label="카카오 동의" value={kakaoConsent} tone="gold" />
      </div>

      <Card>
        <CardHeader title="구독자 목록" eyebrow="Subscribers" />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-[#E3E7EC] text-left text-xs text-slate-400">
                <th className="px-4 py-2 font-medium">이메일</th>
                <th className="px-3 py-2 font-medium">이름</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium">이메일동의</th>
                <th className="px-3 py-2 font-medium">카카오동의</th>
                <th className="px-3 py-2 font-medium">관심지역</th>
                <th className="px-3 py-2 font-medium">관심분야</th>
                <th className="px-3 py-2 font-medium">동의일</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-[#E3E7EC] last:border-0">
                  <td className="px-4 py-2.5 font-mono text-xs">{s.email}</td>
                  <td className="px-3 py-2.5">{s.name}</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={s.status === "ACTIVE" ? "green" : s.status === "BOUNCED" ? "rose" : "slate"}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5">{s.consentEmail ? "✓" : "–"}</td>
                  <td className="px-3 py-2.5">{s.consentKakao ? "✓" : "–"}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{s.regions.map(regionLabel).join(", ")}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{s.topics.map(topicLabel).join(", ")}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{s.consentDate ? formatDate(s.consentDate) : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={`수신동의 로그 (${consent.length})`} eyebrow="Consent Log" />
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            <table className="w-full text-xs">
              <tbody>
                {consent.map((c) => (
                  <tr key={c.id} className="border-b border-[#E3E7EC] last:border-0">
                    <td className="px-4 py-2 font-mono">{c.subscriberId}</td>
                    <td className="px-2 py-2"><Badge tone="slate">{c.channel}</Badge></td>
                    <td className="px-2 py-2">{c.action === "grant" ? "동의" : "철회"}</td>
                    <td className="px-2 py-2 text-slate-400">{c.source}</td>
                    <td className="px-2 py-2 text-slate-400">{c.ip ?? "-"}</td>
                    <td className="px-4 py-2 text-slate-400">{formatDate(c.createdAt, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title={`수신거부 목록 (${suppression.length})`} eyebrow="Suppression List" />
          <div className="p-4">
            <form action={async (fd) => { "use server"; await addSuppressionAction(String(fd.get("email") ?? "")); }} className="mb-3 flex gap-2">
              <input name="email" type="email" required placeholder="수신거부 추가할 이메일" className="field text-sm" />
              <button className="btn btn-ghost shrink-0 text-xs">추가</button>
            </form>
            <ul className="space-y-1.5">
              {suppression.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border border-[#E3E7EC] px-3 py-2 text-xs">
                  <span className="font-mono">{s.email}</span>
                  <span className="flex items-center gap-2 text-slate-400">
                    <Badge tone="rose">{s.reason}</Badge>
                    {formatDate(s.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-400">
              수신거부 요청은 즉시 반영되며, 목록에 포함된 주소로는 광고 메시지를 발송하지 않습니다.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

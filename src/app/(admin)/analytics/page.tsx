import { Card, CardHeader, SectionTitle, KpiCard, ScoreBar } from "@/components/ui";
import { MiniBar } from "@/components/charts";
import * as data from "@/lib/data";
import { pct } from "@/lib/utils";

export default async function AnalyticsPage() {
  const [campaigns, issues] = await Promise.all([data.listCampaigns(), data.topIssues(10)]);

  const total = campaigns.reduce(
    (a, c) => {
      a.sent += c.stats.sent;
      a.delivered += c.stats.delivered;
      a.opened += c.stats.opened;
      a.clicked += c.stats.clicked;
      a.unsub += c.stats.unsubscribed;
      a.leads += c.stats.leads;
      a.phone += c.stats.phoneClicks;
      a.kakao += c.stats.kakaoClicks;
      a.blog += c.stats.blogClicks;
      return a;
    },
    { sent: 0, delivered: 0, opened: 0, clicked: 0, unsub: 0, leads: 0, phone: 0, kakao: 0, blog: 0 },
  );

  const perCampaign = campaigns.map((c) => ({
    date: c.name.replace(/^(Daily|Weekly|Monthly)\s·\s/, ""),
    value: c.stats.opened,
  }));

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Analytics">통계</SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="총 발송" value={total.sent} />
        <KpiCard label="도달" value={total.delivered} />
        <KpiCard label="오픈율" value={pct(total.sent ? (total.opened / total.sent) * 100 : 0)} />
        <KpiCard label="CTR" value={pct(total.sent ? (total.clicked / total.sent) * 100 : 0)} />
        <KpiCard label="상담요청" value={total.leads} tone="gold" />
        <KpiCard label="수신거부" value={total.unsub} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="캠페인별 오픈 수" eyebrow="Opens by Campaign" />
          <div className="p-5">
            <MiniBar data={perCampaign} />
          </div>
        </Card>
        <Card>
          <CardHeader title="링크 클릭 분해" eyebrow="Click Breakdown" />
          <div className="space-y-2 p-5">
            <ScoreBar label="전화 클릭" value={clamp(total.phone, total.clicked)} />
            <ScoreBar label="카카오 클릭" value={clamp(total.kakao, total.clicked)} />
            <ScoreBar label="블로그 클릭" value={clamp(total.blog, total.clicked)} />
            <p className="pt-2 text-xs text-slate-400">
              전화 {total.phone} · 카카오 {total.kakao} · 블로그 {total.blog} (총 클릭 {total.clicked})
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="가장 관심도가 높았던 뉴스 TOP 10" eyebrow="Top Interest" />
        <ol className="divide-y divide-[#E3E7EC]">
          {issues.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-3">
              <span className="font-serif text-sm font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-sm text-navy">{c.headline}</span>
              <span className="w-40">
                <ScoreBar label="소비자 관심" value={c.analysis?.scores.consumerInterest ?? 0} />
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function clamp(v: number, max: number) {
  if (!max) return 0;
  return Math.round((v / max) * 100);
}

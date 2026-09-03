import type { Campaign, Newsletter } from "@/types";
import { buildNewsletter } from "@/lib/edm/build";
import { MOCK_CLUSTERS, MOCK_ANALYSES, MOCK_POLICIES, MOCK_ARTICLES } from "./clusters";
import { MOCK_STATISTICS } from "./statistics";
import { DEFAULT_BRAND } from "@/config/brand";

const analysesByCluster = Object.fromEntries(
  MOCK_ANALYSES.map((a) => [a.clusterId, a]),
);

// 오늘의 DAILY 초안 — 관리자 검토(REVIEW) 상태로 시드
const dailyDraft: Newsletter = {
  ...buildNewsletter({
    type: "DAILY",
    periodStart: "2026-09-02T09:00:00+09:00",
    periodEnd: "2026-09-03T09:00:00+09:00",
    editionLabel: "2026.09.03 THU",
    clusters: MOCK_CLUSTERS,
    analyses: analysesByCluster,
    policies: MOCK_POLICIES,
    statistics: MOCK_STATISTICS,
    articles: MOCK_ARTICLES,
    agentDisplayName: DEFAULT_BRAND.agentDisplayName,
  }),
  id: "nl_daily_draft",
  status: "REVIEW",
};
dailyDraft.items = dailyDraft.items.map((it) => ({ ...it, newsletterId: "nl_daily_draft" }));

// 어제 발송된 DAILY
const dailySent: Newsletter = {
  ...buildNewsletter({
    type: "DAILY",
    periodStart: "2026-09-01T09:00:00+09:00",
    periodEnd: "2026-09-02T09:00:00+09:00",
    editionLabel: "2026.09.02 WED",
    clusters: MOCK_CLUSTERS.slice(1),
    analyses: analysesByCluster,
    policies: MOCK_POLICIES,
    statistics: MOCK_STATISTICS,
    articles: MOCK_ARTICLES,
    agentDisplayName: DEFAULT_BRAND.agentDisplayName,
  }),
  id: "nl_daily_sent",
  status: "SENT",
  approvedBy: "admin@landlanguage.example",
  approvedAt: "2026-09-02T08:30:00+09:00",
};
dailySent.items = dailySent.items.map((it) => ({ ...it, newsletterId: "nl_daily_sent" }));

// 지난주 발송된 WEEKLY
const weeklySent: Newsletter = {
  ...buildNewsletter({
    type: "WEEKLY",
    periodStart: "2026-08-25T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    editionLabel: "2026.08.25 – 08.31",
    clusters: MOCK_CLUSTERS,
    analyses: analysesByCluster,
    policies: MOCK_POLICIES,
    statistics: MOCK_STATISTICS,
    articles: MOCK_ARTICLES,
    agentDisplayName: DEFAULT_BRAND.agentDisplayName,
  }),
  id: "nl_weekly_sent",
  status: "SENT",
  approvedBy: "admin@landlanguage.example",
  approvedAt: "2026-09-01T08:00:00+09:00",
};
weeklySent.items = weeklySent.items.map((it) => ({ ...it, newsletterId: "nl_weekly_sent" }));

export const MOCK_NEWSLETTERS: Newsletter[] = [dailyDraft, dailySent, weeklySent];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "cmp_daily_sent",
    newsletterId: "nl_daily_sent",
    channel: "EMAIL",
    name: "Daily · 2026.09.02 WED",
    scheduledAt: "2026-09-02T08:40:00+09:00",
    sentAt: "2026-09-02T08:45:00+09:00",
    status: "SENT",
    utmCampaign: "daily_20260902",
    createdAt: "2026-09-02T08:35:00+09:00",
    stats: {
      sent: 22,
      delivered: 21,
      opened: 13,
      clicked: 6,
      unsubscribed: 1,
      bounced: 1,
      leads: 2,
      phoneClicks: 1,
      kakaoClicks: 3,
      blogClicks: 2,
    },
  },
  {
    id: "cmp_weekly_sent",
    newsletterId: "nl_weekly_sent",
    channel: "EMAIL",
    name: "Weekly · 2026.08.25–08.31",
    scheduledAt: "2026-09-01T08:00:00+09:00",
    sentAt: "2026-09-01T08:05:00+09:00",
    status: "SENT",
    utmCampaign: "weekly_20260831",
    createdAt: "2026-09-01T07:50:00+09:00",
    stats: {
      sent: 24,
      delivered: 23,
      opened: 16,
      clicked: 9,
      unsubscribed: 0,
      bounced: 1,
      leads: 2,
      phoneClicks: 2,
      kakaoClicks: 4,
      blogClicks: 3,
    },
  },
];

import type {
  AiAnalysis,
  Article,
  ArticleCluster,
  BrandSetting,
  Campaign,
  ComplianceSetting,
  ConsentLog,
  ConsultationLead,
  GovernmentPolicy,
  MarketStatistic,
  Newsletter,
  Source,
  Subscriber,
  SuppressionEntry,
  AuditLogEntry,
} from "@/types";
import { DEFAULT_BRAND, DEFAULT_COMPLIANCE } from "@/config/brand";
import { MOCK_SOURCES } from "./sources";
import {
  MOCK_ARTICLES,
  MOCK_CLUSTERS,
  MOCK_ANALYSES,
  MOCK_POLICIES,
} from "./clusters";
import { MOCK_STATISTICS } from "./statistics";
import {
  MOCK_SUBSCRIBERS,
  MOCK_CONSENT_LOGS,
  MOCK_SUPPRESSION,
  MOCK_LEADS,
} from "./subscribers";
import { MOCK_NEWSLETTERS, MOCK_CAMPAIGNS } from "./newsletters";

export interface MockDB {
  sources: Source[];
  articles: Article[];
  clusters: ArticleCluster[];
  analyses: AiAnalysis[];
  policies: GovernmentPolicy[];
  statistics: MarketStatistic[];
  newsletters: Newsletter[];
  campaigns: Campaign[];
  subscribers: Subscriber[];
  consentLogs: ConsentLog[];
  suppression: SuppressionEntry[];
  leads: ConsultationLead[];
  brand: BrandSetting;
  compliance: ComplianceSetting;
  audit: AuditLogEntry[];
}

function seed(): MockDB {
  return {
    sources: structuredClone(MOCK_SOURCES),
    articles: structuredClone(MOCK_ARTICLES),
    clusters: structuredClone(MOCK_CLUSTERS),
    analyses: structuredClone(MOCK_ANALYSES),
    policies: structuredClone(MOCK_POLICIES),
    statistics: structuredClone(MOCK_STATISTICS),
    newsletters: structuredClone(MOCK_NEWSLETTERS),
    campaigns: structuredClone(MOCK_CAMPAIGNS),
    subscribers: structuredClone(MOCK_SUBSCRIBERS),
    consentLogs: structuredClone(MOCK_CONSENT_LOGS),
    suppression: structuredClone(MOCK_SUPPRESSION),
    leads: structuredClone(MOCK_LEADS),
    brand: structuredClone(DEFAULT_BRAND),
    compliance: structuredClone(DEFAULT_COMPLIANCE),
    audit: [
      {
        id: "audit_seed",
        actor: "system",
        action: "seed",
        entity: "system",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

const g = globalThis as unknown as { __LL_DB__?: MockDB };
if (!g.__LL_DB__) g.__LL_DB__ = seed();

export const db: MockDB = g.__LL_DB__;

export function resetDb() {
  g.__LL_DB__ = seed();
}

export function audit(entry: Omit<AuditLogEntry, "id" | "createdAt">) {
  db.audit.unshift({
    ...entry,
    id: `audit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  });
}

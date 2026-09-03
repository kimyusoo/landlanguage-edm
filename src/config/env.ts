// 환경변수 접근 지점. 키가 없으면 각 어댑터는 Mock 으로 폴백합니다.

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  aiProvider: (process.env.AI_PROVIDER ?? "mock").toLowerCase(),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o",

  emailProvider: (process.env.EMAIL_PROVIDER ?? "mock").toLowerCase(),
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "LAND LANGUAGE <brief@landlanguage.example>",

  kakaoProvider: (process.env.KAKAO_PROVIDER ?? "mock").toLowerCase(),
  kakaoApiKey: process.env.KAKAO_API_KEY ?? "",
  kakaoChannelId: process.env.KAKAO_CHANNEL_ID ?? "",

  dataBackend: (process.env.DATA_BACKEND ?? "mock").toLowerCase(),
  databaseUrl: process.env.DATABASE_URL ?? "",

  adminEmail: process.env.ADMIN_EMAIL ?? "admin@landlanguage.example",
  adminPassword: process.env.ADMIN_PASSWORD ?? "changeme",
  authSecret: process.env.AUTH_SECRET ?? "dev-insecure-secret",
  cronSecret: process.env.CRON_SECRET ?? "dev-cron-secret",

  autoSend: (process.env.AUTO_SEND ?? "false").toLowerCase() === "true",
};

export function providerStatus() {
  return {
    ai: env.aiProvider === "mock" || !hasAiKey() ? "MOCK" : env.aiProvider.toUpperCase(),
    email:
      env.emailProvider === "mock" || !hasEmailKey()
        ? "MOCK"
        : env.emailProvider.toUpperCase(),
    kakao:
      env.kakaoProvider === "mock" || !env.kakaoApiKey
        ? "MOCK"
        : env.kakaoProvider.toUpperCase(),
    data: env.dataBackend === "prisma" && env.databaseUrl ? "PRISMA" : "MOCK",
  };
}

export function hasAiKey() {
  if (env.aiProvider === "anthropic") return !!env.anthropicApiKey;
  if (env.aiProvider === "openai") return !!env.openaiApiKey;
  return false;
}

export function hasEmailKey() {
  if (env.emailProvider === "resend") return !!env.resendApiKey;
  if (env.emailProvider === "ses")
    return !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;
  if (env.emailProvider === "sendgrid") return !!process.env.SENDGRID_API_KEY;
  return false;
}

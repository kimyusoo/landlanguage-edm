import { env, hasEmailKey } from "@/config/env";
import type { EmailAdapter, EmailMessage, EmailSendResult } from "./types";

// 발송 로그(인메모리) — Mock Mode 발송 결과 확인용
const g = globalThis as unknown as { __LL_MAIL_LOG__?: MailLogEntry[] };
if (!g.__LL_MAIL_LOG__) g.__LL_MAIL_LOG__ = [];
export interface MailLogEntry {
  to: string;
  subject: string;
  at: string;
  provider: string;
  ok: boolean;
  providerId?: string;
  error?: string;
}
export function mailLog() {
  return g.__LL_MAIL_LOG__!;
}

class MockEmailAdapter implements EmailAdapter {
  readonly name = "mock";
  readonly isMock = true;
  async send(msg: EmailMessage): Promise<EmailSendResult> {
    const providerId = `mock-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    g.__LL_MAIL_LOG__!.unshift({
      to: msg.to,
      subject: msg.subject,
      at: new Date().toISOString(),
      provider: "mock",
      ok: true,
      providerId,
    });
    return { ok: true, providerId, mock: true };
  }
  async sendBatch(msgs: EmailMessage[]): Promise<EmailSendResult[]> {
    return Promise.all(msgs.map((m) => this.send(m)));
  }
}

class ResendEmailAdapter implements EmailAdapter {
  readonly name = "resend";
  readonly isMock = false;
  async send(msg: EmailMessage): Promise<EmailSendResult> {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.resendApiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: msg.from ?? env.emailFrom,
          to: msg.to,
          subject: msg.subject,
          html: msg.html,
          text: msg.text,
          headers: msg.headers,
        }),
      });
      const json = (await res.json()) as { id?: string; message?: string };
      const ok = res.ok && !!json.id;
      g.__LL_MAIL_LOG__!.unshift({
        to: msg.to,
        subject: msg.subject,
        at: new Date().toISOString(),
        provider: "resend",
        ok,
        providerId: json.id,
        error: ok ? undefined : json.message,
      });
      return ok ? { ok, providerId: json.id } : { ok: false, error: json.message };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }
  async sendBatch(msgs: EmailMessage[]): Promise<EmailSendResult[]> {
    const out: EmailSendResult[] = [];
    for (const m of msgs) {
      out.push(await this.send(m));
      await new Promise((r) => setTimeout(r, 120)); // 완만한 rate limit
    }
    return out;
  }
}

// SES / SendGrid 는 인터페이스만 준비. 키가 있으면 여기서 구현을 확장하세요.
class NotConfiguredEmailAdapter implements EmailAdapter {
  readonly isMock = false;
  constructor(readonly name: string) {}
  async send(): Promise<EmailSendResult> {
    return { ok: false, error: `${this.name} 어댑터가 아직 구현되지 않았습니다. EMAIL_PROVIDER=resend 또는 mock 을 사용하세요.` };
  }
  async sendBatch(msgs: EmailMessage[]): Promise<EmailSendResult[]> {
    return msgs.map(() => ({ ok: false, error: `${this.name} 미구현` }));
  }
}

let _email: EmailAdapter | null = null;
export function getEmailAdapter(): EmailAdapter {
  if (_email) return _email;
  if (env.emailProvider === "resend" && hasEmailKey()) _email = new ResendEmailAdapter();
  else if (env.emailProvider === "ses" && hasEmailKey()) _email = new NotConfiguredEmailAdapter("ses");
  else if (env.emailProvider === "sendgrid" && hasEmailKey()) _email = new NotConfiguredEmailAdapter("sendgrid");
  else _email = new MockEmailAdapter();
  return _email;
}

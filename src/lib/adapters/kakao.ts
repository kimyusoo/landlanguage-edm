import { env } from "@/config/env";
import type { EmailSendResult, KakaoAdapter, KakaoMessage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// 카카오 — 공식 채널/비즈메시지(알림톡·친구톡) API 연동용 Adapter.
// 개인 카카오톡 계정 자동화/매크로는 사용하지 않습니다.
// API 연동이 없어도 '문구 생성 / 이미지 생성' 기능은 별도로 제공됩니다.
// ─────────────────────────────────────────────────────────────────────────────

const g = globalThis as unknown as { __LL_KKO_LOG__?: KakaoLogEntry[] };
if (!g.__LL_KKO_LOG__) g.__LL_KKO_LOG__ = [];
export interface KakaoLogEntry {
  to: string;
  type: string;
  at: string;
  provider: string;
  ok: boolean;
  error?: string;
}
export function kakaoLog() {
  return g.__LL_KKO_LOG__!;
}

class MockKakaoAdapter implements KakaoAdapter {
  readonly name = "mock";
  readonly isMock = true;
  async send(msg: KakaoMessage): Promise<EmailSendResult> {
    g.__LL_KKO_LOG__!.unshift({
      to: msg.to,
      type: msg.type,
      at: new Date().toISOString(),
      provider: "mock",
      ok: true,
    });
    return { ok: true, providerId: `kko-mock-${Date.now().toString(36)}`, mock: true };
  }
}

class BizMessageKakaoAdapter implements KakaoAdapter {
  readonly name = "bizmessage";
  readonly isMock = false;
  async send(msg: KakaoMessage): Promise<EmailSendResult> {
    // 실제 사업자 API 스펙에 맞춰 요청을 구성하세요 (알림톡 템플릿 승인 필요).
    return {
      ok: false,
      error:
        "bizmessage 어댑터는 사업자 API 키/발신프로필/템플릿 승인 정보가 필요합니다. 연동 전까지 Mock 을 사용하세요.",
    };
  }
}

let _kakao: KakaoAdapter | null = null;
export function getKakaoAdapter(): KakaoAdapter {
  if (_kakao) return _kakao;
  _kakao =
    env.kakaoProvider === "bizmessage" && env.kakaoApiKey
      ? new BizMessageKakaoAdapter()
      : new MockKakaoAdapter();
  return _kakao;
}

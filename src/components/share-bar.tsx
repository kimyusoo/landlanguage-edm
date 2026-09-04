"use client";

import * as React from "react";

export interface SharePayload {
  subject: string;
  /** 메일/카톡 본문(plain text) */
  body: string;
  url: string;
}

export function ShareBar({ payload, className }: { payload: SharePayload; className?: string }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const flash = (m: string) => {
    setMsg(m);
    window.clearTimeout((flash as unknown as { _t?: number })._t);
    (flash as unknown as { _t?: number })._t = window.setTimeout(() => setMsg(null), 3000);
  };

  const mailto =
    `mailto:?subject=${encodeURIComponent(payload.subject)}` +
    `&body=${encodeURIComponent(payload.body)}`;
  const gmail =
    `https://mail.google.com/mail/?view=cm&fs=1&tf=1` +
    `&su=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;

  const sendMail = () => {
    const before = Date.now();
    window.location.href = mailto;
    window.setTimeout(() => {
      if (document.hasFocus() && Date.now() - before < 1500) window.open(gmail, "_blank", "noopener");
    }, 700);
  };

  const sendKakao = async () => {
    const w = window as unknown as { Kakao?: { Share?: { sendDefault: (o: unknown) => void } } };
    if (w.Kakao?.Share) {
      w.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: payload.subject,
          description: payload.body.split("\n").slice(0, 3).join(" "),
          link: { mobileWebUrl: payload.url, webUrl: payload.url },
        },
        buttons: [{ title: "브리핑 보기", link: { mobileWebUrl: payload.url, webUrl: payload.url } }],
      });
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: payload.subject, text: payload.body, url: payload.url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(payload.body);
      flash("카카오톡 메시지가 복사되었습니다. 대화창에 붙여넣어 전송하세요.");
    } catch {
      window.prompt("아래 내용을 복사해 카카오톡에 붙여넣으세요.", payload.body);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(payload.url);
      flash("링크가 복사되었습니다.");
    } catch {
      window.prompt("링크 복사", payload.url);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={sendMail} className="btn btn-ghost text-xs">✉ 메일로 보내기</button>
        <button onClick={sendKakao} className="btn btn-ghost text-xs">💬 카카오톡으로 보내기</button>
        <button onClick={copyLink} className="btn btn-ghost text-xs">🔗 링크 복사</button>
      </div>
      {msg ? <p className="mt-2 text-xs text-emerald-700">{msg}</p> : null}
    </div>
  );
}

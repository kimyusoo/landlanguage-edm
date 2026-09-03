"use client";

import * as React from "react";
import type { Newsletter, RepurposeOutput } from "@/types";
import { CopyBox } from "@/components/copy-box";
import { generateRepurpose } from "@/app/actions";
import { EXPORT_RATIOS } from "@/lib/kakao/message";

export function RepurposeClient({
  newsletters,
  initialId,
}: {
  newsletters: Pick<Newsletter, "id" | "title" | "editionLabel" | "type">[];
  initialId?: string;
}) {
  const [id, setId] = React.useState(initialId ?? newsletters[0]?.id ?? "");
  const [pending, start] = React.useTransition();
  const [outputs, setOutputs] = React.useState<RepurposeOutput[]>([]);
  const [kakao, setKakao] = React.useState<string>("");

  const gen = () =>
    start(async () => {
      const r = await generateRepurpose(id);
      setOutputs(r.outputs ?? []);
      setKakao((r as { kakao?: string }).kakao ?? "");
    });

  React.useEffect(() => {
    if (id) gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="space-y-5">
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <select className="field !w-auto" value={id} onChange={(e) => setId(e.target.value)}>
          {newsletters.map((n) => (
            <option key={n.id} value={n.id}>
              [{n.type}] {n.title} · {n.editionLabel}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" disabled={pending || !id} onClick={gen}>
          {pending ? "생성 중…" : "원소스 멀티유즈 생성"}
        </button>
        <div className="ml-auto flex flex-wrap gap-1.5 text-xs">
          {EXPORT_RATIOS.map((r) => (
            <a
              key={r.key}
              href={
                r.key === "kakao"
                  ? `/api/preview/${id}?mode=kakao`
                  : r.key === "email"
                    ? `/api/preview/${id}`
                    : `/api/preview/${id}?mode=mobile`
              }
              target="_blank"
              rel="noreferrer"
              className="chip hover:bg-cloud"
              title={`${r.w}${r.h ? `×${r.h}` : ""}`}
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Export: 각 채널 미리보기를 새 탭에서 열어 캡처하거나, 브라우저 인쇄(PDF 저장)를 사용하세요. HTML/PNG/JPG/PDF 는
        해당 미리보기에서 저장합니다. (이미지 자동 생성 파이프라인은 배포 환경에 headless 렌더러를 연결하면 확장됩니다.)
      </p>

      {kakao && <CopyBox title="카카오톡 메시지" text={kakao} />}

      <div className="grid gap-4 md:grid-cols-2">
        {outputs.map((o) => (
          <CopyBox key={o.channel} title={o.title} text={o.body} />
        ))}
      </div>
    </div>
  );
}

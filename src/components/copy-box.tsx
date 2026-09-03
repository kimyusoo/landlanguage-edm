"use client";

import * as React from "react";

export function CopyBox({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-navy">{title}</span>
        <button
          className="btn btn-ghost py-1 text-xs"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "복사됨 ✓" : "문구 복사"}
        </button>
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-cloud p-3 text-xs leading-relaxed text-ink scrollbar-thin">
        {text}
      </pre>
    </div>
  );
}

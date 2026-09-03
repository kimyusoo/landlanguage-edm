"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function PreviewFrame({
  emailHtml,
  mobileHtml,
}: {
  emailHtml: string;
  mobileHtml: string;
}) {
  const [mode, setMode] = React.useState<"email" | "mobile">("email");
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        {(["email", "mobile"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium",
              mode === m ? "border-navy bg-navy text-white" : "border-[#E3E7EC] bg-white text-slate-500",
            )}
          >
            {m === "email" ? "이메일 (640px)" : "모바일"}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "mx-auto overflow-hidden rounded-xl border border-[#E3E7EC] bg-cloud",
          mode === "mobile" ? "max-w-[390px]" : "w-full",
        )}
      >
        <iframe
          title="EDM preview"
          srcDoc={mode === "email" ? emailHtml : mobileHtml}
          className="h-[720px] w-full bg-white"
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ActionButton({
  action,
  children,
  className,
  confirm,
  onDone,
}: {
  action: () => Promise<unknown>;
  children: React.ReactNode;
  className?: string;
  confirm?: string;
  onDone?: (r: unknown) => void;
}) {
  const [pending, start] = React.useTransition();
  return (
    <button
      className={cn("btn", className)}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          const r = await action();
          onDone?.(r);
        });
      }}
    >
      {pending ? "처리 중…" : children}
    </button>
  );
}

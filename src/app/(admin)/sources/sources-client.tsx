"use client";

import * as React from "react";
import type { Source } from "@/types";
import { toggleSourceAction } from "@/app/actions";

export function SourceToggle({ source }: { source: Source }) {
  const [on, setOn] = React.useState(source.enabled);
  const [, start] = React.useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          setOn((v) => !v);
          await toggleSourceAction(source.id, !on);
        })
      }
      className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-300"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

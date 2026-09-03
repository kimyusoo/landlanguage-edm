"use client";

import * as React from "react";
import type { ConsultationLead } from "@/types";
import { updateLeadStatus } from "@/app/actions";
import { formatDate } from "@/lib/utils";

const LEAD_TYPE_LABEL: Record<string, string> = {
  PHONE: "전화상담",
  KAKAO: "카카오톡 상담",
  SELL: "매도상담",
  BUY: "매수상담",
  SWITCH: "갈아타기 상담",
  POLICY: "정책 상담",
  RESERVATION: "상담 예약",
};

const STATUS = ["new", "contacted", "converted", "closed"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  contacted: "연락함",
  converted: "전환",
  closed: "종료",
};

export function LeadsTable({ leads }: { leads: ConsultationLead[] }) {
  const [, start] = React.useTransition();
  return (
    <table className="w-full min-w-[760px] text-sm">
      <thead>
        <tr className="border-b border-[#E3E7EC] text-left text-xs text-slate-400">
          <th className="px-4 py-2 font-medium">유형</th>
          <th className="px-3 py-2 font-medium">이름</th>
          <th className="px-3 py-2 font-medium">연락처</th>
          <th className="px-3 py-2 font-medium">메모</th>
          <th className="px-3 py-2 font-medium">캠페인</th>
          <th className="px-3 py-2 font-medium">유입</th>
          <th className="px-3 py-2 font-medium">상태</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((l) => (
          <tr key={l.id} className="border-b border-[#E3E7EC] last:border-0">
            <td className="px-4 py-2.5">{LEAD_TYPE_LABEL[l.type] ?? l.type}</td>
            <td className="px-3 py-2.5">{l.name ?? "-"}</td>
            <td className="px-3 py-2.5 font-mono text-xs">{l.phone ?? "-"}</td>
            <td className="px-3 py-2.5 text-xs text-slate-500">{l.memo ?? "-"}</td>
            <td className="px-3 py-2.5 text-xs text-slate-400">{l.campaignId ?? "-"}</td>
            <td className="px-3 py-2.5 text-xs text-slate-400">{formatDate(l.createdAt, true)}</td>
            <td className="px-3 py-2.5">
              <select
                className="field !w-auto !py-1 text-xs"
                defaultValue={l.status}
                onChange={(e) =>
                  start(() => updateLeadStatus(l.id, e.target.value as (typeof STATUS)[number]))
                }
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

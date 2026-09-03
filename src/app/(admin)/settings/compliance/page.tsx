import { Card, CardHeader, SectionTitle, Badge } from "@/components/ui";
import * as data from "@/lib/data";
import { saveComplianceAction } from "@/app/actions";
import { PROPERTY_AD_REQUIRED_FIELDS, PROPERTY_AD_CHECKLIST } from "@/config/brand";

function Toggle({ name, on, label, desc }: { name: string; on: boolean; label: string; desc: string }) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-[#E3E7EC] p-3">
      <input type="checkbox" name={name} defaultChecked={on} className="mt-0.5 h-4 w-4" />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{desc}</span>
      </span>
    </label>
  );
}

export default async function ComplianceSettingsPage() {
  const c = await data.getCompliance();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Settings">준법설정 (Configurable Compliance Rule)</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        관련 법령·사업자 정책은 변경될 수 있으므로 규칙은 코드에 하드코딩하지 않고 여기에서 켜고 끕니다. 실제 적용 문구·예외·시간대는
        최신 정보통신망법 등 관련 규정을 확인하여 조정하세요.
      </p>

      <form action={saveComplianceAction} className="space-y-6">
        <Card>
          <CardHeader title="발송 안전장치" eyebrow="Safety" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <Toggle name="requireApprovalBeforeSend" on={c.requireApprovalBeforeSend} label="발송 전 관리자 승인 필수" desc="승인(APPROVED) 전에는 캠페인 발송이 차단됩니다." />
            <Toggle name="autoSend" on={c.autoSend} label="자동발송 허용 (AUTO_SEND)" desc="기본값 꺼짐. 충분히 검증한 후에만 켜세요. .env 의 AUTO_SEND 와 모두 true 여야 동작합니다." />
            <Toggle name="requireExplicitConsent" on={c.requireExplicitConsent} label="명시적 광고 수신동의 필수" desc="consentEmail/consentKakao 가 있고 수신거부 목록에 없는 ACTIVE 구독자에게만 발송." />
            <Toggle name="nightAdBlockEnabled" on={c.nightAdBlockEnabled} label="야간 광고 전송 통제" desc="야간 시간대에는 별도 야간 수신동의 대상에게만 발송하거나 예약." />
          </div>
          <div className="flex flex-wrap items-end gap-4 border-t border-[#E3E7EC] p-5">
            <div>
              <label className="mb-1 block text-xs text-slate-500">야간 시작(시)</label>
              <input type="number" name="nightAdStartHour" defaultValue={c.nightAdStartHour} min={0} max={23} className="field !w-24" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">야간 종료(시)</label>
              <input type="number" name="nightAdEndHour" defaultValue={c.nightAdEndHour} min={0} max={23} className="field !w-24" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-500">광고 제목 접두어</label>
              <input name="adPrefixText" defaultValue={c.adPrefixText} className="field !w-40" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="adPrefixEnabled" defaultChecked={c.adPrefixEnabled} className="h-4 w-4" />
              제목 앞 접두어 자동 부착
            </label>
          </div>
        </Card>

        <Card>
          <CardHeader title="필수 고지 문구" eyebrow="Mandatory Text" />
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-xs text-slate-500">EDM 하단 필수 푸터</label>
              <textarea name="mandatoryFooter" defaultValue={c.mandatoryFooter} className="field h-24" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">법률·세무 고지</label>
              <textarea name="legalDisclaimer" defaultValue={c.legalDisclaimer} className="field h-24" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="매물 광고 모드 (PROPERTY_AD_MODE)"
            eyebrow="Property Ad"
            action={<Badge tone={c.propertyAdMode ? "green" : "slate"}>{c.propertyAdMode ? "ON" : "OFF"}</Badge>}
          />
          <div className="p-5">
            <Toggle
              name="propertyAdMode"
              on={c.propertyAdMode}
              label="특정 매물을 EDM 에 포함"
              desc="켜면 아래 법정 표시사항이 모두 입력되어야 발행됩니다. 항목은 시행 중인 공인중개사법·시행령·고시 기준으로 확인하세요."
            />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PROPERTY_AD_REQUIRED_FIELDS.map((f) => (
                <div key={f.key} className="rounded-lg bg-cloud px-3 py-2 text-xs text-slate-600">• {f.label}</div>
              ))}
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold text-navy">검수 체크리스트</div>
              <ul className="mt-1 list-disc pl-5 text-xs text-slate-500">
                {PROPERTY_AD_CHECKLIST.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="규칙 세트" eyebrow="Rules" />
          <ul className="divide-y divide-[#E3E7EC]">
            {c.rules.map((r) => (
              <li key={r.key} className="flex items-start justify-between gap-3 px-5 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy">{r.label}</span>
                    <Badge tone={r.severity === "block" ? "rose" : "amber"}>{r.severity}</Badge>
                    <Badge tone={r.enabled ? "green" : "slate"}>{r.enabled ? "적용" : "해제"}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{r.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary px-6">저장</button>
        </div>
      </form>
    </div>
  );
}

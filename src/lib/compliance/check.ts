import type { ComplianceSetting, Newsletter, BrandSetting } from "@/types";

export interface ComplianceIssue {
  ruleKey: string;
  severity: "block" | "warn";
  message: string;
}

/** 발행/발송 전 준법 검증. block 이 하나라도 있으면 발송 불가. */
export function checkNewsletterCompliance(
  nl: Newsletter,
  brand: BrandSetting,
  compliance: ComplianceSetting,
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];
  const rule = (k: string) => compliance.rules.find((r) => r.key === k);
  const on = (k: string) => rule(k)?.enabled ?? false;

  if (on("ad_prefix") && compliance.adPrefixEnabled && nl.adPrefix) {
    // 발송 시 제목 앞에 자동 부착되므로 여기서는 통과. 비활성 시 경고.
  }
  if (on("ad_prefix") && !nl.adPrefix) {
    issues.push({
      ruleKey: "ad_prefix",
      severity: rule("ad_prefix")!.severity,
      message: "광고성 발송인데 제목 앞 (광고) 표기가 꺼져 있습니다. 광고가 아니라면 무시 가능합니다.",
    });
  }

  if (on("opt_out_link")) {
    if (!brand.unsubscribeUrl)
      issues.push({ ruleKey: "opt_out_link", severity: "block", message: "브랜드설정에 '광고 수신거부 URL'이 없습니다." });
    if (!brand.privacyUrl)
      issues.push({ ruleKey: "opt_out_link", severity: "block", message: "브랜드설정에 '개인정보처리방침 URL'이 없습니다." });
  }

  if (on("sender_identity")) {
    if (!brand.officeName)
      issues.push({ ruleKey: "sender_identity", severity: "block", message: "전송자(중개사무소) 명칭이 없습니다." });
    if (!brand.mobile && !brand.phone)
      issues.push({ ruleKey: "sender_identity", severity: "block", message: "전송자 연락처가 없습니다." });
    if (!brand.address)
      issues.push({ ruleKey: "sender_identity", severity: "warn", message: "전송자 주소가 없습니다." });
  }

  if (on("no_unverified_numbers")) {
    const badNumbers = nl.items.filter(
      (it) => it.section === "numbers" && (it.verification === "UNVERIFIED" || !it.sourceUrl || !it.sourceDate),
    );
    for (const it of badNumbers) {
      issues.push({
        ruleKey: "no_unverified_numbers",
        severity: "block",
        message: `'오늘의 숫자' 항목 "${it.headline}" 에 출처 URL 또는 기준일이 없습니다.`,
      });
    }
    const needsCheck = nl.items.filter((it) => it.verification === "NEEDS_CHECK");
    if (needsCheck.length) {
      issues.push({
        ruleKey: "no_unverified_numbers",
        severity: "warn",
        message: `'확인 필요' 상태 항목이 ${needsCheck.length}건 있습니다. 발송 전 출처를 확인하세요. (DEMO DATA 는 기본적으로 확인 필요 상태입니다.)`,
      });
    }
  }

  if (on("policy_status_required")) {
    const policyItems = nl.items.filter((it) => it.section === "policy_top");
    for (const it of policyItems) {
      const status = (it.meta as { status?: string } | undefined)?.status;
      if (!status)
        issues.push({
          ruleKey: "policy_status_required",
          severity: "warn",
          message: `정책 항목 "${it.headline}" 에 상태값(확정/검토 등)이 없습니다.`,
        });
    }
  }

  if (on("explicit_consent")) {
    // 실제 대상 필터는 발송 단계에서 적용됨. 여기서는 안내만.
    issues.push({
      ruleKey: "explicit_consent",
      severity: "warn",
      message: "발송은 consentEmail/consentKakao 동의가 있고 수신거부 목록에 없는 ACTIVE 구독자에게만 전송됩니다.",
    });
  }

  if (compliance.requireApprovalBeforeSend && nl.status !== "APPROVED" && nl.status !== "SCHEDULED" && nl.status !== "SENT") {
    issues.push({
      ruleKey: "approval_required",
      severity: "block",
      message: "관리자 승인 전에는 발송할 수 없습니다. (준법설정: 발송 전 승인 필수)",
    });
  }

  return issues;
}

export function isNightNow(compliance: ComplianceSetting, at = new Date()): boolean {
  if (!compliance.nightAdBlockEnabled) return false;
  const h = at.getHours();
  const { nightAdStartHour: s, nightAdEndHour: e } = compliance;
  return s < e ? h >= s && h < e : h >= s || h < e;
}

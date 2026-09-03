import { Card, SectionTitle, PolicyStatusBadge, VerificationBadge, DemoTag } from "@/components/ui";
import * as data from "@/lib/data";
import { formatDate, resolveSourceUrl } from "@/lib/utils";
import { POLICY_STATUS_LABEL } from "@/types";

export default async function PoliciesPage() {
  const policies = await data.listPolicies();
  const grouped = policies.reduce<Record<string, typeof policies>>((acc, p) => {
    (acc[p.status] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Government">정부정책</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        정부·공공기관 공식자료를 최우선(Tier A)으로 취급합니다. <b>발표일</b>과 <b>시행일</b>, <b>확정/검토</b> 상태를 반드시 구분합니다.
        언론 보도와 정부 발표가 다르면 정부 원문을 우선합니다.
      </p>

      <div className="flex flex-wrap gap-2 text-xs">
        {Object.keys(POLICY_STATUS_LABEL).map((s) => (
          <span key={s} className="chip">
            {POLICY_STATUS_LABEL[s as keyof typeof POLICY_STATUS_LABEL]} · {grouped[s]?.length ?? 0}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {policies.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-navy">{p.title}</span>
                  <PolicyStatusBadge status={p.status} />
                  <VerificationBadge v={p.verification} />
                  <DemoTag />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{p.plainSummary}</p>
                {p.rawExcerpt && (
                  <p className="mt-2 border-l-2 border-[#E3E7EC] pl-3 text-xs italic text-slate-400">
                    원문 인용(사실 확인용): “{p.rawExcerpt}”
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  일반인용 안내: 정확한 적용 여부는 주택 수, 취득시기, 지역, 보유기간 등에 따라 달라질 수 있습니다.
                </p>
              </div>
              <div className="shrink-0 space-y-1 text-right text-xs text-slate-400">
                <div>{p.agency}</div>
                <div>발표일 {formatDate(p.announcedAt)}</div>
                <div>시행일 {p.effectiveAt ? formatDate(p.effectiveAt) : "미정"}</div>
                <a
                  href={resolveSourceUrl(p.officialUrl, `${p.agency} ${p.title}`, "all")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-navy-premium hover:underline"
                >
                  원문·관련보도 보기
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { SectionTitle } from "@/components/ui";
import * as data from "@/lib/data";
import { RepurposeClient } from "./repurpose-client";

export default async function RepurposePage({ searchParams }: { searchParams: { nl?: string } }) {
  const newsletters = (await data.listNewsletters()).map((n) => ({
    id: n.id,
    title: n.title,
    editionLabel: n.editionLabel,
    type: n.type,
  }));

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="One-Source Multi-Use">콘텐츠 변환</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        하나의 EDM 을 네이버 블로그·카카오톡·인스타그램 카드뉴스/캡션·유튜브 쇼츠 대본·네이버 밴드·문자·상담 요약문으로 자동 변환합니다.
      </p>
      {newsletters.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">먼저 EDM 을 만들어 주세요.</div>
      ) : (
        <RepurposeClient newsletters={newsletters} initialId={searchParams.nl} />
      )}
    </div>
  );
}

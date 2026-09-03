import { Card, CardHeader, SectionTitle } from "@/components/ui";
import * as data from "@/lib/data";
import { saveBrandAction } from "@/app/actions";

const FIELDS: { key: string; label: string; ph?: string; wide?: boolean }[] = [
  { key: "officeName", label: "중개사무소 명칭" },
  { key: "brandName", label: "브랜드" },
  { key: "repName", label: "대표자/개업공인중개사 성명", ph: "관리자 입력 필요" },
  { key: "registrationNo", label: "중개사무소 등록번호", ph: "관리자 입력 필요" },
  { key: "phone", label: "전화번호", ph: "관리자 입력 필요" },
  { key: "mobile", label: "휴대전화" },
  { key: "email", label: "이메일", ph: "관리자 입력 필요" },
  { key: "homepage", label: "홈페이지" },
  { key: "naverBlog", label: "네이버 블로그" },
  { key: "naverPlace", label: "네이버 스마트플레이스" },
  { key: "kakaoChannel", label: "카카오톡 채널 URL" },
  { key: "address", label: "주소", wide: true },
  { key: "logoUrl", label: "로고 이미지 URL" },
  { key: "heroPhotoUrl", label: "대표사진 URL" },
  { key: "qrUrl", label: "QR코드 이미지 URL" },
  { key: "reservationUrl", label: "상담예약 URL" },
  { key: "privacyUrl", label: "개인정보처리방침 URL" },
  { key: "unsubscribeUrl", label: "광고 수신거부 URL" },
  { key: "agentDisplayName", label: "공인중개사 표시명 (예: 홍길동 공인중개사)" },
];

export default async function BrandSettingsPage() {
  const brand = await data.getBrand();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Settings">브랜드설정</SectionTitle>
      <p className="-mt-2 text-sm text-slate-500">
        EDM Footer 와 CTA 에 사용됩니다. 아직 입력되지 않은 정보는 임의로 생성하지 않습니다. 정확한 값을 직접 입력하세요.
      </p>

      <form action={saveBrandAction} className="space-y-6">
        <Card>
          <CardHeader title="사무소 · 연락처 · 링크" eyebrow="Brand Info" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs text-slate-500">{f.label}</label>
                <input
                  name={f.key}
                  defaultValue={(brand as unknown as Record<string, string>)[f.key] ?? ""}
                  placeholder={f.ph}
                  className="field"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Hero 문구" eyebrow="Main Message" />
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-xs text-slate-500">메인 카피 (관리자가 언제든 수정 가능)</label>
              <textarea name="heroMainCopy" defaultValue={brand.heroMainCopy} className="field h-24" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">서브 카피</label>
              <textarea name="heroSubCopy" defaultValue={brand.heroSubCopy} className="field h-20" />
            </div>
            <div className="rounded-lg bg-cloud p-3 text-xs text-slate-500">
              서브 카피 대안: “{brand.heroSubCopyAlt}” — 위 입력란에 붙여넣어 교체할 수 있습니다.
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary px-6">저장</button>
        </div>
      </form>
    </div>
  );
}

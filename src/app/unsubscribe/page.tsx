import { unsubscribeByEmail } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { email?: string; done?: string };
}) {
  async function action(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (email) await unsubscribeByEmail(email);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-panel">
        <div className="font-serif text-sm tracking-[0.3em] text-navy">LAND LANGUAGE</div>
        <h1 className="mt-4 text-lg font-bold text-navy">광고성 정보 수신거부</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          수신거부를 신청하시면 즉시 수신거부 목록(Suppression List)에 반영되며, 이후 광고성 메시지를 발송하지 않습니다.
        </p>
        <form action={action} className="mt-5 space-y-3">
          <input
            name="email"
            type="email"
            required
            defaultValue={searchParams.email}
            placeholder="수신거부할 이메일 주소"
            className="field"
          />
          <button type="submit" className="btn btn-primary w-full py-2.5">
            수신거부 신청
          </button>
        </form>
        {searchParams.done && (
          <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
            수신거부가 접수되었습니다.
          </p>
        )}
        <p className="mt-4 text-[11px] text-slate-400">
          개인정보처리방침 및 광고 수신거부 URL 은 브랜드설정에서 지정합니다.
        </p>
      </div>
    </div>
  );
}

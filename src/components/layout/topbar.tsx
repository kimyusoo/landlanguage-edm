import Link from "next/link";
import { providerStatus } from "@/config/env";

export function Topbar() {
  const st = providerStatus();
  const badge = (label: string, val: string) => (
    <span className="hidden items-center gap-1 rounded-md border border-[#E3E7EC] bg-white px-2 py-1 text-[11px] text-slate-500 md:inline-flex">
      {label}
      <b className={val === "MOCK" ? "text-gold-dark" : "text-emerald-600"}>{val}</b>
    </span>
  );
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[#E3E7EC] bg-white/90 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-serif text-xs tracking-[0.2em] text-navy lg:hidden">
          LAND LANGUAGE
        </Link>
        <span className="rounded bg-cloud px-2 py-1 text-[11px] text-slate-500">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {badge("AI", st.ai)}
        {badge("메일", st.email)}
        {badge("카카오", st.kakao)}
        {badge("DB", st.data)}
      </div>
    </header>
  );
}

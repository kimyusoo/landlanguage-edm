import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-[#E3E7EC] bg-white px-6 py-4 text-[11px] text-slate-400">
          LAND LANGUAGE · AI REAL ESTATE BRIEF — 본 화면의 정책·뉴스·수치는 데모 데이터이며 실제 자료로 대체되어야 합니다.
        </footer>
      </div>
    </div>
  );
}

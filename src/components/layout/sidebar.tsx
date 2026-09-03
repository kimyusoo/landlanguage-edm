"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[#E3E7EC] bg-white lg:flex">
      <div className="border-b border-[#E3E7EC] px-5 py-5">
        <div className="font-serif text-sm tracking-[0.3em] text-navy">LAND LANGUAGE</div>
        <div className="mt-0.5 font-serif text-[10px] tracking-[0.25em] text-gold">
          AI REAL ESTATE BRIEF
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);
          const Icon = item.icon;
          return (
            <div key={item.href} className="mb-0.5">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-navy text-white"
                    : "text-slate-600 hover:bg-cloud hover:text-navy",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
              {active && item.children ? (
                <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-[#E3E7EC] pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="py-1 text-xs text-slate-500 hover:text-navy"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-[#E3E7EC] px-5 py-3 text-[10px] leading-relaxed text-slate-400">
        관리자 승인 전 자동발송 비활성(AUTO_SEND=false)
      </div>
    </aside>
  );
}

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Newspaper,
  Landmark,
  BarChart3,
  Mail,
  Repeat,
  Users,
  PhoneCall,
  Send,
  LineChart,
  Database,
  Building2,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string }[];
}

export const NAV: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/news", label: "오늘의 뉴스", icon: Newspaper },
  { href: "/policies", label: "정부정책", icon: Landmark },
  { href: "/statistics", label: "시장통계", icon: BarChart3 },
  {
    href: "/edm",
    label: "EDM 만들기",
    icon: Mail,
    children: [
      { href: "/edm?type=DAILY", label: "Daily" },
      { href: "/edm?type=WEEKLY", label: "Weekly" },
      { href: "/edm?type=MONTHLY", label: "Monthly" },
    ],
  },
  { href: "/repurpose", label: "콘텐츠 변환", icon: Repeat },
  { href: "/subscribers", label: "구독자", icon: Users },
  { href: "/leads", label: "상담고객", icon: PhoneCall },
  { href: "/campaigns", label: "발송관리", icon: Send },
  { href: "/analytics", label: "통계", icon: LineChart },
  { href: "/sources", label: "출처관리", icon: Database },
  { href: "/settings/brand", label: "브랜드설정", icon: Building2 },
  { href: "/settings/compliance", label: "준법설정", icon: ShieldCheck },
  { href: "/settings/system", label: "시스템설정", icon: Settings },
];

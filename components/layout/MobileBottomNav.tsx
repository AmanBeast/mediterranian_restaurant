"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomTab {
  href: string;
  label: string;
  icon: string;
  isPrimary?: boolean;
}

const TABS: BottomTab[] = [
  { href: "/", label: "Home", icon: "restaurant" },
  { href: "/menu", label: "Menu", icon: "menu_book" },
  { href: "/reservation", label: "Reserve", icon: "event_seat", isPrimary: true },
  { href: "/about", label: "Story", icon: "psychiatry" },
  { href: "/contact", label: "Visit", icon: "near_me" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden pb-safe glass-obsidian border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          if (tab.isPrimary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
              >
                <div
                  className={cn(
                    "w-13 h-13 p-3 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xl",
                    isActive
                      ? "bg-[#D47D57] text-white ring-4 ring-[#0C100D] glow-terracotta"
                      : "bg-[#D47D57] hover:bg-[#B25337] text-white ring-4 ring-[#0C100D] shadow-lg"
                  )}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {tab.icon}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold mt-1 tracking-tight transition-colors",
                    isActive ? "text-[#FAB44D]" : "text-[#DED7CB]"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] h-12 transition-all active:scale-95 focus:outline-none",
                isActive
                  ? "text-[#FAB44D] font-semibold"
                  : "text-[#DED7CB]/70 hover:text-[#F3EEE7]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  isActive && "material-symbols-fill"
                )}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

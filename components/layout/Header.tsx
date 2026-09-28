"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Reservations" },
  { href: "/about", label: "Our Story" },
  { href: "/chefs", label: "Chefs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 pt-safe",
          scrolled
            ? "glass-obsidian shadow-2xl py-3"
            : "bg-gradient-to-b from-[#0C100D]/90 via-[#0C100D]/60 to-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB44D] rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-full bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D] shadow-inner group-hover:border-[#FAB44D]/70 transition-colors">
              <span className="material-symbols-outlined text-[20px]">local_florist</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F3EEE7] group-hover:text-[#FAB44D] transition-colors">
                Élaia
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#DED7CB]/70 font-medium -mt-1 hidden xs:block">
                Mediterranean Table
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 glass-obsidian-subtle px-4 py-1.5 rounded-full border border-white/5">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all",
                    isActive
                      ? "bg-[#D47D57] text-[#0C100D] font-semibold shadow-sm"
                      : "text-[#DED7CB] hover:text-[#F3EEE7] hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/reservation"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D47D57] hover:bg-[#B25337] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 glow-terracotta"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Reserve Table</span>
            </Link>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg glass-obsidian flex items-center justify-center text-[#F3EEE7] hover:text-[#FAB44D] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB44D]"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-[#0C100D] border-l border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FAB44D] text-[22px]">
                local_florist
              </span>
              <span className="font-serif text-xl font-bold text-[#F3EEE7]">Élaia</span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-lg glass-obsidian flex items-center justify-center text-[#DED7CB]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 py-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-[#D47D57]/20 text-[#FAB44D] font-semibold border-l-2 border-[#D47D57]"
                      : "text-[#DED7CB] hover:bg-white/5 hover:text-[#F3EEE7]"
                  )}
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[16px] opacity-40">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
          <Link
            href="/reservation"
            className="w-full h-11 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Reserve a Table</span>
          </Link>

          <div className="text-center">
            <p className="text-xs text-[#DED7CB]/60">Marina Promenade, Waterfront</p>
            <a
              href="tel:+18005553524"
              className="text-xs text-[#FAB44D] hover:underline font-mono mt-0.5 inline-block"
            >
              +1 (800) 555-3524
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#070A08] border-t border-white/10 pt-16 pb-28 lg:pb-16 text-[#DED7CB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand & Provenance */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D]">
                <span className="material-symbols-outlined text-[18px]">local_florist</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F3EEE7]">
                Élaia
              </span>
            </div>
            <p className="text-sm text-[#DED7CB]/80 leading-relaxed font-light">
              Slow-crafted Mediterranean coastal dining and late-night botanical mixology. Rooted in family olive groves and wood-fired stone hearth traditions.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#FAB44D]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg glass-obsidian flex items-center justify-center hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg glass-obsidian flex items-center justify-center hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
              <a
                href="mailto:reservations@elaia-table.com"
                aria-label="Email"
                className="w-9 h-9 rounded-lg glass-obsidian flex items-center justify-center hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold text-[#F3EEE7] tracking-wide">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-[#DED7CB]/75">
              <li>
                <Link href="/" className="hover:text-[#FAB44D] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#FAB44D] transition-colors">
                  Curated Menu
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="hover:text-[#FAB44D] transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAB44D] transition-colors">
                  Our Provenance & Story
                </Link>
              </li>
              <li>
                <Link href="/chefs" className="hover:text-[#FAB44D] transition-colors">
                  Culinary Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FAB44D] transition-colors">
                  Atmosphere Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#FAB44D] transition-colors">
                  The Gastronomy Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours of Hospitality */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold text-[#F3EEE7] tracking-wide">
              Hours of Hospitality
            </h3>
            <div className="flex flex-col gap-2 text-sm text-[#DED7CB]/80">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Mon – Wed</span>
                <span className="font-mono text-xs text-[#F3EEE7]">11:30 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Thursday</span>
                <span className="font-mono text-xs text-[#F3EEE7]">11:30 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Fri – Sat</span>
                <span className="font-mono text-xs text-[#FAB44D]">11:00 AM – 11:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-mono text-xs text-[#F3EEE7]">11:00 AM – 10:00 PM</span>
              </div>
            </div>
            <p className="text-xs text-[#DED7CB]/50 mt-2">
              Late-night craft cocktails and mezze served until 30 minutes before closing.
            </p>
          </div>

          {/* Location & Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold text-[#F3EEE7] tracking-wide">
              Location & Contact
            </h3>
            <p className="text-sm text-[#DED7CB]/80 leading-relaxed">
              428 Coastal Vista Way
              <br />
              Marina Promenade, Waterfront District
            </p>
            <div className="flex flex-col gap-1.5 text-sm pt-1">
              <a
                href="tel:+18005553524"
                className="font-mono text-[#FAB44D] hover:underline flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                +1 (800) 555-3524
              </a>
              <a
                href="mailto:reservations@elaia-table.com"
                className="text-xs text-[#DED7CB]/70 hover:text-white flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">email</span>
                reservations@elaia-table.com
              </a>
            </div>
            <Link
              href="/reservation"
              className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#18221B] hover:bg-[#2D4231] border border-[#FAB44D]/30 text-xs font-semibold text-[#FAB44D] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              Find on Google Maps
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DED7CB]/50">
          <p>© {new Date().getFullYear()} Élaia Mediterranean Table. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact & Inquiries
            </Link>
            <Link href="/admin" className="hover:text-[#FAB44D] text-[#DED7CB]/60 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

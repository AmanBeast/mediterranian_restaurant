import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Staff & Management Portal Login",
  description: "Secure login for Élaia restaurant staff and administrators.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C100D] text-[#F3EEE7]">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D]">
              <span className="material-symbols-outlined text-[22px]">local_florist</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#F3EEE7]">
              Élaia
            </span>
          </Link>
          <h1 className="font-serif text-xl font-bold text-[#F3EEE7]">Staff Portal</h1>
          <p className="text-xs text-[#DED7CB]/70 mt-1">
            Access table reservations, menu controls & restaurant settings
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

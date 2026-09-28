"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/actions/auth";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl text-xs font-medium bg-red-950/70 border border-red-500/40 text-red-200"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="admin@elaia-table.com"
          placeholder="admin@elaia-table.com"
          className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          defaultValue="ElaiaAdmin2024!"
          placeholder="••••••••••••"
          className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 mt-2 bg-[#D47D57] hover:bg-[#B25337] disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta transition-all shadow-md active:scale-95"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <span>Enter Portal</span>
        )}
      </button>

      <div className="mt-4 p-3 rounded-xl bg-[#0C100D] border border-white/5 text-[11px] text-[#DED7CB]/60 space-y-1">
        <p className="font-semibold text-[#FAB44D]">Default Seed Credentials:</p>
        <p>• Admin: <code>admin@elaia-table.com</code> / <code>ElaiaAdmin2024!</code></p>
        <p>• Staff: <code>staff@elaia-table.com</code> / <code>ElaiaStaff2024!</code></p>
      </div>
    </form>
  );
}

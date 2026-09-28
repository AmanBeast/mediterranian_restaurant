"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/actions/contact";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-medium leading-relaxed border ${
            state.success
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border-red-500/40 text-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
        >
          Your Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-describedby={state.errors?.name ? "name-error" : undefined}
          placeholder="e.g. Callista Vance"
          className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D] transition-colors"
        />
        {state.errors?.name && (
          <p id="name-error" className="text-[11px] text-red-400 mt-1">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      {/* Email & Phone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
          >
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            placeholder="callista@example.com"
            className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D] transition-colors"
          />
          {state.errors?.email && (
            <p id="email-error" className="text-[11px] text-red-400 mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
          >
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D] transition-colors"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
        >
          Inquiry Subject *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          aria-describedby={state.errors?.subject ? "subject-error" : undefined}
          placeholder="e.g. Private Dining, Cellar Tour, or Event Inquiries"
          className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D] transition-colors"
        />
        {state.errors?.subject && (
          <p id="subject-error" className="text-[11px] text-red-400 mt-1">
            {state.errors.subject[0]}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1.5"
        >
          Message Details *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          placeholder="How may our hospitality team assist your visit to Élaia?"
          className="w-full p-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D] transition-colors resize-none"
        />
        {state.errors?.message && (
          <p id="message-error" className="text-[11px] text-red-400 mt-1">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-[#D47D57] hover:bg-[#B25337] disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta transition-all shadow-md active:scale-95"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Send Message to Élaia</span>
          </>
        )}
      </button>
    </form>
  );
}

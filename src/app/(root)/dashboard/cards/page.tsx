"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";

export default function CardsPage() {
  const { user } = useDashboard();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied]     = useState("");

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const card = user?.virtualCard;
  const mask = (n: string) => n ? `•••• •••• •••• ${n.split(" ")[3]}` : "•••• •••• •••• ••••";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all">←</Link>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Fortress Bank</p>
          <h1 className="text-2xl font-black tracking-tight">Virtual Card</h1>
        </div>
      </div>

      {/* Card visual */}
      <div className="relative">
        <div className="relative h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 p-7 cursor-pointer select-none"
          onClick={() => setRevealed(v => !v)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,133,0.15)_0%,_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,255,133,0.04)_0%,_transparent_55%)]" />
          {/* Chip */}
          <div className="absolute top-7 left-7 h-8 w-10 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
          {/* Mastercard */}
          <div className="absolute top-7 right-7 flex">
            <div className="h-8 w-8 bg-red-500 rounded-full opacity-90" />
            <div className="h-8 w-8 bg-yellow-400 rounded-full opacity-90 -ml-3" />
          </div>
          {/* Card details */}
          <div className="absolute bottom-7 left-7 right-7 space-y-3">
            <p className="text-white font-mono text-xl font-black tracking-[0.15em]">
              {revealed ? (card?.cardNumber || "•••• •••• •••• ••••") : mask(card?.cardNumber)}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
                <p className="text-white font-black text-sm tracking-wider">{card?.cardHolder}</p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                <p className="text-white font-black text-sm">{revealed ? card?.expiry : "••/••"}</p>
              </div>
            </div>
          </div>
          {!revealed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <p className="text-white text-xs font-bold uppercase tracking-widest">👁 Tap to Reveal</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D0E11] border border-[#00FF85]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF85] animate-pulse" />
            <span className="text-[#00FF85] text-[10px] font-black uppercase tracking-widest">{card?.status || "ACTIVE"}</span>
          </div>
        </div>
      </div>

      {/* Card details */}
      <div className="pt-4 space-y-3">
        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Card Details</p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Card Number</p>
            <p className="text-white font-mono font-bold">{revealed ? card?.cardNumber : mask(card?.cardNumber)}</p>
          </div>
          {revealed && (
            <button onClick={() => copy(card?.cardNumber?.replace(/\s/g, ""), "num")}
              className={`h-8 px-3 rounded-lg text-xs font-black uppercase transition-all ${copied === "num" ? "bg-[#00FF85] text-black" : "bg-white/[0.06] border border-white/10 text-white/50 hover:text-white"}`}>
              {copied === "num" ? "Copied ✓" : "Copy"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Expiry",   val: revealed ? card?.expiry : "••/••", key: "exp", copyVal: card?.expiry },
            { label: "CVV",      val: revealed ? card?.cvv    : "•••",   key: "cvv", copyVal: card?.cvv },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-white font-mono font-bold">{item.val}</p>
              </div>
              {revealed && (
                <button onClick={() => copy(item.copyVal, item.key)}
                  className={`h-8 px-2.5 rounded-lg text-xs font-black uppercase transition-all ${copied === item.key ? "bg-[#00FF85] text-black" : "bg-white/[0.06] border border-white/10 text-white/50 hover:text-white"}`}>
                  {copied === item.key ? "✓" : "Copy"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Card Type</p>
          <p className="text-white font-bold">{card?.type || "VISA DEBIT"}</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-5 rounded-2xl bg-yellow-500/[0.05] border border-yellow-500/20 space-y-2">
        <p className="text-yellow-400 text-[11px] font-black uppercase tracking-widest">🔐 Security Notice</p>
        <p className="text-white/35 text-xs leading-relaxed">Never share your card details with anyone. Fortress Bank staff will never ask for your CVV or full card number.</p>
      </div>

      <button onClick={() => setRevealed(v => !v)}
        className={`w-full h-[52px] rounded-[10px] font-black text-sm uppercase tracking-widest transition-all ${revealed ? "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20" : "bg-[#00FF85] text-black hover:bg-[#1AFF94]"}`}>
        {revealed ? "🙈 Hide Card Details" : "👁 Reveal Card Details"}
      </button>
    </div>
  );
}

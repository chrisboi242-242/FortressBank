"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";
import { SUPPORTED_CURRENCIES } from "@/constants";

export default function ReceivePage() {
  const { user } = useDashboard();
  const [copied, setCopied] = useState("");

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all">←</Link>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Fortress Bank</p>
          <h1 className="text-2xl font-black tracking-tight">Receive Money</h1>
        </div>
      </div>

      {/* Account card */}
      <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] overflow-hidden text-center space-y-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,133,0.06)_0%,_transparent_60%)]" />
        <div className="relative z-10 space-y-5">
          <div className="h-20 w-20 rounded-full bg-[#00FF85]/10 border-2 border-[#00FF85]/30 flex items-center justify-center mx-auto">
            <span className="text-[#00FF85] font-black text-2xl">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          </div>
          <div>
            <h2 className="text-white font-black text-2xl">{user?.firstName} {user?.lastName}</h2>
            <p className="text-white/30 text-sm mt-1">Fortress Bank Member</p>
          </div>
          <div className="space-y-2">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Account Number</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-white font-mono text-xl font-black tracking-wider">{user?.accountNumber}</p>
              <button onClick={() => copy(user?.accountNumber, "acc")}
                className={`h-8 px-3 rounded-lg text-xs font-black uppercase transition-all ${copied === "acc" ? "bg-[#00FF85] text-black" : "bg-white/[0.06] border border-white/10 text-white/50 hover:text-white"}`}>
                {copied === "acc" ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
          <div className="h-px bg-white/[0.06]" />
          <p className="text-white/35 text-sm leading-relaxed">Share your account number to receive money directly into your Fortress vault.</p>
          <button onClick={() => copy(`Send money to my Fortress Bank account:\nName: ${user?.firstName} ${user?.lastName}\nAccount: ${user?.accountNumber}`, "share")}
            className={`w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${copied === "share" ? "bg-[#00FF85] text-black" : "bg-white/[0.04] border border-white/10 text-white hover:border-white/20"}`}>
            {copied === "share" ? "Copied ✓" : "📋 Copy Payment Details"}
          </button>
        </div>
      </div>

      {/* Wallets */}
      <div className="space-y-3">
        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Your Wallets</p>
        {SUPPORTED_CURRENCIES.map(c => (
          <div key={c.code} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center font-black text-white">{c.symbol}</div>
              <div>
                <p className="text-white font-bold text-sm">{c.label}</p>
                <p className="text-white/30 text-xs">{c.code} Wallet</p>
              </div>
            </div>
            <p className="text-white font-black">{c.symbol}{(user?.balances?.[c.code] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <p className="text-white font-black text-sm uppercase tracking-widest">How to Receive</p>
        {["Share your Fortress account number with the sender", "They enter it in the Send Money page", "Balance updates after admin confirmation"].map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#00FF85] text-[9px] font-black">{i + 1}</span>
            </div>
            <p className="text-white/40 text-sm">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

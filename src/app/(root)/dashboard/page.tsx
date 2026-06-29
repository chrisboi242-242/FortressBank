"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";
import { apiGetMyTransactions } from "@/lib/api";
import { SUPPORTED_CURRENCIES } from "@/constants";

export default function DashboardPage() {
  const { user } = useDashboard();
  const [txns, setTxns]             = useState<any[]>([]);
  const [loadingTxns, setLoading]   = useState(true);
  const [balanceVisible, setBV]     = useState(true);
  const [activeCurrency, setAC]     = useState("USD");

  useEffect(() => {
    if (!user) return;
    apiGetMyTransactions()
      .then(d => setTxns((d.transactions || []).slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
            {user?.firstName} <span className="text-[#00FF85]">{user?.lastName}</span>
          </h1>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${user?.status === "ACTIVE" ? "border-[#00FF85]/30 bg-[#00FF85]/10 text-[#00FF85]" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}`}>
          <span className={`h-2 w-2 rounded-full animate-pulse ${user?.status === "ACTIVE" ? "bg-[#00FF85]" : "bg-yellow-400"}`} />
          {user?.status === "ACTIVE" ? "Vault Active" : "Pending Verification"}
        </div>
      </div>

      {/* Currency balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUPPORTED_CURRENCIES.map(c => (
          <button key={c.code} onClick={() => setAC(c.code)}
            className={`p-5 rounded-2xl border text-left transition-all ${activeCurrency === c.code ? "border-[#00FF85] bg-[#00FF85]/[0.06]" : "border-white/[0.06] bg-white/[0.03] hover:border-white/15"}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white/35 text-[10px] font-black uppercase tracking-widest">{c.label}</p>
                <p className="text-white/25 text-xs mt-0.5">{c.code} Wallet</p>
              </div>
              <span className={`text-xl font-black ${activeCurrency === c.code ? "text-[#00FF85]" : "text-white/20"}`}>{c.symbol}</span>
            </div>
            <p className="text-3xl font-black tracking-tight">
              {balanceVisible
                ? `${c.symbol}${(user?.balances?.[c.code] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "••••••"}
            </p>
            {activeCurrency === c.code && (
              <p className="text-[#00FF85] text-[10px] font-bold uppercase tracking-widest mt-2">Active Wallet</p>
            )}
          </button>
        ))}
      </div>

      {/* Virtual card + quick actions */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Card */}
        <div className="relative h-52 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/[0.07] p-6 cursor-pointer group"
          onClick={() => setBV(v => !v)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,133,0.1)_0%,_transparent_60%)]" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Fortress Virtual Debit</p>
                <p className="text-white font-black text-lg mt-1">{user?.firstName} {user?.lastName}</p>
              </div>
              <div className="flex">
                <div className="h-8 w-8 bg-red-500 rounded-full opacity-90" />
                <div className="h-8 w-8 bg-yellow-400 rounded-full opacity-90 -ml-3" />
              </div>
            </div>
            <div>
              <p className="text-white font-mono text-base tracking-[0.2em]">
                {balanceVisible ? user?.accountNumber : "•••• •••• •••• " + (user?.accountNumber?.slice(-4) || "••••")}
              </p>
              <p className="text-white/25 text-[10px] mt-1.5 uppercase tracking-widest">
                Tap to {balanceVisible ? "hide" : "reveal"} details
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "→", label: "Send Money",    href: "/dashboard/transfers",    color: "text-[#00FF85]" },
            { icon: "↓", label: "Receive",       href: "/dashboard/receive",      color: "text-blue-400" },
            { icon: "📋", label: "Transactions", href: "/dashboard/transactions", color: "text-purple-400" },
            { icon: "💳", label: "Cards",        href: "/dashboard/cards",        color: "text-yellow-400" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all group active:scale-95">
              <span className={`text-3xl font-black ${a.color} group-hover:scale-110 transition-transform`}>{a.icon}</span>
              <span className="text-white text-sm font-bold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Account Number", value: user?.accountNumber || "Generating..." },
          { label: "Account Status", value: user?.status || "PENDING" },
          { label: "Member Since",   value: user?.createdAt ? fmtDate(user.createdAt) : "—" },
        ].map(info => (
          <div key={info.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{info.label}</p>
            <p className="text-white font-bold text-sm">{info.value}</p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
          <h2 className="text-white font-black text-lg">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-[#00FF85] text-xs font-bold uppercase tracking-widest hover:underline">See All →</Link>
        </div>
        {loadingTxns ? (
          <div className="py-14 flex justify-center">
            <div className="h-7 w-7 border-2 border-white/10 border-t-[#00FF85] rounded-full animate-spin" />
          </div>
        ) : txns.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-4xl mb-3">🏦</p>
            <p className="text-white/40 font-bold">No transactions yet.</p>
            <p className="text-white/25 text-sm mt-1">Your vault activity will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {txns.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center font-black text-sm ${tx.direction === "RECEIVED" ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-red-500/10 text-red-400"}`}>
                    {tx.direction === "RECEIVED" ? "↓" : "→"}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{tx.direction === "RECEIVED" ? "Received" : "Sent"} — {tx.note || tx.type}</p>
                    <p className="text-white/30 text-xs">{fmtDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${tx.direction === "RECEIVED" ? "text-[#00FF85]" : "text-red-400"}`}>
                    {tx.direction === "RECEIVED" ? "+" : "-"}{sym[tx.currency] || "$"}{Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`text-[10px] font-bold uppercase ${tx.status === "COMPLETED" ? "text-[#00FF85]" : tx.status === "PENDING" ? "text-yellow-400" : "text-red-400"}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

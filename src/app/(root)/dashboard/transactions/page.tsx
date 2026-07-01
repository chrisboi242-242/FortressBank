"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";
import { apiGetMyTransactions } from "@/lib/api";

export default function TransactionsPage() {
  const { user } = useDashboard();
  const [txns, setTxns]    = useState<any[]>([]);
  const [filtered, setFilt] = useState<any[]>([]);
  const [loading, setLoad]  = useState(true);
  const [dir, setDir]       = useState("ALL");
  const [cur, setCur]       = useState("ALL");
  const [sta, setSta]       = useState("ALL");

  useEffect(() => {
    if (!user) return;
    apiGetMyTransactions()
      .then(d => { setTxns(d.transactions || []); setFilt(d.transactions || []); })
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [user]);

  useEffect(() => {
    let r = [...txns];
    if (dir !== "ALL") r = r.filter(t => t.direction === dir);
    if (cur !== "ALL") r = r.filter(t => t.currency === cur);
    if (sta !== "ALL") r = r.filter(t => t.status === sta);
    setFilt(r);
  }, [dir, cur, sta, txns]);

  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // Only count real sent transfers (not admin deposits mislabeled as sent)
  const totalSent     = txns.filter(t => t.direction === "SENT").reduce((s, t) => s + Number(t.amount), 0);
  const totalReceived = txns.filter(t => t.direction === "RECEIVED").reduce((s, t) => s + Number(t.amount), 0);
  const pendingCount  = txns.filter(t => t.status === "PENDING").length;

  const FilterGroup = ({
    label, opts, value, set,
  }: {
    label: string; opts: string[]; value: string; set: (v: string) => void;
  }) => (
    <div className="space-y-1">
      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {opts.map(o => (
          <button key={o} onClick={() => set(o)}
            className={`px-3.5 h-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              value === o
                ? "bg-[#00FF85] text-black"
                : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:border-white/20"
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard"
          className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all">
          ←
        </Link>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Fortress Bank</p>
          <h1 className="text-2xl font-black tracking-tight">Transaction History</h1>
        </div>
      </div>

      {/* Summary cards
          FIX: changed from grid-cols-3 (fixed 3 columns regardless of content width)
          to grid-cols-1 sm:grid-cols-3. On mobile the cards stack vertically so large
          numbers like $803,000.00 each get their own full-width row and never overflow
          into adjacent cards. On tablet/desktop they return to a 3-column layout where
          there is enough horizontal space to show large numbers cleanly side by side. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Sent",
            value: `$${totalSent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            color: "text-red-400",
            sub: `${txns.filter(t => t.direction === "SENT").length} transfer(s)`,
          },
          {
            label: "Total Received",
            value: `$${totalReceived.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            color: "text-[#00FF85]",
            sub: `${txns.filter(t => t.direction === "RECEIVED").length} deposit(s)`,
          },
          {
            label: "Pending",
            value: String(pendingCount),
            color: "text-yellow-400",
            sub: "Awaiting processing",
          },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">
              {s.label}
            </p>
            {/* Break long numbers onto new line rather than overflowing */}
            <p className={`font-black text-2xl break-all ${s.color}`}>{s.value}</p>
            <p className="text-white/20 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-5">
        <FilterGroup label="Type"     opts={["ALL","SENT","RECEIVED"]}              value={dir} set={setDir} />
        <FilterGroup label="Currency" opts={["ALL","USD","EUR","GBP"]}              value={cur} set={setCur} />
        <FilterGroup label="Status"   opts={["ALL","PENDING","COMPLETED","FAILED"]} value={sta} set={setSta} />
      </div>

      <p className="text-white/25 text-xs font-bold uppercase tracking-widest">
        Showing {filtered.length} of {txns.length} transaction(s)
      </p>

      {/* Transaction list */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="h-8 w-8 border-2 border-white/10 border-t-[#00FF85] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-white/40 font-bold">No transactions found.</p>
            <p className="text-white/25 text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((tx: any) => (
              <div key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-base shrink-0 ${
                    tx.direction === "RECEIVED"
                      ? "bg-[#00FF85]/10 text-[#00FF85]"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {tx.direction === "RECEIVED" ? "↓" : "→"}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {tx.direction === "RECEIVED" ? "Received" : "Sent"} — {tx.note || tx.type}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{fmtDate(tx.createdAt)}</p>
                    <p className="text-white/20 text-[10px] mt-0.5 font-mono">
                      {tx.direction === "SENT"
                        ? `To: ${tx.recipientAccount}`
                        : `From: ${tx.senderAccountNumber === "FORTRESS-ADMIN" ? "Fortress Admin" : "Fortress Transfer"}`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-black text-sm ${
                    tx.direction === "RECEIVED" ? "text-[#00FF85]" : "text-red-400"
                  }`}>
                    {tx.direction === "RECEIVED" ? "+" : "-"}
                    {sym[tx.currency] || "$"}
                    {Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5">{tx.currency}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    tx.status === "COMPLETED"
                      ? "bg-[#00FF85]/10 text-[#00FF85]"
                      : tx.status === "PENDING"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
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
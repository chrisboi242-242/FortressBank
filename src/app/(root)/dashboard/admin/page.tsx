"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";
import {
  apiGetAllUsers, apiGetAllTransactions,
  apiUpdateUserStatus, apiCreditBalance,
  apiUpdateTxStatus, apiPostMessage, apiDeactivateMessage,
  apiGetMessages,
} from "@/lib/api";

type Tab = "users" | "transactions" | "messages";

export default function AdminPage() {
  const { user } = useDashboard();
  const [tab, setTab]           = useState<Tab>("users");
  const [users, setUsers]       = useState<any[]>([]);
  const [txns, setTxns]         = useState<any[]>([]);
  const [msgs, setMsgs]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [feedback, setFeedback] = useState("");

  // Credit modal
  const [creditModal, setCreditModal] = useState<any>(null);
  const [creditForm, setCreditForm]   = useState({ currency: "USD", amount: "", note: "" });

  // Message form
  const [msgForm, setMsgForm] = useState({ message: "", type: "info" });

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") window.location.href = "/dashboard";
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, t, m] = await Promise.all([
        apiGetAllUsers(),
        apiGetAllTransactions(),
        apiGetMessages(),
      ]);
      setUsers(u.users || []);
      setTxns(t.transactions || []);
      setMsgs(m.messages || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const toast = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(""), 3000); };

  const handleStatusChange = async (userId: string, status: string) => {
    try { await apiUpdateUserStatus(userId, status); toast("Status updated."); loadAll(); }
    catch (err: any) { toast(err.message); }
  };

  const handleCredit = async () => {
    if (!creditModal || !creditForm.amount) return;
    try {
      await apiCreditBalance(creditModal.userId, {
        currency: creditForm.currency,
        amount: Number(creditForm.amount),
        note: creditForm.note || "Admin Deposit",
      });
      toast(`${creditForm.currency} ${creditForm.amount} credited to ${creditModal.firstName}.`);
      setCreditModal(null);
      setCreditForm({ currency: "USD", amount: "", note: "" });
      loadAll();
    } catch (err: any) { toast(err.message); }
  };

  const handleTxStatus = async (txId: string, status: string) => {
    try { await apiUpdateTxStatus(txId, status); toast(`Transaction marked ${status}.`); loadAll(); }
    catch (err: any) { toast(err.message); }
  };

  const handlePostMsg = async () => {
    if (!msgForm.message) return;
    try { await apiPostMessage(msgForm.message, msgForm.type); toast("Message posted."); setMsgForm({ message: "", type: "info" }); loadAll(); }
    catch (err: any) { toast(err.message); }
  };

  const handleDeactivateMsg = async (id: string) => {
    try { await apiDeactivateMessage(id); toast("Message deactivated."); loadAll(); }
    catch (err: any) { toast(err.message); }
  };

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };

  if (user?.role !== "admin") return null;

  const inputCls = "w-full h-[48px] px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white text-[14px] placeholder:text-white/20 transition-all";

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Fortress Bank</p>
          <h1 className="text-2xl font-black tracking-tight">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-300 text-[10px] font-black uppercase tracking-widest">Admin Access</span>
        </div>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="px-4 py-3 bg-[#00FF85]/10 border border-[#00FF85]/30 rounded-[10px] text-[#00FF85] text-sm font-bold">
          {feedback}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users",    value: users.length,                                              color: "text-white" },
          { label: "Active Vaults",  value: users.filter(u => u.status === "ACTIVE").length,           color: "text-[#00FF85]" },
          { label: "Pending",        value: users.filter(u => u.status === "PENDING_VERIFICATION").length, color: "text-yellow-400" },
          { label: "Transactions",   value: txns.length,                                               color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06] pb-0">
        {(["users", "transactions", "messages"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-[13px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${tab === t ? "border-[#00FF85] text-[#00FF85]" : "border-transparent text-white/30 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === "users" && (
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="h-8 w-8 border-2 border-white/10 border-t-[#00FF85] rounded-full animate-spin" /></div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-white/30">No users found.</div>
          ) : (
            users.map((u: any) => (
              <div key={u.userId} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#00FF85] font-black text-sm">{u.firstName?.[0]}{u.lastName?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-black">{u.firstName} {u.lastName}</p>
                      <p className="text-white/30 text-xs">{u.email}</p>
                      <p className="text-white/20 text-[10px] font-mono mt-0.5">{u.accountNumber}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === "ACTIVE" ? "bg-[#00FF85]/10 text-[#00FF85]" : u.status === "SUSPENDED" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {u.status}
                    </span>
                    <p className="text-white/20 text-[10px] mt-1">{fmtDate(u.createdAt)}</p>
                  </div>
                </div>

                {/* Balances */}
                <div className="flex gap-3">
                  {["USD","EUR","GBP"].map(c => (
                    <div key={c} className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                      <p className="text-white/25 text-[9px] uppercase tracking-widest">{c}</p>
                      <p className="text-white font-black text-sm">{sym[c]}{(u.balances?.[c] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCreditModal(u)}
                    className="px-4 h-8 rounded-lg bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] text-xs font-black hover:bg-[#00FF85]/20 transition-all">
                    + Credit Balance
                  </button>
                  {u.status !== "ACTIVE" && (
                    <button onClick={() => handleStatusChange(u.userId, "ACTIVE")}
                      className="px-4 h-8 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-black hover:border-[#00FF85]/30 transition-all">
                      Activate
                    </button>
                  )}
                  {u.status !== "SUSPENDED" && (
                    <button onClick={() => handleStatusChange(u.userId, "SUSPENDED")}
                      className="px-4 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all">
                      Suspend
                    </button>
                  )}
                  {u.status !== "PENDING_VERIFICATION" && (
                    <button onClick={() => handleStatusChange(u.userId, "PENDING_VERIFICATION")}
                      className="px-4 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-black hover:bg-yellow-500/20 transition-all">
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TRANSACTIONS TAB ── */}
      {tab === "transactions" && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><div className="h-8 w-8 border-2 border-white/10 border-t-[#00FF85] rounded-full animate-spin" /></div>
          ) : txns.length === 0 ? (
            <div className="py-16 text-center text-white/30">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {txns.map((tx: any) => (
                <div key={tx.transactionId} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{tx.note || tx.type}</p>
                    <p className="text-white/30 text-xs mt-0.5 font-mono">
                      {tx.senderAccountNumber} → {tx.recipientAccount}
                    </p>
                    <p className="text-white/20 text-[10px] mt-0.5">{fmtDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-black">{sym[tx.currency] || "$"}{Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {tx.currency}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tx.status === "COMPLETED" ? "bg-[#00FF85]/10 text-[#00FF85]" : tx.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                      {tx.status}
                    </span>
                  </div>
                  {tx.status === "PENDING" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleTxStatus(tx.transactionId, "COMPLETED")}
                        className="px-3 h-8 rounded-lg bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] text-xs font-black hover:bg-[#00FF85]/20 transition-all">
                        Complete
                      </button>
                      <button onClick={() => handleTxStatus(tx.transactionId, "FAILED")}
                        className="px-3 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all">
                        Fail
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MESSAGES TAB ── */}
      {tab === "messages" && (
        <div className="space-y-6">

          {/* Post new message */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
            <p className="text-white font-black uppercase tracking-widest text-sm">Post New Message</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input value={msgForm.message} onChange={e => setMsgForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Message to show on all user dashboards..."
                  className={inputCls} />
              </div>
              <select value={msgForm.type} onChange={e => setMsgForm(p => ({ ...p, type: e.target.value }))}
                className={inputCls}>
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="success">✅ Success</option>
                <option value="error">🚨 Error</option>
              </select>
            </div>
            <button onClick={handlePostMsg} disabled={!msgForm.message}
              className="h-[48px] px-8 bg-[#00FF85] text-black rounded-[10px] font-black text-sm hover:bg-[#1AFF94] transition-all disabled:opacity-40">
              Post Message
            </button>
          </div>

          {/* Active messages */}
          <div className="space-y-3">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Active Messages</p>
            {msgs.filter(m => m.active).length === 0
              ? <p className="text-white/25 text-sm py-6 text-center">No active messages.</p>
              : msgs.filter(m => m.active).map((m: any) => (
                <div key={m.id} className="flex items-start justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] gap-4">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-2 ${
                      m.type === "info" ? "bg-blue-500/10 text-blue-300" :
                      m.type === "warning" ? "bg-yellow-500/10 text-yellow-300" :
                      m.type === "success" ? "bg-[#00FF85]/10 text-[#00FF85]" :
                      "bg-red-500/10 text-red-300"
                    }`}>{m.type}</span>
                    <p className="text-white text-sm">{m.message}</p>
                    <p className="text-white/25 text-xs mt-1">{fmtDate(m.createdAt)}</p>
                  </div>
                  <button onClick={() => handleDeactivateMsg(m.id)}
                    className="px-3 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all shrink-0">
                    Deactivate
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Credit modal */}
      {creditModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setCreditModal(null)}>
          <div className="w-full max-w-sm bg-[#0D0E11] border border-white/10 rounded-2xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-lg">Credit Balance</h2>
              <button onClick={() => setCreditModal(null)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <p className="text-white font-bold">{creditModal.firstName} {creditModal.lastName}</p>
              <p className="text-white/30 text-xs font-mono">{creditModal.accountNumber}</p>
            </div>
            <div className="space-y-3">
              <select value={creditForm.currency} onChange={e => setCreditForm(p => ({ ...p, currency: e.target.value }))}
                className={inputCls}>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input type="number" value={creditForm.amount} onChange={e => setCreditForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="Amount to credit" min="0.01" step="0.01" className={inputCls} />
              <input value={creditForm.note} onChange={e => setCreditForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Note (optional)" className={inputCls} />
            </div>
            <button onClick={handleCredit} disabled={!creditForm.amount}
              className="w-full h-[52px] bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] transition-all disabled:opacity-40">
              Credit {creditForm.currency} {creditForm.amount || "0.00"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

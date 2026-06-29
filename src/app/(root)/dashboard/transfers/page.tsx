"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/shared/DashboardShell";
import { apiCreateTransfer, apiLookupAccount } from "@/lib/api";
import { SUPPORTED_CURRENCIES } from "@/constants";

export default function TransfersPage() {
  const { user, refreshUser } = useDashboard();
  const [form, setForm]         = useState({ recipientAccount: "", amount: "", currency: "USD", note: "" });
  const [recipient, setRecip]   = useState<any>(null);
  const [lookingUp, setLookUp]  = useState(false);
  const [lookupErr, setLookErr] = useState("");
  const [submitting, setSub]    = useState(false);
  const [success, setSuccess]   = useState<any>(null);
  const [error, setError]       = useState("");

  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };

  const handleAccountInput = async (value: string) => {
    setForm(p => ({ ...p, recipientAccount: value }));
    setRecip(null); setLookErr("");
    const clean = value.replace(/\s/g, "");
    if (clean.length !== 16) return;
    if (value === user?.accountNumber) { setLookErr("Cannot transfer to your own account."); return; }
    setLookUp(true);
    try {
      const { user: found } = await apiLookupAccount(value);
      setRecip(found); setLookErr("");
    } catch { setLookErr("Account not found in the Fortress."); }
    finally { setLookUp(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "recipientAccount") handleAccountInput(value);
    else setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!recipient)             { setError("Enter a valid recipient account."); return; }
    if (Number(form.amount) <= 0) { setError("Enter a valid amount."); return; }
    const bal = user?.balances?.[form.currency] || 0;
    if (Number(form.amount) > bal) {
      setError(`Insufficient ${form.currency}. Available: ${sym[form.currency]}${bal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`);
      return;
    }
    setSub(true);
    try {
      const result = await apiCreateTransfer({
        recipientAccount: form.recipientAccount,
        amount:   Number(form.amount),
        currency: form.currency,
        note:     form.note || "Fortress Transfer",
      });
      setSuccess({ ...result, recipient, amount: form.amount, currency: form.currency });
      setForm({ recipientAccount: "", amount: "", currency: "USD", note: "" });
      setRecip(null);
      await refreshUser();
    } catch (err: any) { setError(err.message || "Transfer failed."); }
    finally { setSub(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all">←</Link>
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Fortress Bank</p>
          <h1 className="text-2xl font-black tracking-tight">Send Money</h1>
        </div>
      </div>

      {/* Balance strip */}
      <div className="grid grid-cols-3 gap-3">
        {SUPPORTED_CURRENCIES.map(c => (
          <div key={c.code} className={`p-4 rounded-2xl border text-center transition-all ${form.currency === c.code ? "border-[#00FF85] bg-[#00FF85]/[0.05]" : "border-white/[0.06] bg-white/[0.03]"}`}>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">{c.code}</p>
            <p className="text-white font-black text-base mt-1">{c.symbol}{(user?.balances?.[c.code] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
      </div>

      {success && (
        <div className="p-6 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/30 text-center space-y-4">
          <p className="text-4xl">✅</p>
          <h2 className="text-[#00FF85] font-black text-xl">Transfer Submitted!</h2>
          <div className="p-4 bg-black/40 rounded-xl space-y-2 text-left">
            {[
              ["Recipient", `${success.recipient.firstName} ${success.recipient.lastName}`],
              ["Amount", `${sym[success.currency]}${Number(success.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${success.currency}`],
              ["Reference", success.transactionId],
              ["Status", "PENDING"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-white/40">{l}</span>
                <span className={`font-bold ${l === "Status" ? "text-yellow-400" : l === "Reference" ? "text-[#00FF85] font-mono text-xs" : "text-white"}`}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-white/35 text-xs">Balance debited. Transfer will be confirmed by admin.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSuccess(null)} className="h-10 px-6 rounded-full bg-[#00FF85] text-black font-black text-sm">New Transfer</button>
            <Link href="/dashboard/transactions" className="h-10 px-6 rounded-full border border-white/10 text-white font-black text-sm flex items-center">History</Link>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-[10px] text-red-300 text-sm">{error}</div>
          )}

          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Recipient Account Number</label>
            <input name="recipientAccount" value={form.recipientAccount} onChange={handleChange} required
              placeholder="4820 5931 7742 0038" maxLength={19}
              className="w-full h-[52px] px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white font-mono text-base placeholder:text-white/20 transition-all" />
            {lookingUp && (
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <div className="h-3 w-3 border border-white/20 border-t-[#00FF85] rounded-full animate-spin" />
                Looking up account...
              </div>
            )}
            {recipient && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00FF85]/10 border border-[#00FF85]/30">
                <div className="h-9 w-9 rounded-full bg-[#00FF85]/20 border border-[#00FF85]/30 flex items-center justify-center">
                  <span className="text-[#00FF85] font-black">{recipient.firstName[0]}</span>
                </div>
                <div>
                  <p className="text-[#00FF85] font-black text-sm">{recipient.firstName} {recipient.lastName}</p>
                  <p className="text-white/30 text-[10px]">Fortress Bank • Verified ✓</p>
                </div>
              </div>
            )}
            {lookupErr && <p className="text-red-400 text-xs font-bold">{lookupErr}</p>}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Currency</label>
            <select name="currency" value={form.currency} onChange={handleChange}
              className="w-full h-[52px] px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white font-bold transition-all appearance-none">
              {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.label} ({c.code})</option>)}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-black text-lg">{sym[form.currency]}</span>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder="0.00"
                className="w-full h-[52px] pl-10 pr-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white font-black text-lg transition-all" />
            </div>
            <p className="text-white/25 text-[10px] pl-1">Available: {sym[form.currency]}{(user?.balances?.[form.currency] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Note <span className="text-white/15">(Optional)</span></label>
            <textarea name="note" value={form.note} onChange={handleChange} placeholder="What's this for?" rows={3}
              className="w-full px-4 py-3 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white transition-all resize-none" />
          </div>

          <div className="px-4 py-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl">
            <p className="text-yellow-400 text-[11px] font-bold uppercase tracking-widest mb-1">⚠️ Processing Notice</p>
            <p className="text-white/35 text-xs leading-relaxed">Balance debited immediately. Transfers are reviewed and credited to recipients by the Fortress admin team.</p>
          </div>

          <button type="submit" disabled={submitting || !recipient}
            className="w-full h-[54px] bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 shadow-[0_8px_24px_-8px_rgba(0,255,133,0.4)]">
            {submitting
              ? <><div className="h-4 w-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />Processing...</>
              : `Send ${form.amount ? `${sym[form.currency]}${Number(form.amount).toLocaleString()}` : "Money"} →`}
          </button>
        </form>
      )}
    </div>
  );
}

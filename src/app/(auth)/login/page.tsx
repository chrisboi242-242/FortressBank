"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [resetSent, setReset]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user.emailVerified) throw new Error("verify");
      router.push("/dashboard");
    } catch (err: any) {
      const m = err.message || "";
      if (m.includes("invalid-credential") || m.includes("wrong-password") || m.includes("user-not-found"))
        setError("Invalid email or password.");
      else if (m.includes("network"))  setError("No connection. Check your network.");
      else if (m.includes("too-many")) setError("Too many attempts. Try again later.");
      else if (m.includes("verify"))   setError("Please verify your email before signing in.");
      else setError("Could not sign in. Please try again.");
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!email) { setError("Enter your email first."); return; }
    try { await sendPasswordResetEmail(auth, email); setReset(true); setError(""); }
    catch { setError("Could not send reset email."); }
  };

  return (
    <main className="min-h-screen bg-[#0A0B0D] text-white flex flex-col relative overflow-hidden">
      {/* Vault rings */}
      <div className="fixed inset-0 pointer-events-none">
        {[880, 640, 420].map((s, i) => (
          <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: s, height: s, borderRadius: "50%", border: `1px solid ${i === 2 ? "rgba(0,255,133,0.07)" : "rgba(255,255,255,0.03)"}` }} />
        ))}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF85] opacity-[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 bg-[#00FF85] rounded-[6px] rotate-45 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center">
            <div className="h-2.5 w-2.5 border-[1.5px] border-black rounded-[2px]" />
          </div>
          <span className="text-[15px] font-black uppercase tracking-tight">Fortress</span>
        </Link>
        <div className="flex items-center gap-2 text-white/25 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF85] animate-pulse" />
          <span className="hidden sm:block">Vault Network Secured</span>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00FF85] mb-3">Member Access</p>
            <h1 className="text-[36px] font-black tracking-[-0.03em] leading-none">Unlock your vault</h1>
            <p className="text-white/30 text-[14px] mt-3 leading-relaxed">
              Enter your credentials to access your accounts and global vaults.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-[10px] flex gap-2.5">
              <span className="text-red-400 shrink-0 text-sm">⚠</span>
              <p className="text-red-300 text-[13px]">{error}</p>
            </div>
          )}
          {resetSent && (
            <div className="mb-5 px-4 py-3 bg-[#00FF85]/10 border border-[#00FF85]/20 rounded-[10px] flex gap-2.5">
              <span className="text-[#00FF85] shrink-0 text-sm">✓</span>
              <p className="text-[#00FF85] text-[13px]">Reset link sent — check your inbox.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/25 pl-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@fortress.com"
                className="w-full h-[52px] px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white text-[15px] placeholder:text-white/20 transition-all" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1 pr-0.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/25">Password</label>
                <button type="button" onClick={handleReset}
                  className="text-[11px] text-white/25 hover:text-[#00FF85] transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  className="w-full h-[52px] px-4 pr-12 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white text-[15px] placeholder:text-white/20 transition-all" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-[52px] mt-1 bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-[0_8px_24px_-8px_rgba(0,255,133,0.4)]">
              {loading
                ? <><div className="h-4 w-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />Verifying...</>
                : "Sign in"}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/[0.06] text-center">
            <span className="text-white/25 text-[13px]">New to Fortress? </span>
            <Link href="/register" className="text-[13px] font-bold text-white hover:text-[#00FF85] transition-colors">
              Open an account
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 text-white/20">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">🔒</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">256-bit Encryption</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">🛡️</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">KYC Verified</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

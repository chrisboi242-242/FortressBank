"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { apiRegisterUser } from "@/lib/api";
import BiometricScanner from "@/components/shared/BiometricScanner";

function Eye({ off }: { off: boolean }) {
  return off
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
}

const input = "w-full h-[50px] px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white text-[14px] placeholder:text-white/20 transition-all";
const label = "text-[11px] font-bold uppercase tracking-[0.1em] text-white/25 pl-1";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]       = useState<1|2|3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [face, setFace]       = useState<string|null>(null);
  const [sp, setSp]           = useState(false);
  const [sc, setSc]           = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phoneNumber: "", idNumber: "", password: "", confirmPassword: "",
  });
  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const step1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setError(""); setStep(2);
  };

  const step2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!face) return;
    setLoading(true); setError("");
    try {
      // 1. Create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: `${form.firstName} ${form.lastName}` });
      await sendEmailVerification(user);
      // 2. Register in our Express backend
      await apiRegisterUser({
        userId: user.uid, firstName: form.firstName, lastName: form.lastName,
        email: form.email, phoneNumber: form.phoneNumber,
        idNumber: form.idNumber, faceSignature: face,
      });
      setStep(3);
    } catch (err: any) {
      const m = err.message || "";
      if (m.includes("email-already-in-use")) { setError("This email is already registered."); setStep(1); }
      else setError("Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#0A0B0D] text-white flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {[880, 640, 420].map((s, i) => (
          <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: s, height: s, borderRadius: "50%", border: `1px solid ${i === 2 ? "rgba(0,255,133,0.07)" : "rgba(255,255,255,0.03)"}` }} />
        ))}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00FF85] opacity-[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 bg-[#00FF85] rounded-[6px] rotate-45 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center">
            <div className="h-2.5 w-2.5 border-[1.5px] border-black rounded-[2px]" />
          </div>
          <span className="text-[15px] font-black uppercase tracking-tight">Fortress</span>
        </Link>
        {step !== 3 && (
          <div className="flex items-center gap-2">
            {[1,2].map(n => (
              <div key={n} className={`h-1 rounded-full transition-all duration-300 ${n <= step ? "w-8 bg-[#00FF85]" : "w-4 bg-white/10"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">
          {step !== 3 && (
            <div className="mb-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00FF85] mb-3">
                {step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
              </p>
              <h1 className="text-[34px] font-black tracking-[-0.03em] leading-none">
                {step === 1 ? "Open your vault" : "Confirm it's you"}
              </h1>
              <p className="text-white/30 text-[14px] mt-3 leading-relaxed max-w-sm mx-auto">
                {step === 1
                  ? "Your identity is verified under global KYC standards."
                  : "A biometric scan locks your vault to your face only."}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-[10px] flex gap-2.5">
              <span className="text-red-400 shrink-0">⚠</span>
              <p className="text-red-300 text-[13px]">{error}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={step1} className="space-y-4">
              <div className="px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-[10px] flex gap-2.5">
                <span className="text-[#00FF85] shrink-0">🛡️</span>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Use your <span className="text-white font-semibold">passport</span> or{" "}
                  <span className="text-white font-semibold">government ID</span> exactly as it appears.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className={label}>First Name</label><input name="firstName" value={form.firstName} onChange={set} required placeholder="First" className={input} /></div>
                <div className="space-y-1.5"><label className={label}>Last Name</label><input name="lastName" value={form.lastName} onChange={set} required placeholder="Last" className={input} /></div>
              </div>
              <div className="space-y-1.5">
                <label className={label}>Passport / ID Number</label>
                <input name="idNumber" value={form.idNumber} onChange={set} required placeholder="A1234567" className={input} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className={label}>Phone</label><input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={set} required placeholder="+44..." className={input} /></div>
                <div className="space-y-1.5"><label className={label}>Email</label><input name="email" type="email" value={form.email} onChange={set} required placeholder="you@email.com" className={input} /></div>
              </div>
              <div className="space-y-1.5">
                <label className={label}>Password</label>
                <div className="relative">
                  <input name="password" type={sp ? "text" : "password"} value={form.password} onChange={set} required placeholder="At least 8 characters" className={`${input} pr-12`} />
                  <button type="button" onClick={() => setSp(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"><Eye off={sp} /></button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={label}>Confirm Password</label>
                <div className="relative">
                  <input name="confirmPassword" type={sc ? "text" : "password"} value={form.confirmPassword} onChange={set} required placeholder="Re-enter password" className={`${input} pr-12`} />
                  <button type="button" onClick={() => setSc(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"><Eye off={sc} /></button>
                </div>
              </div>
              <button type="submit" className="w-full h-[52px] mt-1 bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] active:scale-[0.98] transition-all shadow-[0_8px_24px_-8px_rgba(0,255,133,0.4)]">
                Continue →
              </button>
              <p className="text-center pt-1">
                <span className="text-white/25 text-[13px]">Already have a vault? </span>
                <Link href="/login" className="text-[13px] font-bold text-white hover:text-[#00FF85] transition-colors">Sign in</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={step2} className="space-y-6 flex flex-col items-center">
              <div className="w-full p-6 rounded-[20px] bg-white/[0.03] border border-white/[0.07] flex justify-center">
                <BiometricScanner onCapture={img => setFace(img)} />
              </div>
              <button type="submit" disabled={!face || loading}
                className="w-full h-[52px] bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 shadow-[0_8px_24px_-8px_rgba(0,255,133,0.4)]">
                {loading ? <><div className="h-4 w-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />Creating vault...</> : "Complete Registration"}
              </button>
              <button type="button" onClick={() => setStep(1)} className="text-[13px] text-white/25 hover:text-white transition-colors">
                ← Edit your details
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mx-auto">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <h1 className="text-[32px] font-black tracking-[-0.03em]">Check your inbox</h1>
                <p className="text-white/35 text-[14px] mt-3">
                  Verification link sent to<br />
                  <span className="text-white font-bold">{form.email}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/35">Vault locked — pending verification</span>
              </div>
              <button onClick={() => router.push("/login")}
                className="w-full h-[52px] bg-white text-black rounded-[10px] font-black text-[15px] hover:bg-white/90 active:scale-[0.98] transition-all">
                Go to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

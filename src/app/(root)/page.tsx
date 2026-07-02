"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, y = 30, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

function PhoneMockup() {
  const [visible, setVisible] = useState(true);

  // Generic transaction data — no real company names
  const txns = [
    { icon: "💸", name: "International Transfer",   amount: "+$2,500.00", pos: true  },
    { icon: "🛒", name: "Online Purchase",           amount: "-$349.00",  pos: false },
    { icon: "⚡", name: "Vault Deposit",             amount: "+$5,000.00", pos: true  },
  ];

  return (
    <div className="relative mx-auto w-[270px] sm:w-[290px]">
      <div className="absolute inset-0 bg-[#00FF85] opacity-[0.08] blur-[50px] rounded-full scale-90" />
      <div className="relative bg-[#0D0E11] rounded-[38px] border-2 border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-20 h-5 bg-black rounded-full" />
        </div>
        <div className="px-4 pb-6 space-y-3.5">
          {/* Top bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#00FF85] rounded-[4px] rotate-45 flex items-center justify-center">
                <div className="h-1.5 w-1.5 border border-black rounded-[1px]" />
              </div>
              <span className="text-white text-[11px] font-black">FORTRESS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-white/[0.06] rounded-full flex items-center justify-center">
                <span className="text-[#00FF85] text-[8px] font-black">FB</span>
              </div>
              <div className="relative">
                <span className="text-white/40 text-xs">🔔</span>
                <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-[#00FF85] rounded-full" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="text-center py-1.5">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-white text-[22px] font-black tracking-tight">
                {visible ? "$12,840.00" : "••••••••"}
              </h2>
              <button onClick={() => setVisible(v => !v)} className="text-white/30 text-xs">
                {visible ? "👁️" : "🙈"}
              </button>
            </div>
            <p className="text-white/30 text-[9px] uppercase tracking-widest mt-1">Available USD Balance</p>
          </div>

          {/* Quick actions */}
          <div className="flex justify-between px-1">
            {[{ i: "+", l: "Add" }, { i: "→", l: "Send" }, { i: "⇄", l: "Swap" }, { i: "▪", l: "Cards" }].map(a => (
              <div key={a.l} className="flex flex-col items-center gap-1">
                <div className="h-9 w-9 bg-white/[0.06] rounded-full flex items-center justify-center border border-white/10 text-white text-sm font-bold">{a.i}</div>
                <span className="text-white/30 text-[8px]">{a.l}</span>
              </div>
            ))}
          </div>

          {/* Virtual Card */}
          <div className="relative h-24 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-3.5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,133,0.15)_0%,_transparent_60%)]" />
            <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Virtual Debit</p>
            <p className="text-white text-[12px] font-black mt-3 tracking-widest">•••• •••• •••• 4291</p>
            <div className="absolute bottom-2.5 right-2.5 flex">
              <div className="h-5 w-5 bg-red-500 rounded-full opacity-90" />
              <div className="h-5 w-5 bg-yellow-400 rounded-full opacity-90 -ml-1.5" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-black text-[9px] font-black uppercase tracking-wider">Recent Activity</p>
              <p className="text-green-600 text-[8px] font-bold">See All →</p>
            </div>
            {txns.map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 bg-zinc-100 rounded-md flex items-center justify-center text-[10px]">{tx.icon}</div>
                  <p className="text-zinc-600 text-[8px] font-medium max-w-[100px] leading-tight">{tx.name}</p>
                </div>
                <p className={`text-[9px] font-black ${tx.pos ? "text-green-600" : "text-red-500"}`}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex justify-around px-5 py-2.5 border-t border-white/[0.06] bg-[#0D0E11]">
          {["🏠", "💼", "💳", "⚙️"].map((ic, i) => (
            <div key={i} className={`text-sm ${i === 0 ? "text-[#00FF85]" : "text-white/20"}`}>{ic}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: {
  icon: string; title: string; desc: string; delay: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}
      className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00FF85]/30 transition-all group">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#00FF85] transition-colors">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  const features = [
    { icon: "🏰", title: "Military-Grade Vault",  desc: "AES-256 encryption protects every transaction and every vault, around the clock." },
    { icon: "🌍", title: "140+ Countries",         desc: "Send and receive USD, EUR, and GBP globally with zero friction from anywhere in the world." },
    { icon: "⚡", title: "Instant Transfers",      desc: "Real-time balance updates the moment a deposit hits your vault." },
    { icon: "🪪", title: "Global KYC",             desc: "International passport and government ID verification built into every account." },
    { icon: "🤳", title: "Face-ID Security",       desc: "Biometric identity scanning with liveness detection and deepfake analysis." },
    { icon: "💳", title: "Virtual Debit Card",     desc: "Spend anywhere in the world with your Fortress virtual Mastercard, issued instantly." },
  ];

  const steps = [
    { n: "01", title: "Create Your Vault",  desc: "Register with your government ID and complete a biometric scan in under 3 minutes." },
    { n: "02", title: "Fund Your Account",  desc: "Deposit USD, EUR, or GBP directly into your multi-currency vault." },
    { n: "03", title: "Send & Receive",     desc: "Transfer money instantly to any Fortress Bank account worldwide." },
  ];

  const anim = (delay: number, y = 30) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <main className="min-h-screen bg-[#0A0B0D] text-white overflow-x-hidden selection:bg-[#00FF85] selection:text-black">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF85] opacity-[0.05] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00FF85] opacity-[0.04] rounded-full blur-[80px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,133,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,133,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div className="space-y-8">
              <div style={anim(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF85] animate-pulse" />
                Global Transfers Active in 140+ Countries
              </div>

              <div style={anim(0.2)}>
                <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-black tracking-[-0.03em] leading-[0.9]">
                  BANKING<br />WITHOUT<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] to-[#00e677]">
                    LIMITS.
                  </span>
                </h1>
              </div>

              <div style={anim(0.35)}>
                <p className="text-white/40 text-lg leading-relaxed max-w-md">
                  Experience the next generation of wealth management. Hold{" "}
                  <span className="text-white font-bold">USD</span>,{" "}
                  <span className="text-white font-bold">EUR</span>, and{" "}
                  <span className="text-white font-bold">GBP</span>{" "}
                  in one high-security vault. Built for the global elite.
                </p>
              </div>

              <div style={anim(0.5)} className="flex flex-col sm:flex-row gap-4">
                <Link href="/register"
                  className="h-14 px-10 flex items-center justify-center rounded-full bg-[#00FF85] text-black font-black text-base hover:shadow-[0_0_30px_rgba(0,255,133,0.35)] transition-all active:scale-95">
                  Open Your Account
                </Link>
                <Link href="/login"
                  className="h-14 px-10 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white font-bold text-base hover:bg-white/[0.07] transition-all">
                  Sign In
                </Link>
              </div>

              {/* ── UPDATED STATS ── */}
              <div style={anim(0.65)} className="flex gap-8 pt-2 border-t border-white/[0.06]">
                {[
                  { value: "200K+", label: "Members"  },
                  { value: "140+",  label: "Countries" },
                  { value: "$50M+", label: "Secured"  },
                ].map(s => (
                  <div key={s.label} className="pt-4">
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div style={anim(0.4, 40)} className="flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────── */}
      <section className="py-6 border-y border-white/[0.05]">
        <FadeIn>
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-3">
            {[
              ["🔒", "256-bit Encryption"],
              ["🪪", "KYC Verified"],
              ["🌍", "140+ Countries"],
              ["⚡", "Real-Time Transfers"],
              ["🤳", "Biometric Auth"],
              ["💳", "Virtual Mastercard"],
            ].map(([ic, txt]) => (
              <div key={txt} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[#00FF85] text-sm">{ic}</span>
                <span className="text-white/35 text-xs font-medium">{txt}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.3em] mb-4">How It Works</p>
            <h2 className="text-4xl font-black tracking-tight">
              Up and running <span className="text-white/30">in 3 minutes.</span>
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00FF85]/25 transition-all relative">
                  <p className="text-[#00FF85] text-5xl font-black opacity-15 absolute top-4 right-5">{s.n}</p>
                  <div className="h-10 w-10 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mb-4">
                    <span className="text-[#00FF85] font-black text-sm">{s.n}</span>
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.3em] mb-4">Why Fortress</p>
            <h2 className="text-4xl font-black tracking-tight">
              Built different. <span className="text-white/30">Engineered to last.</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ── MULTI-CURRENCY ───────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.3em] mb-4">Multi-Currency Ledger</p>
            <h2 className="text-4xl font-black tracking-tight">
              One vault. <span className="text-white/30">Every currency.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-px">
              <div className="rounded-3xl bg-black flex items-center justify-center py-16 px-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20 w-full">
                  {[
                    { country: "United States", flag: "🇺🇸", code: "USD", symbol: "$" },
                    { country: "European Union", flag: "🇪🇺", code: "EUR", symbol: "€" },
                    { country: "United Kingdom", flag: "🇬🇧", code: "GBP", symbol: "£" },
                  ].map((c, i) => (
                    <div key={i} className="text-center group">
                      <p className="text-3xl mb-2">{c.flag}</p>
                      <p className="text-white/30 text-sm italic mb-2">{c.country}</p>
                      <h3 className="text-3xl md:text-4xl font-black group-hover:text-[#00FF85] transition-colors">
                        {c.code}
                      </h3>
                      <p className="text-white/20 text-xs mt-1 uppercase tracking-widest">{c.symbol} Wallet</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#00FF85] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
                Ready to open your vault?
              </h2>
              <p className="text-black/50 text-lg mb-8">
                Join over 200,000 members securing their wealth with Fortress Bank.
              </p>
              <Link href="/register"
                className="inline-flex h-14 px-12 items-center rounded-full bg-black text-white font-black text-base hover:bg-zinc-900 transition-all active:scale-95">
                Get Started — It's Free
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[#00FF85] rounded-[6px] rotate-45" />
              <span className="text-white font-black text-xl uppercase tracking-tight">Fortress Bank</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              The next generation of global wealth management. Secure, private, and built for the elite. Headquartered in the United Kingdom.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00FF85]/[0.06] border border-[#00FF85]/20">
              <span className="text-[#00FF85] text-sm">🔐</span>
              <span className="text-[#00FF85] text-[10px] font-black uppercase tracking-widest">
                Protected by Advanced 256-bit Encryption
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <p className="text-white font-black text-sm uppercase tracking-widest">Quick Links</p>
            {[
              { label: "Open Account",   href: "/register" },
              { label: "Sign In",        href: "/login"    },
              { label: "Support Centre", href: "/support"  },
              { label: "Contact Us",     href: "/contact"  },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className="block text-white/35 text-sm hover:text-[#00FF85] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <p className="text-white font-black text-sm uppercase tracking-widest">Legal</p>
            {[
              { label: "Privacy Policy",   href: "/privacy"  },
              { label: "Terms of Service", href: "/terms"    },
              { label: "Security Policy",  href: "/security" },
              { label: "Support",          href: "/support"  },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className="block text-white/35 text-sm hover:text-[#00FF85] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-5 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/25 text-xs">
              © 2026 Fortress Bank. All rights reserved. Registered in the United Kingdom.
            </p>
            <div className="flex gap-5 text-xs text-white/25">
              {[
                { label: "Privacy Policy",   href: "/privacy"  },
                { label: "Terms of Service", href: "/terms"    },
                { label: "Security",         href: "/security" },
                { label: "Support",          href: "/support"  },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="hover:text-[#00FF85] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-white/25">
              <span className="text-[#00FF85] text-xs">🔒</span>
              <span className="text-[10px]">Protected by Advanced 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
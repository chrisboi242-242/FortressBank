"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to your backend or a service like Resend/SendGrid
    // For now we open the user's mail client with the details pre-filled
    const mailto = `mailto:support@fortressbank.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSubmit(true);
  };

  const inputCls = "w-full px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-[#00FF85]/50 outline-none text-white text-[14px] placeholder:text-white/20 transition-all";

  return (
    <main className="min-h-screen bg-[#0A0B0D] text-white">

      {/* Nav */}
      <div className="border-b border-white/[0.06] px-6 sm:px-10 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 bg-[#00FF85] rounded-[6px] rotate-45 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center">
              <div className="h-2.5 w-2.5 border-[1.5px] border-black rounded-[2px]" />
            </div>
            <span className="text-[15px] font-black uppercase tracking-tight">Fortress Bank</span>
          </Link>
          <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left */}
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.25em]">Contact</p>
              <h1 className="text-4xl font-black tracking-tight">Get in touch</h1>
              <p className="text-white/40 text-lg leading-relaxed">
                Have a question about your account, a transaction, or our services? We are here to help. Reach out and our team will get back to you promptly.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: "📧",
                  title: "Email",
                  value: "support@fortressbank.com",
                  sub: "For all account and support enquiries",
                  href: "mailto:support@fortressbank.com",
                },
                {
                  icon: "⏰",
                  title: "Business Hours",
                  value: "Monday – Friday, 9AM – 6PM GMT",
                  sub: "We respond within 24–48 hours",
                  href: null,
                },
                {
                  icon: "🌍",
                  title: "Headquarters",
                  value: "United Kingdom",
                  sub: "Serving 200,000+ members globally",
                  href: null,
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{item.title}</p>
                    {item.href
                      ? <a href={item.href} className="text-white font-bold hover:text-[#00FF85] transition-colors">{item.value}</a>
                      : <p className="text-white font-bold">{item.value}</p>
                    }
                    <p className="text-white/30 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Quick Links</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Support Centre", href: "/support" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Security Policy", href: "/security" },
                ].map(l => (
                  <Link key={l.label} href={l.href}
                    className="px-4 h-9 flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-bold hover:text-[#00FF85] hover:border-[#00FF85]/30 transition-all">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-5">
                  <div className="h-20 w-20 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mx-auto">
                    <span className="text-[#00FF85] text-4xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-black">Message sent!</h2>
                  <p className="text-white/40 leading-relaxed">
                    Your mail client should have opened. If not, email us directly at{" "}
                    <a href="mailto:support@fortressbank.com" className="text-[#00FF85] font-bold">
                      support@fortressbank.com
                    </a>
                  </p>
                  <button onClick={() => { setSubmit(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="h-11 px-8 rounded-full bg-white/[0.06] border border-white/10 text-white font-bold text-sm hover:border-white/20 transition-all">
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-black mb-6">Send us a message</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Full Name</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required placeholder="Your name" className={`${inputCls} h-[50px]`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required placeholder="your@email.com" className={`${inputCls} h-[50px]`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Subject</label>
                  <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    required className={`${inputCls} h-[50px] appearance-none`}>
                    <option value="">Select a subject</option>
                    <option value="Account Support">Account Support</option>
                    <option value="Transaction Enquiry">Transaction Enquiry</option>
                    <option value="Security Concern">Security Concern</option>
                    <option value="KYC Verification">KYC Verification</option>
                    <option value="Virtual Card">Virtual Card</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 pl-1">Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required placeholder="Describe your issue or question in detail..." rows={6}
                    className={`${inputCls} py-3 resize-none`} />
                </div>

                <button type="submit"
                  className="w-full h-[52px] bg-[#00FF85] text-black rounded-[10px] font-black text-[15px] hover:bg-[#1AFF94] active:scale-[0.98] transition-all shadow-[0_8px_24px_-8px_rgba(0,255,133,0.4)]">
                  Send Message →
                </button>

                <p className="text-white/20 text-xs text-center leading-relaxed">
                  By submitting this form you agree to our{" "}
                  <Link href="/privacy" className="text-white/40 hover:text-[#00FF85] transition-colors">Privacy Policy</Link>.
                  We will respond within 24–48 hours.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
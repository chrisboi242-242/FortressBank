"use client";

import Link from "next/link";
import { useState } from "react";

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I open a Fortress Bank account?",
      a: "Click 'Open Account' on our homepage and complete the registration form. You will need a valid government-issued ID (passport or national ID) and to complete a quick biometric facial scan. Once your email is verified, your account will be active.",
    },
    {
      q: "How long does a transfer take to process?",
      a: "All transfers submitted on Fortress Bank are reviewed by our operations team. Processing typically occurs within 24 hours of submission. You will see the transfer status update from PENDING to COMPLETED or FAILED in your Transaction History.",
    },
    {
      q: "What currencies does Fortress Bank support?",
      a: "Fortress Bank currently supports three currencies: US Dollar (USD), Euro (EUR), and British Pound Sterling (GBP). All three wallets are created automatically when you open your account.",
    },
    {
      q: "Can I transfer money to someone outside Fortress Bank?",
      a: "Currently, Fortress Bank supports internal transfers between Fortress Bank account holders. The recipient must have a registered Fortress Bank account. International interbank transfers are on our roadmap.",
    },
    {
      q: "My transfer is showing as PENDING — what does that mean?",
      a: "PENDING means your transfer has been submitted and your balance has been debited. It is currently under review by our operations team. Once processed, the status will update to COMPLETED and the recipient's balance will be credited. If the transfer cannot be processed, it will show as FAILED and your balance will be refunded.",
    },
    {
      q: "How do I use my virtual debit card?",
      a: "Your virtual Visa debit card details can be found in the Cards section of your dashboard. Tap 'Reveal Card Details' to see your full card number, expiry date, and CVV. Never share these details with anyone.",
    },
    {
      q: "I forgot my password — how do I reset it?",
      a: "On the login page, click 'Forgot password?' and enter your registered email address. We will send you a password reset link to your inbox. Check your spam folder if you do not see it within a few minutes.",
    },
    {
      q: "Why is my account showing 'Pending Verification'?",
      a: "Your account status will show Pending Verification if your email has not been verified or if your account is awaiting review by our team. Please check your inbox for a verification email and click the link provided.",
    },
    {
      q: "How do I find my account number?",
      a: "Your 13-digit Fortress Bank account number is displayed on your dashboard Overview page, on your virtual card, and in the Receive Money section. You can copy it directly to share with someone who wants to send you money.",
    },
    {
      q: "Is my money safe with Fortress Bank?",
      a: "Fortress Bank uses AES-256 military-grade encryption for all stored data and TLS 1.3 for all data in transit. Every account is KYC-verified and every transaction goes through our internal review process. Your security is our highest priority.",
    },
    {
      q: "How do I close my account?",
      a: "To request account closure, please contact us at support@fortressbank.com with the subject line 'Account Closure Request'. Our team will process your request within 5 business days. Any remaining balance will need to be transferred before closure.",
    },
  ];

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

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Header */}
        <div className="space-y-4">
          <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.25em]">Support</p>
          <h1 className="text-4xl font-black tracking-tight">How can we help?</h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Find answers to common questions below. If you need further assistance, our team is available at support@fortressbank.com.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="mailto:support@fortressbank.com"
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00FF85]/30 transition-all group space-y-3">
            <span className="text-3xl">📧</span>
            <h3 className="text-white font-black group-hover:text-[#00FF85] transition-colors">Email Support</h3>
            <p className="text-white/40 text-sm">support@fortressbank.com</p>
            <p className="text-white/25 text-xs">Response within 24–48 hours</p>
          </a>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
            <span className="text-3xl">⏰</span>
            <h3 className="text-white font-black">Support Hours</h3>
            <p className="text-white/40 text-sm">Monday – Friday</p>
            <p className="text-white/25 text-xs">9:00 AM – 6:00 PM GMT</p>
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="text-white font-bold text-sm pr-4">{faq.q}</span>
                  <span className={`text-white/40 shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Still need help */}
        <div className="p-8 rounded-3xl bg-[#00FF85]/[0.05] border border-[#00FF85]/20 text-center space-y-4">
          <h2 className="text-2xl font-black">Still need help?</h2>
          <p className="text-white/40 leading-relaxed">
            Our support team is ready to assist you with any question about your account, transactions, or security.
          </p>
          <a href="mailto:support@fortressbank.com"
            className="inline-flex h-12 px-8 items-center rounded-full bg-[#00FF85] text-black font-black text-sm hover:bg-[#1AFF94] transition-all active:scale-95">
            Email Us →
          </a>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-white/30">
          <Link href="/privacy" className="hover:text-[#00FF85] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#00FF85] transition-colors">Terms of Service</Link>
          <Link href="/security" className="hover:text-[#00FF85] transition-colors">Security Policy</Link>
          <Link href="/contact" className="hover:text-[#00FF85] transition-colors">Contact Us</Link>
        </div>

      </div>
    </main>
  );
}
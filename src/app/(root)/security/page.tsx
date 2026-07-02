"use client";

import Link from "next/link";

export default function SecurityPage() {
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

      {/* Hero */}
      <div className="border-b border-white/[0.06] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,133,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.25em]">Security</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Your vault. <br /><span className="text-white/30">Impenetrable.</span></h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-xl">
            Security is not a feature at Fortress Bank — it is the foundation everything else is built on. Here is exactly how we protect your money and your identity.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Security pillars */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "🔐", title: "AES-256 Encryption", desc: "Military-grade encryption protects all data at rest and in transit." },
            { icon: "🛡️", title: "KYC Verified", desc: "Every account is identity-verified with government-issued documentation." },
            { icon: "🤳", title: "Biometric Auth", desc: "Facial recognition with liveness detection prevents impersonation." },
          ].map(p => (
            <div key={p.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="text-white font-black">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/[0.06]" />

        {[
          {
            title: "Encryption",
            content: `All data stored within the Fortress Bank platform is encrypted using AES-256 (Advanced Encryption Standard with 256-bit keys) — the same standard used by governments, military organisations, and leading financial institutions worldwide.

All data transmitted between your device and our servers is protected using TLS 1.3 (Transport Layer Security), ensuring your information cannot be intercepted in transit. Your account password is never stored in plain text — it is handled entirely by Firebase Authentication using industry-standard hashing.`,
          },
          {
            title: "Identity Verification (KYC)",
            content: `Every Fortress Bank account must pass a rigorous Know Your Customer (KYC) verification process before access is granted. This includes:

• Government-issued identification: passport or national ID number verified at registration.
• Biometric facial scan: a live facial signature is captured during onboarding using our integrated biometric scanner, which includes liveness detection and deepfake analysis to prevent fraudulent registrations.
• Email verification: every account must verify their email address before they can log in or access any funds.

This process ensures that every person on our platform is who they say they are, protecting both individual users and the integrity of our network.`,
          },
          {
            title: "Account Security",
            content: `Your Fortress Bank account is protected by multiple layers of security:

• Secure password requirements: a minimum password length is enforced at registration.
• Session management: authenticated sessions use secure, HTTP-only cookies with strict same-site policies, preventing cross-site request forgery (CSRF) attacks.
• Email verification gate: unverified accounts cannot access the platform, even with valid credentials.
• Automatic session expiry: sessions expire after a defined period of inactivity, requiring re-authentication.
• Failed login protection: repeated failed login attempts trigger automatic rate limiting to prevent brute-force attacks.`,
          },
          {
            title: "Transaction Security",
            content: `Every transaction on Fortress Bank goes through a multi-layer review process:

• Sender verification: all transfers are authenticated against the logged-in user's verified identity.
• Balance validation: transactions exceeding available balances are rejected before they are submitted.
• Self-transfer prevention: our system prevents users from transferring funds to their own account number.
• Recipient verification: recipient account numbers are looked up and verified against our user database before a transfer can be confirmed.
• Admin review: all transfers are subject to review by our operations team before funds are credited to the recipient.
• Audit trail: every transaction is permanently recorded with a unique reference ID, timestamp, sender, recipient, amount, and status.`,
          },
          {
            title: "Infrastructure Security",
            content: `Fortress Bank is built on enterprise-grade cloud infrastructure:

• Authentication: Firebase Authentication by Google, providing industry-leading identity management.
• Database: Google Cloud Firestore with strict access control rules, ensuring no client-side direct database access.
• Backend API: our Express.js API server verifies every request using Firebase ID tokens before any data is accessed or modified.
• Hosting: frontend deployed on Vercel's global edge network; backend deployed on Render with isolated server environments.
• Environment isolation: all sensitive credentials (API keys, private keys, database secrets) are stored as encrypted environment variables, never in source code.`,
          },
          {
            title: "Reporting a Security Vulnerability",
            content: `Fortress Bank takes security disclosures seriously. If you believe you have discovered a security vulnerability in our platform, we ask that you:

• Do not exploit the vulnerability or access data belonging to other users.
• Report it to us immediately and confidentially at support@fortressbank.com with the subject line "Security Vulnerability Report."
• Provide as much detail as possible including steps to reproduce, potential impact, and any supporting evidence.

We will acknowledge your report within 48 hours and work with you to understand and resolve the issue as quickly as possible. We appreciate responsible disclosure from the security community.`,
          },
          {
            title: "Your Responsibilities",
            content: `While we implement extensive security measures on our end, your account security also depends on actions you take:

• Never share your password, CVV, or full card number with anyone — including people claiming to be Fortress Bank staff. We will never ask for these.
• Use a strong, unique password that you do not use on other platforms.
• Keep your registered email address secure and up to date.
• Report any suspicious activity on your account immediately to support@fortressbank.com.
• Always log out of your account when using a shared or public device.`,
          },
        ].map(section => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xl font-black text-white">{section.title}</h2>
            <div className="text-white/50 text-[15px] leading-[1.8] whitespace-pre-line">{section.content}</div>
          </div>
        ))}

        <div className="h-px bg-white/[0.06]" />

        <div className="flex flex-wrap gap-6 text-sm text-white/30">
          <Link href="/privacy" className="hover:text-[#00FF85] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#00FF85] transition-colors">Terms of Service</Link>
          <Link href="/support" className="hover:text-[#00FF85] transition-colors">Support</Link>
          <Link href="/contact" className="hover:text-[#00FF85] transition-colors">Contact Us</Link>
        </div>

      </div>
    </main>
  );
}
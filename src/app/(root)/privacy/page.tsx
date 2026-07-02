"use client";

import Link from "next/link";

export default function PrivacyPage() {
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        <div className="space-y-4">
          <p className="text-[#00FF85] text-xs font-black uppercase tracking-[0.25em]">Legal</p>
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: 1 July 2026 &nbsp;·&nbsp; Fortress Bank, United Kingdom</p>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {[
          {
            title: "1. Who We Are",
            content: `Fortress Bank ("we", "our", "us") is a financial technology platform headquartered in the United Kingdom. We provide multi-currency digital banking services including account management, international transfers, and virtual payment cards to individuals across the globe. Our registered contact address is United Kingdom. For all privacy-related enquiries, please contact us at support@fortressbank.com.`,
          },
          {
            title: "2. Information We Collect",
            content: `We collect information you provide directly to us when you create an account or use our services. This includes:

• Identity information: your first name, last name, date of birth, and government-issued identification number (passport or national ID).
• Contact information: email address and phone number.
• Biometric data: a facial signature captured during the Know Your Customer (KYC) verification process. This is encrypted using AES-256 encryption and stored securely.
• Financial information: transaction history, account balances, and transfer records.
• Device and usage data: IP address, browser type, device identifiers, and pages visited within our platform.`,
          },
          {
            title: "3. How We Use Your Information",
            content: `We use the information we collect for the following purposes:

• To create and maintain your Fortress Bank account.
• To verify your identity in compliance with Know Your Customer (KYC) requirements.
• To process transactions and transfers on your behalf.
• To detect, prevent, and investigate fraud or other illegal activity.
• To communicate with you about your account, including security alerts and service updates.
• To improve our platform, services, and user experience.
• To comply with applicable laws, regulations, and legal obligations.`,
          },
          {
            title: "4. Legal Basis for Processing (UK GDPR)",
            content: `Under the UK General Data Protection Regulation (UK GDPR), we process your personal data on the following legal bases:

• Contract performance: processing necessary to provide the banking services you have requested.
• Legal obligation: processing required to comply with financial regulations and anti-money laundering laws.
• Legitimate interests: processing for fraud prevention, security, and platform improvement where your interests are not overridden.
• Consent: where you have given explicit consent, such as for biometric data collection during KYC verification.`,
          },
          {
            title: "5. How We Protect Your Data",
            content: `We implement industry-standard security measures to protect your personal information:

• AES-256 encryption for all sensitive data at rest.
• TLS encryption for all data in transit.
• Strict access controls — only authorised personnel can access user data.
• Regular security audits and vulnerability assessments.
• Firebase Authentication for secure identity management.

No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.`,
          },
          {
            title: "6. Sharing Your Information",
            content: `We do not sell, rent, or trade your personal information to third parties. We may share your data only in the following circumstances:

• Service providers: trusted third-party providers who assist in operating our platform (e.g. cloud infrastructure, authentication services), bound by strict confidentiality agreements.
• Legal requirements: when required by law, court order, or governmental authority.
• Fraud prevention: with relevant authorities to investigate suspected fraud or financial crime.
• Business transfers: in connection with a merger, acquisition, or sale of assets, with appropriate notice to you.`,
          },
          {
            title: "7. Data Retention",
            content: `We retain your personal data for as long as your account remains active and for a period thereafter as required by UK financial regulations. Specifically:

• Account and identity data: retained for a minimum of 5 years following account closure, as required by UK anti-money laundering regulations.
• Transaction records: retained for a minimum of 6 years.
• Biometric data: deleted within 30 days of account closure upon request.

You may request deletion of your data at any time by contacting support@fortressbank.com, subject to our legal retention obligations.`,
          },
          {
            title: "8. Your Rights Under UK GDPR",
            content: `As a UK resident or user of our services, you have the following rights regarding your personal data:

• Right of access: request a copy of the personal data we hold about you.
• Right to rectification: request correction of inaccurate or incomplete data.
• Right to erasure: request deletion of your data where we no longer have a legal basis to hold it.
• Right to restrict processing: request that we limit how we use your data.
• Right to data portability: receive your data in a structured, commonly used format.
• Right to object: object to processing based on legitimate interests.
• Right to withdraw consent: where processing is based on consent, withdraw it at any time.

To exercise any of these rights, contact us at support@fortressbank.com. We will respond within 30 days.`,
          },
          {
            title: "9. Cookies",
            content: `Fortress Bank uses essential cookies to maintain your session and ensure the security of your account. We do not use advertising or tracking cookies. By using our platform, you consent to the use of essential cookies as described in this policy.`,
          },
          {
            title: "10. International Transfers",
            content: `Your data may be processed outside the United Kingdom by our service providers. Where this occurs, we ensure that appropriate safeguards are in place in accordance with UK GDPR, including Standard Contractual Clauses or adequacy decisions.`,
          },
          {
            title: "11. Changes to This Policy",
            content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of significant changes by email or through a prominent notice on our platform. The date at the top of this page reflects the most recent update.`,
          },
          {
            title: "12. Contact Us",
            content: `If you have any questions, concerns, or complaints about this Privacy Policy or how we handle your data, please contact us:

Email: support@fortressbank.com
Fortress Bank
United Kingdom

If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.`,
          },
        ].map(section => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xl font-black text-white">{section.title}</h2>
            <div className="text-white/50 text-[15px] leading-[1.8] whitespace-pre-line">{section.content}</div>
          </div>
        ))}

        <div className="h-px bg-white/[0.06]" />

        {/* Footer links */}
        <div className="flex flex-wrap gap-6 text-sm text-white/30">
          <Link href="/terms" className="hover:text-[#00FF85] transition-colors">Terms of Service</Link>
          <Link href="/security" className="hover:text-[#00FF85] transition-colors">Security Policy</Link>
          <Link href="/support" className="hover:text-[#00FF85] transition-colors">Support</Link>
          <Link href="/contact" className="hover:text-[#00FF85] transition-colors">Contact Us</Link>
        </div>

      </div>
    </main>
  );
}
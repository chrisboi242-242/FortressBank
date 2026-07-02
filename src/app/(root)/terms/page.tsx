"use client";

import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: 1 July 2026 &nbsp;·&nbsp; Fortress Bank, United Kingdom</p>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {[
          {
            title: "1. Acceptance of Terms",
            content: `By accessing or using the Fortress Bank platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use our Platform.

These Terms constitute a legally binding agreement between you ("User", "you") and Fortress Bank ("we", "our", "us"), a financial technology platform based in the United Kingdom. We reserve the right to update these Terms at any time with notice provided to registered users.`,
          },
          {
            title: "2. Eligibility",
            content: `To use Fortress Bank, you must:

• Be at least 18 years of age.
• Have the legal capacity to enter into a binding agreement.
• Not be a resident of a country subject to international sanctions.
• Provide accurate, current, and complete information during registration.
• Successfully complete our Know Your Customer (KYC) identity verification process.

Fortress Bank reserves the right to refuse service to any person at our sole discretion.`,
          },
          {
            title: "3. Account Registration and KYC",
            content: `To open a Fortress Bank account, you must complete our multi-step registration process which includes:

• Providing your legal name, email address, phone number, and government-issued identification.
• Completing a biometric facial scan for identity verification purposes.
• Verifying your email address before accessing your account.

You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately at support@fortressbank.com if you suspect unauthorised access to your account. Fortress Bank will not be liable for any losses resulting from unauthorised use of your account where you have failed to take reasonable security precautions.`,
          },
          {
            title: "4. Fortress Bank Accounts and Wallets",
            content: `Upon successful registration, Fortress Bank will create a multi-currency digital wallet for you supporting the following currencies:

• United States Dollar (USD)
• Euro (EUR)
• British Pound Sterling (GBP)

Your Fortress Bank account number is a unique 13-digit identifier assigned at registration. You will also receive a virtual Visa debit card linked to your account. Account balances are maintained digitally on our platform.`,
          },
          {
            title: "5. Transfers and Transactions",
            content: `Fortress Bank facilitates internal transfers between Fortress Bank account holders. When you initiate a transfer:

• Your balance will be debited immediately upon submission.
• Transfers are subject to review and processing by our operations team.
• You will receive a transaction reference number for every transfer submitted.
• Fortress Bank reserves the right to delay, suspend, or reverse any transaction suspected of fraud, error, or violation of these Terms.

Fortress Bank does not guarantee specific processing times for any transfer. You must ensure all recipient account details are correct before submitting a transfer. Fortress Bank is not liable for funds transferred to an incorrect account due to user error.`,
          },
          {
            title: "6. Fees",
            content: `Fortress Bank currently offers its core services without transaction fees. We reserve the right to introduce fees for specific services in the future. We will provide at least 30 days' advance notice of any fee changes to registered users via email or in-platform notification.`,
          },
          {
            title: "7. Prohibited Activities",
            content: `You agree not to use Fortress Bank for any of the following:

• Money laundering, terrorist financing, or any activity that violates anti-money laundering (AML) laws.
• Fraud, identity theft, or misrepresentation.
• Transactions involving illegal goods, services, or activities.
• Circumventing, disabling, or interfering with security features of the Platform.
• Attempting to gain unauthorised access to other users' accounts.
• Using the Platform for any purpose that violates applicable local, national, or international law.

Violation of this section may result in immediate account suspension, termination, and referral to relevant law enforcement authorities.`,
          },
          {
            title: "8. Account Suspension and Termination",
            content: `Fortress Bank reserves the right to suspend or terminate your account at any time, with or without notice, for any of the following reasons:

• Violation of these Terms of Service.
• Suspected fraudulent or illegal activity.
• Failure to complete or maintain KYC verification.
• Inactivity for a period exceeding 24 months.
• At your request.

Upon termination, your access to the Platform will be revoked. Any remaining balance will be processed in accordance with our standard procedures and applicable law.`,
          },
          {
            title: "9. Intellectual Property",
            content: `All content, trademarks, logos, and intellectual property on the Fortress Bank platform are owned by or licensed to Fortress Bank. You may not copy, reproduce, distribute, or create derivative works from any part of our Platform without our express written permission.`,
          },
          {
            title: "10. Limitation of Liability",
            content: `To the fullest extent permitted by applicable law, Fortress Bank shall not be liable for:

• Any indirect, incidental, special, consequential, or punitive damages.
• Loss of profits, data, or goodwill.
• Losses arising from unauthorised access to your account where you have failed to maintain adequate security.
• Service interruptions due to maintenance, technical issues, or events beyond our reasonable control.

Our total liability to you for any claim arising from your use of the Platform shall not exceed the value of the disputed transaction.`,
          },
          {
            title: "11. Privacy",
            content: `Your use of Fortress Bank is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Platform, you consent to the collection and use of your information as described in our Privacy Policy.`,
          },
          {
            title: "12. Governing Law and Dispute Resolution",
            content: `These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of England and Wales.

Before pursuing formal legal action, we encourage you to contact us at support@fortressbank.com to resolve any dispute informally.`,
          },
          {
            title: "13. Contact Us",
            content: `If you have any questions about these Terms of Service, please contact us:

Email: support@fortressbank.com
Fortress Bank
United Kingdom`,
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
          <Link href="/security" className="hover:text-[#00FF85] transition-colors">Security Policy</Link>
          <Link href="/support" className="hover:text-[#00FF85] transition-colors">Support</Link>
          <Link href="/contact" className="hover:text-[#00FF85] transition-colors">Contact Us</Link>
        </div>

      </div>
    </main>
  );
}
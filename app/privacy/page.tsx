import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    intro:
      "We collect and process the following categories of information to deliver our services:",
    items: [
      {
        label: "Business operational data",
        text: "Work orders, job records, asset data, technician assignments, and related field service management information from connected platforms (e.g., Utilize Core).",
      },
      {
        label: "Employee and HR data",
        text: "Technician names, work hours, overtime submissions, leave requests, payroll inputs, and related workforce information provided by your organization or submitted through our portals.",
      },
      {
        label: "Financial data",
        text: "Payroll records, expense statements, corporate card transactions (e.g., American Express), and related financial information accessed through integrations you authorize.",
      },
      {
        label: "Accounting and financial platform data",
        text: "With your explicit authorization, we access data from accounting and payroll platforms you connect to our service, including payroll records, employee information, and financial transactions, solely to provide our contracted automation services.",
      },
      {
        label: "Fleet and vehicle data",
        text: "License plate information, vehicle assignments, parking violation records, and maintenance records from connected fleet systems and New York State reports.",
      },
      {
        label: "Account and authentication data",
        text: "Names, email addresses, phone numbers, and login credentials for platform access.",
      },
      {
        label: "Usage data",
        text: "How users interact with our platform, including agent activity logs, API calls, and system events, used to improve reliability and performance.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    intro: "We use the information we collect exclusively to:",
    bullets: [
      "Provide, operate, and improve the Facility 19 platform and its AI automation agents.",
      "Execute contracted automation workflows including payroll processing, asset enrichment, ticket monitoring, and expense reconciliation.",
      "Authenticate users and manage access to the employee and technician portals.",
      "Communicate with users about service status, workflow results, and support matters.",
      "Comply with applicable laws and legal obligations.",
    ],
    note: "Third-Party Integration Data: Data accessed from any connected third-party platform is used only to provide the specific automation services you have contracted with us. We do not use this data to train AI models, sell to third parties, or for any purpose outside our contracted scope of work.",
  },
  {
    title: "3. Data Sharing and Third Parties",
    intro: "We do not sell your data. We share information only in the following circumstances:",
    bullets: [
      "Service integrations: To deliver our automation services, we exchange data with third-party platforms you have authorized. These may include accounting and payroll systems, field service management platforms, expense platforms, fleet systems, and communication tools listed in your service agreement. Each integration operates only with your explicit authorization.",
      "Infrastructure providers: We use industry-standard cloud hosting (including Vercel, Supabase, and related services) to operate our platform. These providers process data on our behalf under data processing agreements.",
      "Legal compliance: We may disclose data if required by law, court order, or to protect the rights and safety of our users or the public.",
      "Business transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to equivalent privacy protections.",
    ],
  },
  {
    title: "4. Data Retention",
    text: "We retain operational data for as long as your service agreement is active and for a reasonable period thereafter to fulfill legal and business obligations. Payroll and financial records are retained in accordance with applicable federal and state record-keeping requirements. You may request deletion of your data at any time by contacting us at the address below.",
  },
  {
    title: "5. Security",
    text: "We implement industry-standard technical and organizational measures to protect your data, including encrypted data transmission (TLS), access controls, authentication requirements, and regular security reviews. No system is completely secure; we encourage you to use strong credentials and report any suspected security issues to us immediately.",
  },
  {
    title: "6. Data Ownership",
    text: "You retain full ownership of all data you provide to or generate through our platform. Facility 19 acts as a data processor on your behalf. We do not claim ownership of your business data, employee records, financial information, or any other content you bring to or create within our platform.",
  },
  {
    title: "7. Children's Privacy",
    text: "Our platform is designed for business use by adults. We do not knowingly collect personal information from individuals under the age of 18.",
  },
  {
    title: "8. Changes to This Policy",
    text: "We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on our platform. Continued use of our services after changes take effect constitutes acceptance of the updated policy.",
  },
  {
    title: "9. Contact Us",
    text: "For questions about this Privacy Policy or to exercise your data rights, contact us at:",
    contact: true,
  },
];

export default function PrivacyPage() {
  return (
    <div className="privacy-shell min-h-dvh bg-[#FAFAF8] text-[#0A0A0B]">
      <header className="border-b border-[#E5E4DE]">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-7 py-6">
          <Link
            href="/"
            className="text-[15px] font-medium tracking-[-0.01em] transition-opacity hover:opacity-70"
          >
            <span>Facility</span>
            <span className="text-[#6B7BFF]">19</span>
          </Link>
          <Link
            href="/"
            className="text-[14px] text-[#5E6472] transition-colors hover:text-[#0A0A0B]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-7 py-16 md:py-20">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#5E6472]">
          Legal
        </p>
        <h1 className="mt-4 text-[clamp(32px,4vw,44px)] font-medium leading-[1.05] tracking-[-0.025em]">
          Privacy Policy
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[#5E6472]">
          Effective Date: June 1, 2026 · Last Updated: June 24, 2026 ·
          Facility 19 / WeLaunch Inc.
        </p>
        <p className="mt-8 text-[17px] leading-[1.65] text-[#1A1A1D]">
          This Privacy Policy describes how Facility 19 (operated by WeLaunch
          Inc., &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
          collects, uses, and protects information when you use our AI-powered
          back-office automation platform, including our agent suite (ASIS),
          employee portal, and integrations with third-party services including
          QuickBooks Online.
        </p>
        <p className="mt-5 text-[17px] leading-[1.65] text-[#1A1A1D]">
          By accessing or using our platform, you agree to the practices
          described in this policy.
        </p>

        <div className="mt-14 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-[22px] font-medium tracking-[-0.018em]">
                {section.title}
              </h2>

              {"intro" in section && section.intro && (
                <p className="mt-4 text-[16px] leading-[1.65] text-[#1A1A1D]">
                  {section.intro}
                </p>
              )}

              {"items" in section && section.items && (
                <ul className="mt-5 space-y-4">
                  {section.items.map((item) => (
                    <li
                      key={item.label}
                      className="text-[16px] leading-[1.65] text-[#1A1A1D]"
                    >
                      <span className="font-medium">{item.label}</span>
                      {": "}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}

              {"bullets" in section && section.bullets && (
                <ul className="mt-5 list-disc space-y-3 pl-5 text-[16px] leading-[1.65] text-[#1A1A1D]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {"note" in section && section.note && (
                <p className="mt-5 text-[16px] leading-[1.65] text-[#1A1A1D]">
                  <span className="font-medium">Third-Party Integration Data:</span>{" "}
                  {section.note.replace("Third-Party Integration Data: ", "")}
                </p>
              )}

              {"text" in section && section.text && !section.contact && (
                <p className="mt-4 text-[16px] leading-[1.65] text-[#1A1A1D]">
                  {section.text}
                </p>
              )}

              {"contact" in section && section.contact && (
                <div className="mt-4 text-[16px] leading-[1.65] text-[#1A1A1D]">
                  <p>{section.text}</p>
                  <address className="mt-4 not-italic">
                    <p className="font-medium">Facility 19 / WeLaunch Inc.</p>
                    <p className="mt-2">
                      Website:{" "}
                      <a
                        href="https://facility19.com"
                        className="text-[#3D4DDB] underline-offset-2 hover:underline"
                      >
                        https://facility19.com
                      </a>
                    </p>
                  </address>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#E5E4DE] py-8">
        <div className="mx-auto flex max-w-[760px] flex-col gap-2 px-7 text-[13px] text-[#5E6472] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ARB Global LLC · Facility19</span>
          <Link
            href="/"
            className="transition-colors hover:text-[#0A0A0B]"
          >
            facility19.com
          </Link>
        </div>
      </footer>
    </div>
  );
}

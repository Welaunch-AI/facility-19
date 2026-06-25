import Link from "next/link";

const toc = [
  { id: "services", label: "Services Description" },
  { id: "license", label: "License Grant" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "integrations", label: "Third-Party Integrations" },
  { id: "data", label: "Data Ownership and Processing" },
  { id: "payment", label: "Payment and Billing" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "ip", label: "Intellectual Property" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

const bodyClass = "text-[16px] leading-[1.65] text-[#1A1A1D]";
const headingClass = "text-[22px] font-medium tracking-[-0.018em]";

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8] text-[#0A0A0B]">
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
          Terms of Service &amp; End-User License Agreement
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[#5E6472]">
          Effective Date: June 1, 2026 · Last Updated: June 24, 2026 ·
          Facility 19 / WeLaunch Inc.
        </p>
        <p className={`mt-8 ${bodyClass}`}>
          Please read these Terms of Service and End-User License Agreement
          (&ldquo;Agreement&rdquo;) carefully before using the Facility 19
          platform. By accessing or using our services, you (&ldquo;Client,&rdquo;
          &ldquo;User,&rdquo; or &ldquo;you&rdquo;) agree to be bound by this
          Agreement. If you do not agree, do not use our services.
        </p>

        <nav className="mt-12 rounded-lg border border-[#E5E4DE] bg-[#F3F3EF] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#5E6472]">
            Contents
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] text-[#1A1A1D]">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[#3D4DDB] underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 space-y-12">
          <section id="services">
            <h2 className={headingClass}>1. Services Description</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Facility 19 (operated by WeLaunch Inc.) provides an AI-powered
              back-office automation platform for facility management companies.
              Our services include, but are not limited to:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>
                AI agent suite (ASIS) for automating payroll aggregation, HR
                workflows, asset management, fleet tracking, and expense
                reconciliation.
              </li>
              <li>
                Employee and technician portals for submitting overtime, leave
                requests, and accessing work history.
              </li>
              <li>
                Integrations with accounting, payroll, field service management,
                and other third-party business platforms you authorize.
              </li>
              <li>
                Voice and text-based agent interfaces powered by integrated
                communication platforms.
              </li>
            </ul>
            <p className={`mt-5 ${bodyClass}`}>
              We reserve the right to modify, suspend, or discontinue any
              feature of our platform at any time with reasonable notice to active
              clients.
            </p>
          </section>

          <section id="license">
            <h2 className={headingClass}>2. License Grant</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Subject to your compliance with this Agreement and timely payment
              of applicable fees, Facility 19 grants you a limited,
              non-exclusive, non-transferable, revocable license to access and
              use our platform solely for your internal business operations.
            </p>
            <p className={`mt-5 font-medium ${bodyClass}`}>You may not:</p>
            <ul className={`mt-3 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>
                Sublicense, resell, or redistribute access to the platform or its
                components.
              </li>
              <li>
                Reverse engineer, decompile, or attempt to extract source code
                from our software.
              </li>
              <li>Use the platform to build a competing product or service.</li>
              <li>
                Access the platform through automated means not authorized by us
                (other than through integrations we provide).
              </li>
            </ul>
          </section>

          <section id="acceptable-use">
            <h2 className={headingClass}>3. Acceptable Use</h2>
            <p className={`mt-4 ${bodyClass}`}>
              You agree to use our platform only for lawful purposes and in
              accordance with this Agreement. You will not:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>
                Provide false, misleading, or fraudulent information to the
                platform or its agents.
              </li>
              <li>
                Attempt to gain unauthorized access to any system, account, or
                data connected to the platform.
              </li>
              <li>
                Transmit harmful code, malware, or disruptive content through our
                systems.
              </li>
              <li>
                Use our services in violation of any applicable law, regulation,
                or third-party agreement.
              </li>
              <li>
                Circumvent any security or access control measures we implement.
              </li>
            </ul>
            <p className={`mt-5 ${bodyClass}`}>
              We reserve the right to suspend or terminate access for any user or
              organization that violates these acceptable use standards, with or
              without prior notice depending on severity.
            </p>
          </section>

          <section id="integrations">
            <h2 className={headingClass}>4. Third-Party Integrations</h2>
            <p className={`mt-4 ${bodyClass}`}>
              This section governs your use of third-party platforms connected to
              Facility 19.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              Our platform integrates with third-party services including
              accounting and payroll systems, field service management platforms,
              expense management tools, fleet systems, and communication
              providers (&ldquo;Third-Party Services&rdquo;). By connecting a
              Third-Party Service to Facility 19, you authorize us to access,
              read, and write data within that service as necessary to deliver
              the automation workflows you have contracted.
            </p>
            <ul className={`mt-5 space-y-4 ${bodyClass}`}>
              <li>
                <span className="font-medium">Scope of access:</span> We access
                only the data required to perform our contracted services for
                each connected integration. We do not access data beyond the
                authorized scope.
              </li>
              <li>
                <span className="font-medium">Data use restriction:</span> Data
                accessed from any Third-Party Service will not be used for any
                purpose other than providing your contracted Facility 19
                services. We will not sell, share, or use this data for AI model
                training or any secondary commercial purpose.
              </li>
              <li>
                <span className="font-medium">Third-party terms:</span> Your use
                of any Third-Party Service through our integration remains
                subject to that provider&apos;s own terms of service and privacy
                policy. Facility 19 is not responsible for the practices of
                Third-Party Service providers.
              </li>
              <li>
                <span className="font-medium">Revoking access:</span> You may
                disconnect any Third-Party Service from our platform at any time
                through your account settings or by contacting us. Revocation
                will disable automation services that depend on that connection.
              </li>
              <li>
                <span className="font-medium">No endorsement:</span> The
                availability of a third-party integration does not constitute an
                endorsement, partnership, or affiliation with that provider.
              </li>
            </ul>
          </section>

          <section id="data">
            <h2 className={headingClass}>5. Data Ownership and Processing</h2>
            <p className={`mt-4 ${bodyClass}`}>
              You retain full ownership of all data you provide to or generate
              through the Facility 19 platform, including employee records,
              financial data, business operational data, and any other content.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              Facility 19 acts as a data processor on your behalf. We process your
              data only as instructed by you through your use of the platform and
              in accordance with our{" "}
              <Link
                href="/privacy"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              . We do not claim any ownership rights over your business data.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              You are responsible for ensuring you have the right to provide any
              data you submit to our platform, including employee data, and for
              complying with applicable employment, privacy, and data protection
              laws.
            </p>
          </section>

          <section id="payment">
            <h2 className={headingClass}>6. Payment and Billing</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Fees for our services are set forth in your service agreement or
              order form. Unless otherwise specified:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>Fees are billed in advance on a monthly or annual basis.</li>
              <li>
                All fees are non-refundable except as expressly stated in your
                service agreement.
              </li>
              <li>
                We reserve the right to suspend service for accounts with overdue
                balances after reasonable notice.
              </li>
              <li>
                Fee changes will be communicated at least 30 days before taking
                effect.
              </li>
            </ul>
          </section>

          <section id="confidentiality">
            <h2 className={headingClass}>7. Confidentiality</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Each party agrees to keep confidential any non-public information
              received from the other party in connection with this Agreement,
              including business strategies, technical systems, employee data, and
              financial information. This obligation survives termination of the
              Agreement for a period of three (3) years.
            </p>
          </section>

          <section id="ip">
            <h2 className={headingClass}>8. Intellectual Property</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Facility 19 and its licensors retain all intellectual property
              rights in the platform, including software, AI models, agent
              architectures, interfaces, and documentation. Nothing in this
              Agreement transfers any IP rights to you beyond the limited
              license granted in Section 2.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              You grant Facility 19 a limited license to use your data solely as
              necessary to provide the services you have contracted. This license
              does not extend to any secondary use of your data.
            </p>
          </section>

          <section id="disclaimers">
            <h2 className={headingClass}>9. Disclaimers</h2>
            <p className={`mt-4 text-[15px] leading-[1.7] text-[#1A1A1D]`}>
              THE FACILITY 19 PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND
              &ldquo;AS AVAILABLE.&rdquo; WE MAKE NO WARRANTIES, EXPRESS OR
              IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, OR UNINTERRUPTED SERVICE. AI-GENERATED
              OUTPUTS, INCLUDING PAYROLL CALCULATIONS, OVERTIME VERIFICATIONS,
              AND ASSET DATA, SHOULD BE REVIEWED BY QUALIFIED PERSONNEL BEFORE
              BEING RELIED UPON FOR BUSINESS DECISIONS.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              We do not warrant that our platform will be error-free or that all
              automation outputs will be accurate. Human review is required for
              all high-stakes decisions including payroll finalization.
            </p>
          </section>

          <section id="liability">
            <h2 className={headingClass}>10. Limitation of Liability</h2>
            <p className={`mt-4 ${bodyClass}`}>
              To the maximum extent permitted by law, Facility 19&apos;s total
              liability for any claim arising out of or related to this Agreement
              shall not exceed the total fees paid by you in the twelve (12)
              months preceding the claim.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              In no event shall Facility 19 be liable for indirect, incidental,
              special, consequential, or punitive damages, including lost profits,
              lost data, or business interruption, even if we have been advised
              of the possibility of such damages.
            </p>
          </section>

          <section id="termination">
            <h2 className={headingClass}>11. Termination</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Either party may terminate this Agreement with thirty (30) days
              written notice. We may terminate immediately if you materially
              breach this Agreement and fail to cure the breach within ten (10)
              days of notice.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              Upon termination, your license to use the platform ends
              immediately. We will provide you a reasonable opportunity to export
              your data for a period of thirty (30) days following termination.
            </p>
          </section>

          <section id="governing-law">
            <h2 className={headingClass}>12. Governing Law</h2>
            <p className={`mt-4 ${bodyClass}`}>
              This Agreement is governed by the laws of the State of New York,
              without regard to its conflict of laws principles. Any disputes
              arising under this Agreement shall be resolved in the state or
              federal courts located in New York County, New York, and both
              parties consent to the exclusive jurisdiction of those courts.
            </p>
            <p className={`mt-4 ${bodyClass}`}>
              If any provision of this Agreement is found to be unenforceable,
              the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section id="contact">
            <h2 className={headingClass}>13. Contact</h2>
            <p className={`mt-4 ${bodyClass}`}>
              For questions about this Agreement or our services:
            </p>
            <address className={`mt-4 not-italic ${bodyClass}`}>
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
          </section>
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

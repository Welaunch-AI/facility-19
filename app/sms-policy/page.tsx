import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";

const bodyClass = "text-[16px] leading-[1.65] text-[#1A1A1D]";
const headingClass = "text-[22px] font-medium tracking-[-0.018em]";

export default function SmsPolicyPage() {
  return (
    <div className="sms-shell min-h-dvh bg-[#FAFAF8] text-[#0A0A0B]">
      <header className="border-b border-[#E5E4DE]">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-7 py-6">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-70"
            aria-label="WeLaunch"
          >
            <img
              src="/logo/welaunch-logo-black.svg"
              alt="WeLaunch"
              className="h-[22px] w-auto"
            />
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
          SMS Policy
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[#5E6472]">
          WeLaunch / WeLaunch Inc.
        </p>

        <div className="mt-14 space-y-12">
          <section>
            <h2 className={headingClass}>1. Overview</h2>
            <p className={`mt-4 ${bodyClass}`}>
              This SMS Policy explains how WeLaunch (&ldquo;we,&rdquo;
              &ldquo;our,&rdquo; &ldquo;us&rdquo;) uses text messaging (SMS/MMS)
              to communicate with individuals who have opted in to receive
              messages from us, and how WeLaunch supports SMS messaging on
              behalf of the businesses and AI agentic systems we build and
              operate for our clients.
            </p>
            <p className={`mt-5 ${bodyClass}`}>
              This Policy works alongside our{" "}
              <Link
                href="/legal/terms-of-service"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              . By opting in to receive SMS messages from WeLaunch or from a
              business using WeLaunch&apos;s systems, you agree to the terms
              below.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>2. Consent &amp; Opt In</h2>
            <p className={`mt-4 ${bodyClass}`}>
              We only send SMS messages to individuals who have provided express
              consent, such as by:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>
                Submitting a form on our website or a client website that
                includes SMS consent language
              </li>
              <li>Texting a keyword to one of our numbers</li>
              <li>
                Providing a phone number during a call, booking, or onboarding
                flow and agreeing to receive texts
              </li>
              <li>
                Otherwise affirmatively opting in through a compliant consent
                mechanism
              </li>
            </ul>
            <p className={`mt-5 ${bodyClass}`}>
              Consent to receive SMS messages is never a condition of purchasing
              any product or service.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>3. Message Types &amp; Frequency</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Depending on the program you opt in to, you may receive messages
              related to:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>Appointment reminders and scheduling</li>
              <li>Customer service and support</li>
              <li>Account or order updates</li>
              <li>Lead follow up and re-engagement</li>
              <li>Marketing and promotional offers</li>
              <li>
                AI voice agent or AI employee follow up related to a business
                you have contacted
              </li>
            </ul>
            <p className={`mt-5 ${bodyClass}`}>
              Message frequency varies by program and business. Frequency will
              be disclosed at the point of opt in where required.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>4. Opt Out</h2>
            <p className={`mt-4 ${bodyClass}`}>
              You may opt out of SMS messages at any time by replying STOP to
              any message. After opting out, you will receive a one time
              confirmation message and no further messages, except where legally
              required.
            </p>
            <p className={`mt-5 ${bodyClass}`}>
              You may also opt out by contacting{" "}
              <a
                href="mailto:Support@welaunch.ai"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Support@welaunch.ai
              </a>{" "}
              directly.
            </p>
            <p className={`mt-5 ${bodyClass}`}>
              If you experience issues, reply HELP to any message for
              assistance, or contact{" "}
              <a
                href="mailto:Support@welaunch.ai"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Support@welaunch.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={headingClass}>5. Carrier Disclaimer</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Carriers are not liable for delayed or undelivered messages.
              Message delivery is subject to effective transmission from your
              network operator.
            </p>
            <p className={`mt-5 ${bodyClass}`}>
              Supported carriers may include, but are not limited to, major US
              carriers. Not all carriers may be supported at all times.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>6. AI &amp; Automated Messaging</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Some SMS communications sent by WeLaunch or by the businesses we
              build systems for are generated or triggered by AI agentic
              systems, including automated follow up, re-engagement sequences,
              and AI employee workflows.
            </p>
            <p className={`mt-5 ${bodyClass}`}>You acknowledge that:</p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>
                Messages may be generated automatically based on prior
                interactions, forms, or call activity
              </li>
              <li>
                A human may not review every individual message before it is
                sent
              </li>
              <li>
                You may opt out of automated messaging at any time using the
                instructions in the Opt Out section above
              </li>
            </ul>
          </section>

          <section>
            <h2 className={headingClass}>7. Data Use</h2>
            <p className={`mt-4 ${bodyClass}`}>
              Phone numbers and SMS interaction data collected through opt in
              are used only to deliver the communications you have consented to
              receive, and to support the services described in our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#3D4DDB] underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className={`mt-5 ${bodyClass}`}>
              We do not sell phone numbers or SMS opt in data. We do not share
              phone numbers with third parties for their own independent
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>8. Compliance</h2>
            <p className={`mt-4 ${bodyClass}`}>
              WeLaunch and the systems we build for clients are designed to
              operate in accordance with:
            </p>
            <ul className={`mt-5 list-disc space-y-3 pl-5 ${bodyClass}`}>
              <li>The Telephone Consumer Protection Act (TCPA)</li>
              <li>CTIA messaging guidelines</li>
              <li>Carrier and A2P 10DLC registration requirements</li>
              <li>Applicable state and federal messaging regulations</li>
            </ul>
            <p className={`mt-5 ${bodyClass}`}>
              Clients using WeLaunch systems to send SMS are responsible for
              maintaining their own valid consent records and complying with
              applicable law in their jurisdiction and industry.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>9. Changes to This Policy</h2>
            <p className={`mt-4 ${bodyClass}`}>
              WeLaunch may update this SMS Policy at any time. Updated versions
              become effective immediately upon posting on the website.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>10. Contact Information</h2>
            <p className={`mt-4 ${bodyClass}`}>
              For questions about this SMS Policy or to report an issue:
            </p>
            <address className={`mt-4 not-italic ${bodyClass}`}>
              <p className="font-medium">WeLaunch / WeLaunch Inc.</p>
              <p className="mt-2">530 5th Avenue, New York, NY 10036</p>
              <p className="mt-2">
                Website:{" "}
                <a
                  href="https://www.welaunch.ai"
                  className="text-[#3D4DDB] underline-offset-2 hover:underline"
                >
                  https://www.welaunch.ai
                </a>
              </p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:Support@welaunch.ai"
                  className="text-[#3D4DDB] underline-offset-2 hover:underline"
                >
                  Support@welaunch.ai
                </a>
              </p>
              <p className="mt-2">
                Phone:{" "}
                <a
                  href="tel:+13077619792"
                  className="text-[#3D4DDB] underline-offset-2 hover:underline"
                >
                  +1 (307) 761-9792
                </a>
              </p>
            </address>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

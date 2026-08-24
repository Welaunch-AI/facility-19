import Link from "next/link";
import { ArrowRight } from "@/components/marketing-nav";
import { WalkthroughLeadForm } from "@/components/walkthrough-lead-form";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";

export function MarketingContactSection() {
  return (
    <section id="contact" className="f19-contact-section">
      <div className="f19-contact-wrap">
        <div className="f19-contact-card">
          <div className="f19-contact-card__glow" aria-hidden />
          <div className="f19-contact-card__body">
            <div className="f19-contact-intro">
              <div className="f19-contact-eyebrow">Two minutes with Aria</div>
              <h2 className="f19-contact-title">
                Your team is good.{" "}
                <span>Aria makes them unstoppable.</span>
              </h2>
              <p className="f19-contact-lede">
                Tell Aria what is breaking in your operation. She matches you
                with the right agent, explains how it wires into your stack, and
                walks you through what it costs, right now.
              </p>
              <div className="f19-contact-actions">
                <Link className="btn btn-brand" href="/talk-to-aria">
                  Talk to Aria, free, no sign-up <ArrowRight />
                </Link>
                <a
                  className="btn btn-ghost f19-contact-book"
                  href={CAL_DEMO_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book a 30-min call
                </a>
              </div>
              <div className="f19-contact-bullets">
                <span>· No pitch deck</span>
                <span>· No three-week waiting game</span>
                <span>· Walkthrough tailored to your industry</span>
              </div>
            </div>
            <WalkthroughLeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}

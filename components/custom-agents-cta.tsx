import { CUSTOM_AGENTS_EMAIL } from "@/lib/custom-agents-cta";

export function CustomAgentsCta({ className }: { className?: string }) {
  return (
    <p className={className ?? "mt-4 text-[15px] leading-relaxed text-[#5E6472]"}>
      To build custom agents for your company, please reach out at{" "}
      <a
        href={`mailto:${CUSTOM_AGENTS_EMAIL}`}
        className="font-medium text-[#3D4DDB] underline underline-offset-2"
      >
        {CUSTOM_AGENTS_EMAIL}
      </a>
      .
    </p>
  );
}

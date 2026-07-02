export const CUSTOM_AGENTS_EMAIL = "aviral@welaunch.ai";

export const CUSTOM_AGENTS_CTA =
  `To build custom agents for your company, please reach out at ${CUSTOM_AGENTS_EMAIL}.`;

/** Append the custom-agents CTA when a skipped reason is shown (idempotent). */
export function withCustomAgentsCta(message: string): string {
  if (message.includes(CUSTOM_AGENTS_EMAIL)) return message;
  return `${message.trim()} ${CUSTOM_AGENTS_CTA}`;
}

/** Strip the CTA suffix so UI can show a mailto link instead of plain text. */
export function displaySkippedReason(message?: string): string | undefined {
  if (!message) return undefined;
  const marker = " To build custom agents";
  const idx = message.indexOf(marker);
  return idx === -1 ? message : message.slice(0, idx).trim();
}

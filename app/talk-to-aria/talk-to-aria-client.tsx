"use client";

import { ConversationProvider } from "@elevenlabs/react";
import { VoiceAgent, VoiceAgentHeader } from "@/components/voice-agent";

export default function TalkToAriaClient() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-[#FAFAF8] to-[#EDEDE8]/80 px-6 py-12">
      <VoiceAgentHeader />
      <ConversationProvider>
        <VoiceAgent />
      </ConversationProvider>
      <footer className="mt-16 text-xs text-[#8A8F9C]" aria-hidden>
        &nbsp;
      </footer>
    </main>
  );
}

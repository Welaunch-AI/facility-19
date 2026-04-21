"use client";

import { ConversationProvider } from "@elevenlabs/react";
import { VoiceAgent, VoiceAgentHeader } from "@/components/voice-agent";

export default function TalkToAriaClient() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 py-14 font-sans text-[#0A0A0B]">
      <div className="flex w-full max-w-md flex-col items-center">
        <VoiceAgentHeader />
        <ConversationProvider>
          <VoiceAgent />
        </ConversationProvider>
      </div>
    </main>
  );
}

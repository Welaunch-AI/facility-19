import type { Metadata } from "next";
import { TalkBodyUnlock } from "./talk-body-unlock";

export const metadata: Metadata = {
  title: "F19 Agent — Voice Conversation | Facility19",
  description:
    "Talk to Aria: real-time voice conversation powered by ElevenLabs. Start from your browser.",
  openGraph: {
    title: "F19 Agent — Voice Conversation",
    description: "Real-time voice conversations with Facility19.",
  },
};

export default function TalkToAriaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TalkBodyUnlock />
      {children}
    </>
  );
}

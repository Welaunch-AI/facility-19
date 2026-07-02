import type { Metadata } from "next";
import { TalkBodyUnlock } from "./talk-body-unlock";

export const metadata: Metadata = {
  title: "F19 Agent | Voice Conversation | Facility19",
  description:
    "Talk to Aria: real-time voice conversation powered by ElevenLabs. Start from your browser.",
  openGraph: {
    title: "F19 Agent | Voice Conversation",
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
      {/* Fraunces serif display font for Aria console */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}

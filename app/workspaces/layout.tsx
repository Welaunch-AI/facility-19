import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Workspaces | WeLaunch",
  description: "Manage your WeLaunch workspaces.",
};

export default function WorkspacesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

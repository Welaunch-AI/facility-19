import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Workspaces | Facility19",
  description: "Manage your Facility 19 workspaces.",
};

export default function WorkspacesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

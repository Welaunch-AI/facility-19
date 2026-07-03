"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="app-shell-btn app-shell-btn-ghost h-10 px-4 text-[14px] text-[#5E6472] hover:text-[#0A0A0B]"
    >
      Log out
    </button>
  );
}

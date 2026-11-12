"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="col-span-2 w-fit justify-self-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-100 sm:col-auto sm:justify-self-auto sm:py-1.5"
    >
      Sair
    </button>
  );
}

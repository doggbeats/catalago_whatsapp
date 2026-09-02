import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_auth")?.value === "1";

  if (!authed) {
    redirect("/login");
  }

  const links = [
    { href: "/admin", label: "Produtos" },
    { href: "/admin/pedidos", label: "Pedidos" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-black">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            Painel Admin
          </div>
          <nav className="flex items-center gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-black"
              >
                {l.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}

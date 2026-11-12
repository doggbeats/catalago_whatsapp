import { redirect } from "next/navigation";
import Link from "next/link";
import { getProdutos } from "@/lib/produtos";
import { getPedidos } from "@/lib/pedidos";
import { ESTOQUE_BAIXO } from "@/lib/estoque";
import { AVISO_SOMENTE_LEITURA, somenteLeitura } from "@/lib/ambiente";
import LogoutButton from "./logout-button";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/login");
  }

  const produtos = await getProdutos();
  const baixos = produtos.filter((p) => p.quantity <= ESTOQUE_BAIXO);
  const semEstoque = produtos.filter((p) => p.quantity <= 0);

  const pedidos = await getPedidos().catch(() => []);
  const pendentes = pedidos.filter(
    (p) => p.status === "aguardando" || p.status === "confirmado",
  ).length;

  const links = [
    { href: "/admin", label: "Produtos", badge: 0, badgeClass: "" },
    {
      href: "/admin/pedidos",
      label: "Vendas",
      badge: pendentes,
      badgeClass: "bg-amber-500",
    },
    {
      href: "/admin/estoque",
      label: "Estoque",
      badge: baixos.length,
      badgeClass: "bg-red-500",
    },
    { href: "/admin/senha", label: "Senha", badge: 0, badgeClass: "" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-2 font-bold text-black">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-black text-white">
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
          <nav className="grid w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:items-center sm:gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-center rounded-lg px-2 py-2 text-xs font-medium text-black transition hover:bg-slate-100 hover:text-black sm:px-4 sm:text-sm"
              >
                {l.label}
                {l.badge ? (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white ${l.badgeClass}`}
                  >
                    {l.badge}
                  </span>
                ) : null}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </div>

      {somenteLeitura ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-6xl px-4 py-2 text-sm text-black">
            {AVISO_SOMENTE_LEITURA}
          </div>
        </div>
      ) : null}

      {baixos.length ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 text-sm text-black">
            <span className="font-semibold">⚠ Alerta de estoque:</span>
            <span>
              {baixos.length}{" "}
              {baixos.length === 1
                ? "produto está com estoque baixo ou esgotado"
                : "produtos estão com estoque baixo ou esgotados"}
              {semEstoque.length
                ? ` (${semEstoque.length} sem estoque)`
                : ""}
              .
            </span>
            <Link
              href="/admin/estoque"
              className="font-semibold underline underline-offset-2 hover:text-amber-700"
            >
              Ver estoque
            </Link>
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}

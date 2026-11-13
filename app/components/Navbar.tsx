"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CarrinhoBotao from "./CarrinhoBotao";
import FavoritosBotao from "./FavoritosBotao";

const marcasPadrao: string[] = [];

const categories = (marcas: string[]) => {
  const marcasOrdenadas = [...marcas].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const indiceVans = marcasOrdenadas.findIndex(
    (marca) => marca.trim().toLocaleLowerCase("pt-BR") === "vans",
  );
  const marcasAteVans =
    indiceVans >= 0 ? marcasOrdenadas.slice(0, indiceVans + 1) : marcasOrdenadas;
  const marcasVisiveis = marcasAteVans.slice(0, 5);

  return [
    { href: "/tipos", label: "Tipos de Calçados" },
    {
      href: "#",
      label: "Gêneros",
      submenu: [
        { href: "/produtos?categoria=Masculino", label: "Masculino" },
        { href: "/produtos?categoria=Feminino", label: "Feminino" },
        { href: "/produtos?categoria=Infantil", label: "Infantil" },
      ],
    },
    {
      href: "/marcas",
      label: "Marcas",
      submenu: [
        ...marcasVisiveis.map((marca) => ({
          href: `/produtos?marca=${encodeURIComponent(marca)}`,
          label: marca,
        })),
      ],
    },
    { href: "/produtos?promo=sim", label: "Promoções" },
    { href: "/contato", label: "Contato" },
  ];
};

export default function Navbar({
  marcas = marcasPadrao,
}: {
  marcas?: string[];
}) {
  const menu = categories(marcas);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [busca, setBusca] = useState("");

  function buscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = busca.trim();
    router.push(q ? `/produtos?busca=${encodeURIComponent(q)}` : "/produtos");
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${
        isHome
          ? "relative z-50 bg-neutral-950 lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent"
          : "sticky top-0 z-50 bg-neutral-950"
      } transition-shadow ${scrolled && !isHome ? "shadow-lg shadow-black/30" : ""}`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center gap-3 px-3 md:h-24 md:px-4">
        <Link
          href="/"
          aria-label="WELL FASHION - ir para a página inicial"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo1.png"
            alt="WELL FASHION - Os melhores tênis com os melhores preços"
            width={400}
            height={126}
            priority
            className="h-14 w-auto md:h-15"
          />
        </Link>

        <ul className="ml-4 hidden flex-1 items-center justify-center gap-1 xl:ml-6 lg:flex">
          {menu.map((cat) => (
            <li key={cat.label} className={cat.submenu ? "group relative" : ""}>
              {cat.submenu ? (
                <>
                  <button
                    type="button"
                    className="group relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium xl:px-3.5 xl:text-base text-slate-200 transition hover:text-white"
                  >
                    {cat.label}
                    <svg
                      className="h-4 w-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />
                  </button>
                  <div className={`invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${cat.label === "Marcas" ? "w-[min(20rem,90vw)]" : "w-64"}`}>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 p-3 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                      <div className="mb-2 flex items-center justify-between border-b border-white/10 px-2 pb-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">Explore</p>
                          <p className="mt-1 text-sm font-semibold text-white">{cat.label === "Marcas" ? "Escolha sua marca" : "Encontre seu estilo"}</p>
                        </div>
                        {cat.label === "Marcas" ? (
                          <Link href="/marcas" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-400/60 hover:text-amber-300">Ver todas <span aria-hidden="true">→</span></Link>
                        ) : null}
                      </div>
                      <ul className={cat.label === "Marcas" ? "max-h-[min(60vh,24rem)] space-y-1 overflow-y-auto overscroll-contain pr-1" : "space-y-1"}>
                        {cat.submenu.map((sub, index) => (
                          <li key={`${sub.href}-${sub.label}`}>
                            <Link
                              href={sub.href}
                              className="group/item flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            >
                              {cat.label !== "Marcas" ? (
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-bold uppercase text-amber-300 transition group-hover/item:border-amber-400/30 group-hover/item:bg-amber-400/10">
                                  {sub.label.charAt(0)}
                                </span>
                              ) : null}
                              <span className="min-w-0 flex-1 truncate font-medium">{sub.label}</span>
                              <span aria-hidden="true" className="text-slate-600 transition group-hover/item:translate-x-0.5 group-hover/item:text-amber-300">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : cat.label === "Contato" ? (
                <a
                  href="/contato"
                  className="group relative inline-flex items-center rounded-md px-3 py-2 text-[15px] font-medium xl:px-3.5 xl:text-base text-slate-200 transition hover:text-white"
                >
                  {cat.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ) : (
                <Link
                  href={cat.href}
                  className="group relative inline-flex items-center rounded-md px-3 py-2 text-[15px] font-medium xl:px-3.5 xl:text-base text-slate-200 transition hover:text-white"
                >
                  {cat.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={buscar} role="search" className="hidden items-center md:flex">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar tênis..."
                aria-label="Buscar produtos"
                className="h-10 w-36 rounded-full border border-slate-300 bg-white pl-9 pr-3 text-sm text-black outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/40 xl:w-56"
              />
            </div>
          </form>

          <CarrinhoBotao />
          <FavoritosBotao />

          <Link
            href="/admin"
            aria-label="Painel administrativo"
            title="Painel Admin"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-amber-500 hover:bg-white/10 hover:text-amber-400 xl:inline-flex"
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-800 bg-neutral-950 px-4 py-3 shadow-lg lg:hidden">
          <form onSubmit={buscar} role="search" className="mb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar tênis..."
                aria-label="Buscar produtos"
                className="h-11 w-full rounded-full border border-slate-300 bg-white pl-9 pr-3 text-base text-black outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-full bg-amber-400 px-4 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Buscar
            </button>
          </form>

          <ul className="space-y-1">
            {menu.map((cat) => (
              <li key={cat.label}>
                {cat.submenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSubmenuAberto((v) => (v === cat.label ? null : cat.label))
                      }
                      aria-expanded={submenuAberto === cat.label}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:text-amber-400"
                    >
                      {cat.label}
                      <svg
                        className={`h-4 w-4 transition-transform ${submenuAberto === cat.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {submenuAberto === cat.label && (
                      <>
                        <ul className={`ml-3 mt-1 border-l border-slate-800 pl-3 ${cat.label === "Marcas" ? "max-h-[40vh] space-y-1 overflow-y-auto overscroll-contain" : "space-y-1"}`}>
                          {cat.submenu.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-amber-300"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {cat.label === "Marcas" ? (
                          <Link
                            href="/marcas"
                            onClick={() => setOpen(false)}
                            className="ml-6 mt-2 inline-flex rounded-full border border-amber-400/40 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/10"
                          >
                            Ver todas <span className="ml-1" aria-hidden="true">→</span>
                          </Link>
                        ) : null}
                      </>
                    )}
                  </>
                ) : cat.label === "Contato" ? (
                  <a
                    href="/contato"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:text-amber-400"
                  >
                    {cat.label}
                  </a>
                ) : (
                  <Link
                    href={cat.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:text-amber-400"
                  >
                    {cat.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/carrinho"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:text-amber-400"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M2.25 3h1.5l2.1 10.5a1.5 1.5 0 001.47 1.2h9.36a1.5 1.5 0 001.46-1.15L20.25 6H5.1"
                  />
                  <circle cx="9" cy="19.5" r="1.5" />
                  <circle cx="17.25" cy="19.5" r="1.5" />
                </svg>
                Carrinho
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition hover:text-amber-400"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Painel Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

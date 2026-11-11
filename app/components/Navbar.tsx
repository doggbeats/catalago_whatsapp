"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CarrinhoBotao from "./CarrinhoBotao";

const marcas = ["Adidas", "New Balance", "Mizuno", "Nike"];

const categories = [
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
      { href: "/marcas", label: "Todas as marcas" },
      ...marcas.map((marca) => ({
        href: `/produtos?marca=${encodeURIComponent(marca)}`,
        label: marca,
      })),
    ],
  },
  { href: "/produtos?promo=sim", label: "Promoções" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
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
      className={`sticky top-0 z-50 bg-neutral-950 transition-shadow ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center gap-3 px-3 md:h-24 md:px-4">
        <Link
          href="/"
          aria-label="TENIS NEON - ir para a página inicial"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo1.png"
            alt="TENIS NEON"
            width={418}
            height={146}
            priority
            className="h-14 w-auto md:h-20"
          />
        </Link>

        <ul className="ml-4 hidden flex-1 items-center justify-center gap-1 xl:ml-6 lg:flex">
          {categories.map((cat) => (
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
                  <div className="invisible absolute left-0 top-full mt-1 w-44 rounded-lg border border-slate-800 bg-neutral-900 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <ul className="py-1">
                      {cat.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block px-4 py-2 text-base text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
                className="h-10 w-36 rounded-full border border-slate-700 bg-white/5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:bg-white/10 xl:w-56"
              />
            </div>
          </form>

          <CarrinhoBotao />

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
                className="h-11 w-full rounded-full border border-slate-700 bg-white/5 pl-9 pr-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:bg-white/10"
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
            {categories.map((cat) => (
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
                      <ul className="ml-3 mt-1 space-y-1 border-l border-slate-800 pl-3">
                        {cat.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-base text-slate-400 transition hover:text-amber-400"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
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
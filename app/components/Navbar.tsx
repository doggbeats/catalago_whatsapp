"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

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
  { href: "/marcas", label: "Marcas" },
  { href: "/produtos?promo=sim", label: "Promoções" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [generoOpen, setGeneroOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4 md:h-24">
        <Link
          href="/"
          aria-label="TENIS NEON - ir para a página inicial"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/tenis_neon.png"
            alt="TENIS NEON"
            width={1774}
            height={887}
            priority
            className="h-14 w-auto md:h-[4.5rem]"
          />
        </Link>

        <ul className="ml-6 hidden flex-1 items-center justify-center gap-1 lg:flex">
          {categories.map((cat) => (
            <li key={cat.label} className={cat.submenu ? "group relative" : ""}>
              {cat.submenu ? (
                <>
                  <button
                    type="button"
                    className="group relative inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-base font-medium text-slate-700 transition hover:text-black"
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
                  <div className="invisible absolute left-0 top-full mt-1 w-44 rounded-lg border border-slate-200 bg-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <ul className="py-1">
                      {cat.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block px-4 py-2 text-base text-slate-700 transition hover:bg-amber-50 hover:text-black"
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
                  href="#contato"
                  className="group relative inline-flex items-center rounded-md px-3.5 py-2 text-base font-medium text-slate-700 transition hover:text-black"
                >
                  {cat.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ) : (
                <Link
                  href={cat.href}
                  className="group relative inline-flex items-center rounded-md px-3.5 py-2 text-base font-medium text-slate-700 transition hover:text-black"
                >
                  {cat.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amber-400 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700 sm:inline-flex"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>

          <Link
            href="/admin"
            aria-label="Painel administrativo"
            title="Painel Admin"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 lg:inline-flex"
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 hover:text-black lg:hidden"
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
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.label}>
                {cat.submenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setGeneroOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:text-amber-600"
                    >
                      {cat.label}
                      <svg
                        className={`h-4 w-4 transition-transform ${generoOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {generoOpen && (
                      <ul className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3">
                        {cat.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-base text-slate-600 transition hover:text-amber-600"
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
                    href="#contato"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:text-amber-600"
                  >
                    {cat.label}
                  </a>
                ) : (
                  <Link
                    href={cat.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:text-amber-600"
                  >
                    {cat.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:text-amber-600"
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
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
            className="mt-3 flex h-12 w-12 items-center justify-center self-center rounded-full bg-green-600 text-white transition hover:bg-green-700"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      )}
    </header>
  );
}
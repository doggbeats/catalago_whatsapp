"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { href: "/produtos?categoria=Áudio", label: "Áudio" },
  { href: "/produtos?categoria=Computadores", label: "Computadores" },
  { href: "/produtos?categoria=Periféricos", label: "Periféricos" },
  { href: "/produtos?categoria=Ferramentas", label: "Ferramentas" },
  { href: "/produtos?categoria=Videogames", label: "Videogames" },
  { href: "/produtos?categoria=Monitores", label: "Monitores" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:h-16">
        <form action="/produtos" method="get" className="relative hidden items-center justify-self-start md:flex">
          <input
            name="busca"
            type="search"
            placeholder="Buscar produtos..."
            className="w-56 rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-3.5 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/30 lg:w-72"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="pointer-events-auto absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
          >
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
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
          </button>
        </form>

        <Link
          href="/"
          className="hidden items-center justify-self-center text-lg font-extrabold tracking-tight text-black md:flex"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-lg text-white shadow-sm shadow-blue-600/20">
            ⚡
          </span>
          <span className="ml-2.5 leading-none">ELECTRICS</span>
        </Link>

        <div className="flex items-center gap-1.5 justify-self-end">
          <Link
            href="/admin"
            aria-label="Painel administrativo"
            title="Painel Admin"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <nav className="hidden border-t border-slate-100 bg-white md:block">
        <ul className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2">
          {categories.map((cat) => (
            <li key={cat.label}>
              <Link
                href={cat.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-black"
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-black"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

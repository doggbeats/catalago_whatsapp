"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { assinarFavoritos, lerFavoritos } from "@/lib/favoritos";

export default function FavoritosBotao() {
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    const atualizar = () => setQuantidade(lerFavoritos().length);
    atualizar();
    return assinarFavoritos(atualizar);
  }, []);

  return (
    <Link
      href="/favoritos"
      aria-label={`Favoritos${quantidade ? `: ${quantidade} salvos` : ""}`}
      title="Favoritos"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-amber-500 hover:bg-white/10 hover:text-rose-400"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      </svg>
      {quantidade > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
          {quantidade > 99 ? "99+" : quantidade}
        </span>
      ) : null}
    </Link>
  );
}

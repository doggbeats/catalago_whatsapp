"use client";

import { useEffect, useState } from "react";
import {
  alternarFavorito,
  assinarFavoritos,
  lerFavoritos,
} from "@/lib/favoritos";

export default function BotaoFavorito({
  produtoId,
  className = "",
}: {
  produtoId: number;
  className?: string;
}) {
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const atualizar = () => setSalvo(lerFavoritos().includes(produtoId));
    atualizar();
    return assinarFavoritos(atualizar);
  }, [produtoId]);

  return (
    <button
      type="button"
      onClick={(evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        const favoritos = alternarFavorito(produtoId);
        setSalvo(favoritos.includes(produtoId));
      }}
      aria-label={salvo ? "Remover dos favoritos" : "Salvar nos favoritos"}
      aria-pressed={salvo}
      title={salvo ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className={`grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-rose-600 shadow-sm transition hover:scale-105 hover:bg-white ${className}`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={salvo ? "currentColor" : "none"}
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
    </button>
  );
}

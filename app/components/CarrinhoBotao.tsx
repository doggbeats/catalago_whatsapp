"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { assinarCarrinho, contarItens, lerCarrinho } from "@/lib/carrinho";

export default function CarrinhoBotao() {
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    const atualizar = () => setQuantidade(contarItens(lerCarrinho()));
    atualizar();
    return assinarCarrinho(atualizar);
  }, []);

  return (
    <Link
      href="/carrinho"
      aria-label={
        quantidade > 0
          ? `Carrinho com ${quantidade} ${quantidade === 1 ? "item" : "itens"}`
          : "Carrinho de compras"
      }
      title="Carrinho"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-amber-500 hover:bg-white/10 hover:text-amber-400"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
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

      {quantidade > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-black">
          {quantidade > 99 ? "99+" : quantidade}
        </span>
      ) : null}
    </Link>
  );
}

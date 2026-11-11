"use client";

import { useEffect, useRef, useState } from "react";
import { adicionarAoCarrinho } from "@/lib/carrinho";
import { trackEvent } from "@/lib/tracking";

type Props = {
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string;
  tamanho?: string;
  compacto?: boolean;
};

export default function BotaoCarrinho({
  produtoId,
  nome,
  preco,
  imagem,
  tamanho,
  compacto = false,
}: Props) {
  const [adicionado, setAdicionado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    adicionarAoCarrinho({ id: produtoId, nome, preco, imagem, tamanho });
    trackEvent("AddToCart", {
      content_name: nome,
      currency: "BRL",
      value: preco,
    });
    setAdicionado(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdicionado(false), 2000);
  }

  const rotulo = adicionado
    ? compacto
      ? "Adicionado"
      : "Adicionado ao carrinho"
    : compacto
      ? "Adicionar"
      : "Adicionar ao carrinho";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Adicionar ${nome} ao carrinho`}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 font-semibold transition ${
        compacto ? "mt-3 px-3 py-2 text-sm" : "mt-4 px-4 py-2.5"
      } ${
        adicionado
          ? "border-amber-500 bg-amber-50 text-amber-700"
          : "border-black bg-black text-white hover:bg-neutral-800"
      }`}
    >
      {adicionado ? (
        <svg
          className={compacto ? "h-4 w-4" : "h-5 w-5"}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className={compacto ? "h-4 w-4" : "h-5 w-5"}
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
      )}
      {rotulo}
    </button>
  );
}

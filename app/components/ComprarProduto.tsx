"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { adicionarAoCarrinho } from "@/lib/carrinho";
import { trackEvent } from "@/lib/tracking";

type Props = {
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string;
  tamanhos: string[];
};

export default function ComprarProduto({
  produtoId,
  nome,
  preco,
  imagem,
  tamanhos,
}: Props) {
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);
  const [adicionado, setAdicionado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdicionar() {
    if (tamanhos.length && !tamanho) {
      setAviso(true);
      return;
    }

    adicionarAoCarrinho({
      id: produtoId,
      nome,
      preco,
      imagem,
      tamanho: tamanho ?? undefined,
    });
    trackEvent("AddToCart", {
      content_name: nome,
      currency: "BRL",
      value: preco,
    });

    setAviso(false);
    setAdicionado(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdicionado(false), 2500);
  }

  return (
    <div className="mt-8 max-w-md">
      {tamanhos.length ? (
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-black">
              Escolha a numeração
            </p>
            {tamanho ? (
              <span className="text-xs text-slate-500">
                Selecionado: <strong className="text-black">{tamanho}</strong>
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {tamanhos.map((tam) => {
              const ativo = tam === tamanho;
              return (
                <button
                  key={tam}
                  type="button"
                  onClick={() => {
                    setTamanho(tam);
                    setAviso(false);
                  }}
                  aria-pressed={ativo}
                  aria-label={`Numeração ${tam}`}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-2 text-sm font-medium transition ${
                    ativo
                      ? "border-black bg-black text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-black hover:text-black"
                  }`}
                >
                  {tam}
                </button>
              );
            })}
          </div>

          {aviso ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              Selecione uma numeração para continuar.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAdicionar}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 font-semibold transition ${
          adicionado
            ? "border-amber-500 bg-amber-50 text-amber-700"
            : "border-black bg-black text-white hover:bg-neutral-800"
        }`}
      >
        {adicionado ? (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Adicionado ao carrinho
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M2.25 3h1.5l2.1 10.5a1.5 1.5 0 001.47 1.2h9.36a1.5 1.5 0 001.46-1.15L20.25 6H5.1"
              />
              <circle cx="9" cy="19.5" r="1.5" />
              <circle cx="17.25" cy="19.5" r="1.5" />
            </svg>
            Adicionar ao carrinho
          </>
        )}
      </button>

      {adicionado ? (
        <Link
          href="/carrinho"
          className="mt-2 block text-center text-sm font-semibold text-amber-600 transition hover:text-amber-500"
        >
          Ver carrinho →
        </Link>
      ) : null}
    </div>
  );
}

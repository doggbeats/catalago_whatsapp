"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Produto } from "@/lib/tipos";
import BotaoFavorito from "@/app/components/BotaoFavorito";
import { assinarFavoritos, lerFavoritos } from "@/lib/favoritos";
import { formatBRL } from "@/lib/format";

export default function FavoritosLista({
  produtos,
}: {
  produtos: Produto[];
}) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const atualizar = () => setIds(lerFavoritos());
    atualizar();
    return assinarFavoritos(atualizar);
  }, []);

  const salvos = ids
    .map((id) => produtos.find((produto) => produto.id === id))
    .filter((produto): produto is Produto => Boolean(produto?.image));

  return (
    <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">Meus favoritos</h1>
      {salvos.length ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {salvos.map((produto) => (
            <article
              key={produto.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-square bg-neutral-50">
                <Link
                  href={`/produtos/${produto.id}`}
                  aria-label={`Ver ${produto.name}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={produto.image}
                    alt={produto.name}
                    fill
                    className="object-contain p-3 sm:p-5"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                </Link>
                <BotaoFavorito
                  produtoId={produto.id}
                  className="absolute right-2 top-2 z-10"
                />
              </div>
              <div className="p-3 sm:p-4">
                <Link
                  href={`/produtos/${produto.id}`}
                  className="produto-nome line-clamp-2 text-sm text-black sm:text-base"
                >
                  {produto.name}
                </Link>
                <p className="produto-preco mt-2 text-lg text-black">
                  {formatBRL(produto.promotion ?? produto.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <p className="text-slate-600">Você ainda não salvou nenhum tênis.</p>
          <Link
            href="/produtos"
            className="mt-4 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Explorar produtos
          </Link>
        </div>
      )}
    </div>
  );
}

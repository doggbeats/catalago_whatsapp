"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatBRL } from "@/lib/format";
import BotaoCarrinho from "./BotaoCarrinho";
import BotaoFavorito from "./BotaoFavorito";

type ProdutoCarrossel = {
  id: number;
  name: string;
  image: string;
  images?: string[];
  marca?: string;
  tipo?: string;
  category: string;
  price: number;
  promotion: number | null;
  tamanho?: string;
  cor?: string;
};

export default function CarrosselTenis({
  produtos,
}: {
  produtos: ProdutoCarrossel[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pausado, setPausado] = useState(false);

  function passo(dir: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const largura = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * largura, behavior: "smooth" });
  }

  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const noFim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      if (noFim) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const card = track.querySelector<HTMLElement>("[data-card]");
        const largura = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
        track.scrollBy({ left: largura, behavior: "smooth" });
      }
    }, 4500);
    return () => clearInterval(id);
  }, [pausado]);

  if (!produtos.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {produtos.map((produto) => (
          <div
            key={produto.id}
            data-card
            className="w-[80%] shrink-0 snap-start sm:w-[47%] lg:w-[31.5%]"
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-xl">
              <div className="relative h-52 w-full overflow-hidden bg-slate-50">
                <Link
                  href={`/produtos/${produto.id}`}
                  aria-label={`Ver detalhes de ${produto.name}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={produto.image}
                    alt={produto.name}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 47vw, 80vw"
                  />
                  {produto.marca ? (
                    <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-black shadow-sm">
                      {produto.marca}
                    </span>
                  ) : null}
                  {(produto.images?.length ?? 0) > 1 ? (
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                      {produto.images!.length} fotos
                    </span>
                  ) : null}
                </Link>
                <BotaoFavorito
                  produtoId={produto.id}
                  className="absolute right-3 top-3 z-10"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-wide">
                  <span className="text-amber-600">{produto.category}</span>
                  {produto.tipo ? (
                    <span className="text-slate-500">· {produto.tipo}</span>
                  ) : null}
                </div>

                <h3 className="produto-nome mt-1 line-clamp-1 text-lg font-medium text-black">
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="transition group-hover:text-amber-600"
                  >
                    {produto.name}
                  </Link>
                </h3>

                <div className="mt-auto pt-3">
                  <div className="flex h-7 items-end gap-2">
                    {produto.promotion ? (
                      <>
                        <p className="produto-preco text-sm text-slate-500 line-through">
                          {formatBRL(produto.price)}
                        </p>
                        <p className="produto-preco text-xl text-black">
                          {formatBRL(produto.promotion)}
                        </p>
                      </>
                    ) : (
                      <p className="produto-preco text-xl text-black">
                        {formatBRL(produto.price)}
                      </p>
                    )}
                  </div>

                  <BotaoCarrinho
                    produtoId={produto.id}
                    nome={produto.name}
                    preco={produto.promotion ?? produto.price}
                    imagem={produto.image}
                    compacto
                  />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => passo(-1)}
        aria-label="Tênis anteriores"
        className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-amber-400 hover:text-amber-600 md:flex"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => passo(1)}
        aria-label="Próximos tênis"
        className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-amber-400 hover:text-amber-600 md:flex"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  imagens: string[];
  alt: string;
};

export default function Galeria({ imagens, alt }: Props) {
  const [ativa, setAtiva] = useState(0);

  if (!imagens.length) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-4xl">
        📦
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Image
          src={imagens[ativa]}
          alt={alt}
          fill
          priority
          className="object-contain p-6"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      {imagens.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {imagens.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setAtiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === ativa}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition ${
                i === ativa
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-slate-200 hover:border-amber-300"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} - foto ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

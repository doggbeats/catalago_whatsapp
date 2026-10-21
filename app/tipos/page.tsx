import Link from "next/link";
import { getProdutos } from "@/lib/produtos";

const tipos = ["Corrida", "Casual", "Esportivo", "Fashion", "Slip-on", "Lazer"];

export default async function TiposPage() {
  const produtos = await getProdutos();
  const count = (tipo: string) => produtos.filter((p) => p.tipo === tipo).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-black">Tipos de Calçados</h1>
        <p className="text-slate-600">Encontre o modelo ideal para você</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tipos.map((tipo) => (
          <Link
            key={tipo}
            href={`/produtos?tipo=${encodeURIComponent(tipo)}`}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 transition hover:border-amber-400 hover:shadow-md"
          >
            <div>
              <h2 className="text-xl font-bold text-black">{tipo}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {count(tipo)} {count(tipo) === 1 ? "produto" : "produtos"}
              </p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-amber-100 group-hover:text-amber-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

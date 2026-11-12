import Image from "next/image";
import Link from "next/link";
import { getProdutos } from "@/lib/produtos";

export const metadata = {
  title: "Marcas | Well Fashion",
  description:
    "Explore o catálogo por marca e encontre o par ideal para você.",
};

export default async function MarcasPage() {
  const produtos = await getProdutos();

  const nomes = Array.from(
    new Set(produtos.map((p) => p.marca).filter((m): m is string => Boolean(m))),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const marcas = nomes.map((nome) => {
    const lista = produtos.filter((p) => p.marca === nome);
    return {
      nome,
      total: lista.length,
      imagem: lista.find((p) => p.image)?.image,
    };
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden bg-neutral-950">
        <div
          aria-hidden
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Link href="/" className="transition hover:text-white">
              Início
            </Link>
            <span aria-hidden>/</span>
            <span className="text-neutral-200">Marcas</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Nossas <span className="text-amber-400">marcas</span>
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-400">
            Escolha sua marca favorita e encontre o par ideal. Só trabalhamos com
            modelos originais e fotos reais.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {marcas.map((marca) => (
            <Link
              key={marca.nome}
              href={`/produtos?marca=${encodeURIComponent(marca.nome)}`}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.4)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200">
                {marca.imagem ? (
                  <Image
                    src={marca.imagem}
                    alt={marca.nome}
                    fill
                    className="object-contain p-6 mix-blend-multiply transition duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-4xl">
                    👟
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-black">
                    {marca.nome}
                  </h2>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {marca.total} {marca.total === 1 ? "produto" : "produtos"}
                  </p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition group-hover:bg-black group-hover:text-white">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}

          <Link
            href="/produtos"
            className="group flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-neutral-300 bg-transparent p-8 text-center transition hover:border-black hover:bg-white"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition group-hover:bg-black group-hover:text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            <span className="text-base font-bold text-black">
              Ver todos os produtos
            </span>
            <span className="text-sm text-neutral-500">
              Explore o catálogo completo
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

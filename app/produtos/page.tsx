import Image from "next/image";
import Link from "next/link";
import { getProdutos, type Produto } from "@/lib/produtos";
import { formatBRL, formatParcelas } from "@/lib/format";
import BotaoWhatsApp from "../components/BotaoWhatsApp";

const categorias = ["Áudio", "Computadores", "Periféricos", "Ferramentas", "Videogames", "Monitores"];

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const { categoria, busca } = await searchParams;
  const todos: Produto[] = await getProdutos();
  const produtos = todos.filter((p) => {
    const matchCategoria = categoria ? p.category === categoria : true;
    const query = busca?.trim().toLowerCase();
    const matchBusca = query
      ? p.name.toLowerCase().includes(query) ||
        p.specs?.some((s) => s.toLowerCase().includes(query))
      : true;
    return matchCategoria && matchBusca;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-black">Produtos</h1>
        <p className="text-slate-600">
          {categoria
            ? `Exibindo produtos da categoria ${categoria}`
            : busca
              ? `Resultados para "${busca}"`
              : `Confira nossa seleção de ${todos.length} produtos eletrônicos.`}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/produtos"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !categoria
              ? "bg-blue-600 text-white"
              : "border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          Todos
        </Link>
        {categorias.map((cat) => (
          <Link
            key={cat}
            href={`/produtos?categoria=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              categoria === cat
                ? "bg-blue-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {produtos.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">
          Nenhum produto encontrado nessa categoria.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((product) => {
            const precoFinal = product.promotion ?? product.price;
            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-50">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-4xl">📦</div>
                  )}
                  {product.promotion ? (
                    <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      PROMO
                    </span>
                  ) : null}
                  {product.quantity <= 3 ? (
                    <span className="absolute right-3 top-3 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      Últimas unidades
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-black">
                    {product.name}
                  </h2>

                  {product.description ? (
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                      {product.description}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.specs?.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    {product.promotion ? (
                      <>
                        <p className="text-sm text-slate-400 line-through">
                          {formatBRL(product.price)}
                        </p>
                        <p className="text-xl font-bold text-black">
                          {formatBRL(product.promotion)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-black">
                        {formatBRL(product.price)}
                      </p>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    até {formatParcelas(product.promotion ?? product.price, product.installments ?? 1)}
                  </p>

                  <BotaoWhatsApp
                    produtoId={product.id}
                    nome={product.name}
                    categoria={product.category}
                    precoFinal={precoFinal}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

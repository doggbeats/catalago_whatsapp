import Image from "next/image";
import Link from "next/link";
import { getProdutos, type Produto } from "@/lib/produtos";
import { formatBRL, formatParcelas } from "@/lib/format";
import BotaoWhatsApp from "../components/BotaoWhatsApp";

const categorias = ["Masculino", "Feminino", "Infantil"];
const marcas = ["Nike", "Adidas", "Jordan", "Fila", "Humbro"];
const tipos = ["Corrida", "Casual", "Esportivo", "Fashion", "Slip-on", "Lazer"];
const tamanhos = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

const rotuloCategoria: Record<string, string> = {
  Masculino: "Masculino",
  Feminino: "Feminino",
  Infantil: "Infantil",
};

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim()) sp.set(k, v);
  });
  const q = sp.toString();
  return q ? `${base}?${q}` : base;
}

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    busca?: string;
    promo?: string;
    marca?: string;
    tipo?: string;
  }>;
}) {
  const { categoria, busca, promo, marca, tipo } = await searchParams;
  const promoAtiva = promo === "sim";
  const todos: Produto[] = await getProdutos();
  const produtos = todos.filter((p) => {
    const matchCategoria = categoria ? p.category === categoria : true;
    const matchPromo = promoAtiva ? Boolean(p.promotion) : true;
    const matchMarca = marca ? p.marca === marca : true;
    const matchTipo = tipo ? p.tipo === tipo : true;
    const query = busca?.trim().toLowerCase();
    const matchBusca = query
      ? p.name.toLowerCase().includes(query) ||
        p.specs?.some((s) => s.toLowerCase().includes(query)) ||
        [p.cor, p.tamanho, p.qualidade].some((v) =>
          v?.toLowerCase().includes(query),
        )
      : true;
    return matchCategoria && matchPromo && matchMarca && matchTipo && matchBusca;
  });

  const chip = (ativo: boolean, vermelho = false) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      ativo
        ? vermelho
          ? "bg-red-600 text-white"
          : "bg-amber-400 text-black"
        : vermelho
          ? "border border-red-200 text-red-600 hover:bg-red-50"
          : "border border-slate-300 text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-black">Produtos</h1>
        <p className="text-slate-600">
          {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} encontrados
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-fit rounded-xl border border-slate-200 bg-white lg:block">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-black">Filtros</h2>
          </div>

          <div className="border-b border-slate-200 px-4 py-4">
            <h3 className="text-sm font-medium text-black">Gêneros</h3>
            <ul className="mt-2 space-y-1">
              {categorias.map((cat) => (
                <li key={cat}>
                  <Link
                    href={buildUrl("/produtos", {
                      categoria: categoria === cat ? undefined : cat,
                      marca,
                      tipo,
                      promo: promoAtiva ? "sim" : undefined,
                      busca,
                    })}
                    className={`block rounded-md px-2 py-1.5 text-sm transition ${
                      categoria === cat
                        ? "font-medium text-amber-600"
                        : "text-slate-700 hover:text-black"
                    }`}
                  >
                    {rotuloCategoria[cat] ?? cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-b border-slate-200 px-4 py-4">
            <h3 className="text-sm font-medium text-black">Tamanhos</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tamanhos.map((tam) => (
                <button
                  key={tam}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-xs font-medium text-slate-700 transition hover:border-amber-400 hover:text-black"
                >
                  {tam}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 px-4 py-4">
            <h3 className="text-sm font-medium text-black">Marcas</h3>
            <ul className="mt-2 space-y-1">
              {marcas.map((m) => (
                <li key={m}>
                  <Link
                    href={buildUrl("/produtos", {
                      categoria,
                      marca: marca === m ? undefined : m,
                      tipo,
                      promo: promoAtiva ? "sim" : undefined,
                      busca,
                    })}
                    className={`block rounded-md px-2 py-1.5 text-sm transition ${
                      marca === m
                        ? "font-medium text-amber-600"
                        : "text-slate-700 hover:text-black"
                    }`}
                  >
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-b border-slate-200 px-4 py-4">
            <h3 className="text-sm font-medium text-black">Tipos</h3>
            <ul className="mt-2 space-y-1">
              {tipos.map((t) => (
                <li key={t}>
                  <Link
                    href={buildUrl("/produtos", {
                      categoria,
                      marca,
                      tipo: tipo === t ? undefined : t,
                      promo: promoAtiva ? "sim" : undefined,
                      busca,
                    })}
                    className={`block rounded-md px-2 py-1.5 text-sm transition ${
                      tipo === t
                        ? "font-medium text-amber-600"
                        : "text-slate-700 hover:text-black"
                    }`}
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-4">
            <Link
              href="/produtos"
              className={`block rounded-md px-2 py-1.5 text-sm font-medium transition ${
                categoria || marca || tipo || promoAtiva
                  ? "text-slate-700 hover:text-black"
                  : "text-slate-400"
              }`}
            >
              Limpar filtros
            </Link>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap gap-2">
            <Link href="/produtos" className={chip(!categoria && !promoAtiva && !marca && !tipo)}>
              Todos
            </Link>
            <Link href="/produtos?promo=sim" className={chip(promoAtiva, true)}>
              Promoções
            </Link>
          </div>

          {produtos.length === 0 ? (
            <p className="mt-16 text-center text-slate-500">
              Nenhum produto encontrado nessa categoria.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {produtos.map((product) => {
                const precoFinal = product.promotion ?? product.price;
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-50">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition duration-300 group-hover:scale-105"
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-4xl">📦</div>
                      )}
                      {product.promotion ? (
                        <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-black shadow-sm">
                          PROMO
                        </span>
                      ) : null}
                      {product.quantity <= 3 ? (
                        <span className="absolute right-3 top-3 rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-black shadow-sm">
                          Últimas unidades
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide">
                        <span className="text-amber-600">{product.category}</span>
                        {product.marca ? (
                          <span className="text-slate-600">· {product.marca}</span>
                        ) : null}
                        {product.tipo ? (
                          <span className="text-slate-500">· {product.tipo}</span>
                        ) : null}
                      </div>
                      <h2 className="mt-1 line-clamp-2 min-h-14 text-lg font-semibold text-black">
                        {product.name}
                      </h2>

                      <p className="mt-1.5 line-clamp-2 min-h-10 text-sm text-slate-600">
                        {product.description ?? ""}
                      </p>

                      <div className="mt-3 flex flex-wrap content-start gap-1.5">
                        {[product.cor, product.tamanho, product.qualidade]
                          .filter(Boolean)
                          .map((v) => (
                            <span
                              key={v}
                              className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                            >
                              {v}
                            </span>
                          ))}
                        {(product.specs ?? []).slice(0, 4).map((spec) => (
                          <span
                            key={spec}
                            className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col p-5 pt-0">
                      <div className="mt-auto">
                        <div className="flex h-7 items-end gap-2">
                          {product.promotion ? (
                            <>
                              <p className="text-sm text-slate-500 line-through">
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

                        {product.tamanho ? (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-slate-700">Tamanhos</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {product.tamanho.includes("-")
                                ? Array.from(
                                    { length: (() => {
                                        const [ini, fim] = product.tamanho!.split("-").map((n) => parseInt(n.trim()));
                                        return fim - ini + 1;
                                      })() },
                                    (_, i) => {
                                      const [ini] = product.tamanho!.split("-").map((n) => parseInt(n.trim()));
                                      return String(ini + i);
                                    }
                                  ).map((tam) => (
                                    <span
                                      key={tam}
                                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-xs font-medium text-slate-700"
                                    >
                                      {tam}
                                    </span>
                                  ))
                                : product.tamanho.split(",").map((tam) => tam.trim()).filter(Boolean).map((tam) => (
                                    <span
                                      key={tam}
                                      className="flex h-7 items-center justify-center rounded-md border border-slate-300 px-2 text-xs font-medium text-slate-700"
                                    >
                                      {tam}
                                    </span>
                                  ))}
                            </div>
                          </div>
                        ) : null}

                        <BotaoWhatsApp
                          produtoId={product.id}
                          nome={product.name}
                          categoria={product.category}
                          precoFinal={precoFinal}
                          tamanho={product.tamanho}
                          cor={product.cor}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

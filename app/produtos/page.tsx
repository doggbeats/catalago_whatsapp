import Image from "next/image";
import Link from "next/link";
import { getProdutos, type Produto } from "@/lib/produtos";
import { formatBRL, formatParcelas } from "@/lib/format";
import { listaTamanhos, tamanhosDisponiveis } from "@/lib/tamanhos";
import BotaoCarrinho from "../components/BotaoCarrinho";
import OrdenarProdutos from "../components/OrdenarProdutos";
import Filtros, { buildUrl, type Contagem } from "./Filtros";

const categoriasBase = ["Masculino", "Feminino", "Infantil"];

type Ignorar = "categoria" | "marca" | "tipo" | "tamanho";

export const metadata = {
  title: "Produtos | TENIS NEON",
  description:
    "Tênis Adidas, New Balance e muito mais. Filtre por marca, tamanho e estilo.",
};

function ordenar(produtos: Produto[], ordem?: string): Produto[] {
  const lista = [...produtos];
  switch (ordem) {
    case "menor-preco":
      return lista.sort(
        (a, b) => (a.promotion ?? a.price) - (b.promotion ?? b.price),
      );
    case "maior-preco":
      return lista.sort(
        (a, b) => (b.promotion ?? b.price) - (a.promotion ?? a.price),
      );
    case "nome":
      return lista.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "novidades":
      return lista.sort((a, b) => b.id - a.id);
    default:
      return lista;
  }
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
    tamanho?: string;
    ordem?: string;
  }>;
}) {
  const { categoria, busca, promo, marca, tipo, tamanho, ordem } =
    await searchParams;
  const promoAtiva = promo === "sim";
  const todos: Produto[] = await getProdutos();

  const query = busca?.trim().toLowerCase();

  const combina = (p: Produto, ignorar?: Ignorar) => {
    const matchCategoria =
      ignorar === "categoria" || !categoria || p.category === categoria;
    const matchMarca = ignorar === "marca" || !marca || p.marca === marca;
    const matchTipo = ignorar === "tipo" || !tipo || p.tipo === tipo;
    const matchPromo = promoAtiva ? Boolean(p.promotion) : true;
    const matchBusca = query
      ? p.name.toLowerCase().includes(query) ||
        p.specs?.some((s) => s.toLowerCase().includes(query)) ||
        [p.cor, p.tamanho, p.qualidade, p.marca, p.tipo].some((v) =>
          v?.toLowerCase().includes(query),
        )
      : true;
    const matchTamanho =
      ignorar === "tamanho" || !tamanho
        ? true
        : listaTamanhos(p.tamanho).includes(tamanho);
    return (
      matchCategoria &&
      matchMarca &&
      matchTipo &&
      matchPromo &&
      matchBusca &&
      matchTamanho
    );
  };

  const filtrados = todos.filter((p) => combina(p));
  const produtos = ordenar(filtrados, ordem);

  const categorias: Contagem[] = categoriasBase
    .map((nome) => ({
      nome,
      total: todos.filter(
        (p) => p.category === nome && combina(p, "categoria"),
      ).length,
    }))
    .filter((c) => c.total > 0 || categoria === c.nome);

  const marcasNomes = Array.from(
    new Set(todos.map((p) => p.marca).filter((m): m is string => Boolean(m))),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  if (marca && !marcasNomes.includes(marca)) marcasNomes.push(marca);
  const marcas: Contagem[] = marcasNomes.map((nome) => ({
    nome,
    total: todos.filter((p) => p.marca === nome && combina(p, "marca")).length,
  }));
  const marcasVisiveis = marcas.filter(
    (m) => m.total > 0 || marca === m.nome,
  );

  const tiposNomes = Array.from(
    new Set(todos.map((p) => p.tipo).filter((t): t is string => Boolean(t))),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  if (tipo && !tiposNomes.includes(tipo)) tiposNomes.push(tipo);
  const tipos: Contagem[] = tiposNomes.map((nome) => ({
    nome,
    total: todos.filter((p) => p.tipo === nome && combina(p, "tipo")).length,
  }));
  const tiposVisiveis = tipos.filter((t) => t.total > 0 || tipo === t.nome);

  const tamanhos = tamanhosDisponiveis(
    todos.filter((p) => combina(p, "tamanho")),
  );
  if (tamanho && !tamanhos.includes(tamanho)) tamanhos.push(tamanho);

  const totalFiltrosAtivos = [
    categoria,
    marca,
    tipo,
    tamanho,
    busca,
    promoAtiva ? "sim" : undefined,
  ].filter(Boolean).length;

  const rotuloResultado = busca
    ? `Resultados para “${busca}”`
    : categoria
      ? `Tênis ${categoria.toLowerCase()}`
      : marca
        ? `Tênis ${marca}`
        : tipo
          ? `Tênis ${tipo}`
          : promoAtiva
            ? "Promoções"
            : "Todos os tênis";

  const maisNovos = new Set(
    [...todos]
      .sort((a, b) => b.id - a.id)
      .slice(0, 4)
      .map((p) => p.id),
  );

  const paramsAtuais = {
    categoria,
    marca,
    tipo,
    tamanho,
    busca,
    promo: promoAtiva ? "sim" : undefined,
    ordem,
  };

  const chips: { label: string; href: string }[] = [];
  if (categoria) {
    chips.push({
      label: categoria,
      href: buildUrl("/produtos", { ...paramsAtuais, categoria: undefined }),
    });
  }
  if (marca) {
    chips.push({
      label: marca,
      href: buildUrl("/produtos", { ...paramsAtuais, marca: undefined }),
    });
  }
  if (tipo) {
    chips.push({
      label: tipo,
      href: buildUrl("/produtos", { ...paramsAtuais, tipo: undefined }),
    });
  }
  if (tamanho) {
    chips.push({
      label: `Tamanho ${tamanho}`,
      href: buildUrl("/produtos", { ...paramsAtuais, tamanho: undefined }),
    });
  }
  if (busca) {
    chips.push({
      label: `Busca: ${busca}`,
      href: buildUrl("/produtos", { ...paramsAtuais, busca: undefined }),
    });
  }
  if (promoAtiva) {
    chips.push({
      label: "Promoções",
      href: buildUrl("/produtos", { ...paramsAtuais, promo: undefined }),
    });
  }

  const linkMarca = (nome: string) =>
    buildUrl("/produtos", {
      categoria,
      tipo,
      tamanho,
      busca,
      promo: promoAtiva ? "sim" : undefined,
      ordem,
      marca: marca === nome ? undefined : nome,
    });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <section className="pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">
                Categorias
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-black">
                Compre por marca
              </h2>
            </div>
            <Link
              href="/marcas"
              className="text-sm font-semibold text-neutral-600 transition hover:text-black"
            >
              Ver todas as marcas →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {marcas.map((m) => {
              const ativo = marca === m.nome;
              return (
                <Link
                  key={m.nome}
                  href={linkMarca(m.nome)}
                  className={`group flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                    ativo
                      ? "border-black bg-black text-white shadow-md"
                      : "border-neutral-200 bg-white text-black hover:border-black hover:shadow-sm"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold tracking-tight">
                      {m.nome}
                    </span>
                    <span
                      className={`block text-[11px] ${
                        ativo ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {m.total} {m.total === 1 ? "modelo" : "modelos"}
                    </span>
                  </span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                      ativo
                        ? "bg-white/10 text-white"
                        : "bg-neutral-100 text-neutral-500 group-hover:bg-amber-100 group-hover:text-amber-600"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
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
                </Link>
              );
            })}

            <Link
              href="/marcas"
              className="group flex items-center justify-between gap-2 rounded-xl border border-dashed border-neutral-300 bg-transparent px-3 py-2 text-black transition hover:border-black hover:bg-white"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-tight">
                  Todas as marcas
                </span>
                <span className="block text-[11px] text-neutral-500">
                  Catálogo completo
                </span>
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition group-hover:bg-black group-hover:text-white">
                <svg
                  className="h-3.5 w-3.5"
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
            </Link>
          </div>
        </section>

        <div className="grid gap-8 pt-8 lg:grid-cols-[270px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-black">
                  Filtros
                </h2>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                  {filtrados.length}
                </span>
              </div>
              <Filtros
                categoria={categoria}
                marca={marca}
                tipo={tipo}
                tamanho={tamanho}
                busca={busca}
                promoAtiva={promoAtiva}
                tamanhos={tamanhos}
                categorias={categorias}
                marcas={marcasVisiveis}
                tipos={tiposVisiveis}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <details className="group mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-sm font-semibold text-black">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5h18M6 12h12M10 19h4"
                    />
                  </svg>
                  Filtros
                  {totalFiltrosAtivos > 0 ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black px-1.5 text-[11px] font-bold text-white">
                      {totalFiltrosAtivos}
                    </span>
                  ) : null}
                </span>
                <svg
                  className="h-4 w-4 text-neutral-500 transition group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-neutral-100">
                <Filtros
                  categoria={categoria}
                  marca={marca}
                  tipo={tipo}
                  tamanho={tamanho}
                  busca={busca}
                  promoAtiva={promoAtiva}
                  tamanhos={tamanhos}
                  categorias={categorias}
                  marcas={marcasVisiveis}
                  tipos={tiposVisiveis}
                />
              </div>
            </details>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-black">
                  {rotuloResultado}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {produtos.length}{" "}
                  {produtos.length === 1
                    ? "produto encontrado"
                    : "produtos encontrados"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:inline">
                  Ordenar
                </span>
                <OrdenarProdutos
                  ordem={ordem ?? "destaque"}
                  params={{
                    categoria,
                    marca,
                    tipo,
                    tamanho,
                    busca,
                    promo: promoAtiva ? "sim" : undefined,
                  }}
                />
              </div>
            </div>

            {chips.length ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-black hover:text-black"
                  >
                    {chip.label}
                    <svg
                      className="h-3 w-3 text-neutral-400 transition group-hover:text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Link>
                ))}
                <Link
                  href="/produtos"
                  className="ml-1 text-xs font-semibold text-neutral-500 underline underline-offset-2 transition hover:text-black"
                >
                  Limpar tudo
                </Link>
              </div>
            ) : null}

            {produtos.length === 0 ? (
              <div className="mt-5 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-neutral-100 text-neutral-400">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-black">
                  Nenhum tênis encontrado
                </h3>
                <p className="mt-1 max-w-sm text-sm text-neutral-500">
                  Tente remover alguns filtros ou buscar por outro modelo.
                </p>
                <Link
                  href="/produtos"
                  className="mt-5 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Ver todos os tênis
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {produtos.map((product) => {
                  const precoFinal = product.promotion ?? product.price;
                  const desconto = product.promotion
                    ? Math.max(
                        0,
                        Math.round(
                          (1 - product.promotion / product.price) * 100,
                        ),
                      )
                    : 0;

                  return (
                    <article
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.4)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200">
                        <Link
                          href={`/produtos/${product.id}`}
                          aria-label={`Ver detalhes de ${product.name}`}
                          className="block h-full w-full"
                        >
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-5 mix-blend-multiply transition duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110"
                              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-4xl">
                              📦
                            </span>
                          )}
                        </Link>

                        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                          {product.marca ? (
                            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-800 shadow-sm backdrop-blur">
                              {product.marca}
                            </span>
                          ) : (
                            <span />
                          )}
                          {product.promotion ? (
                            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black shadow-sm">
                              -{desconto}%
                            </span>
                          ) : maisNovos.has(product.id) ? (
                            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                              Novo
                            </span>
                          ) : null}
                        </div>

                        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-neutral-700 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
                          Ver detalhes →
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                          <span>{product.category}</span>
                          {product.tipo ? (
                            <>
                              <span className="h-1 w-1 rounded-full bg-neutral-300" />
                              <span>{product.tipo}</span>
                            </>
                          ) : null}
                        </div>

                        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug tracking-tight text-black">
                          <Link
                            href={`/produtos/${product.id}`}
                            className="transition hover:text-amber-600"
                          >
                            {product.name}
                          </Link>
                        </h3>

                        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-neutral-500">
                          {product.description ?? ""}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.cor ? (
                            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                              Cor: {product.cor}
                            </span>
                          ) : null}
                          {product.qualidade ? (
                            <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                              {product.qualidade}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-auto pt-4">
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-black tracking-tight text-black">
                              {formatBRL(precoFinal)}
                            </span>
                            {product.promotion ? (
                              <span className="mb-1 text-sm text-neutral-400 line-through">
                                {formatBRL(product.price)}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            em até{" "}
                            {formatParcelas(
                              precoFinal,
                              product.installments ?? 1,
                            )}{" "}
                            sem juros
                          </p>
                          <BotaoCarrinho
                            produtoId={product.id}
                            nome={product.name}
                            preco={precoFinal}
                            imagem={product.image}
                            compacto
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-10 grid gap-3 rounded-3xl border border-neutral-200 bg-white p-5 sm:grid-cols-3">
              {[
                {
                  titulo: "Frete grátis",
                  texto: "Em compras acima de R$ 299",
                  icone: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                },
                {
                  titulo: "Compra segura",
                  texto: "Seus dados protegidos",
                  icone: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                },
                {
                  titulo: "Troca fácil",
                  texto: "30 dias para trocar",
                  icone: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                },
              ].map((item) => (
                <div key={item.titulo} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.6}
                        d={item.icone}
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-black">{item.titulo}</p>
                    <p className="text-xs text-neutral-500">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

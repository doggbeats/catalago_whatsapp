import Link from "next/link";
import { notFound } from "next/navigation";
import { getProdutos } from "@/lib/produtos";
import { formatBRL, formatParcelas } from "@/lib/format";
import ComprarProduto from "@/app/components/ComprarProduto";
import Galeria from "@/app/components/Galeria";
import BotaoFavorito from "@/app/components/BotaoFavorito";
import { listaTamanhos } from "@/lib/tamanhos";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produtos = await getProdutos();
  const produto = produtos.find((p) => p.id === Number(id));

  if (!produto) notFound();

  const imagens = produto.images?.length
    ? produto.images
    : produto.image
      ? [produto.image]
      : [];
  const precoFinal = produto.promotion ?? produto.price;
  const tamanhos = listaTamanhos(produto.tamanho);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition hover:text-black">
          Início
        </Link>
        <span>/</span>
        <Link href="/produtos" className="transition hover:text-black">
          Produtos
        </Link>
        {produto.marca ? (
          <>
            <span>/</span>
            <Link
              href={`/produtos?marca=${encodeURIComponent(produto.marca)}`}
              className="transition hover:text-black"
            >
              {produto.marca}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <Galeria imagens={imagens} alt={produto.name} />
          <BotaoFavorito
            produtoId={produto.id}
            className="absolute right-3 top-3 z-10"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            {produto.marca ? (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-black">
                {produto.marca}
              </span>
            ) : null}
            {produto.category ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {produto.category}
              </span>
            ) : null}
            {produto.tipo ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {produto.tipo}
              </span>
            ) : null}
          </div>

          <h1 className="produto-nome mt-4 text-3xl text-black">{produto.name}</h1>

          <p className="mt-3 text-slate-600">{produto.description}</p>

          <div className="mt-6 flex h-9 items-end gap-3">
            {produto.promotion ? (
              <>
                <p className="produto-preco text-base text-slate-500 line-through">
                  {formatBRL(produto.price)}
                </p>
                <p className="produto-preco text-3xl text-black">
                  {formatBRL(produto.promotion)}
                </p>
              </>
            ) : (
              <p className="produto-preco text-3xl text-black">
                {formatBRL(produto.price)}
              </p>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            até{" "}
            {formatParcelas(
              precoFinal,
              produto.installments ?? 1,
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[produto.cor, produto.qualidade].filter(Boolean).map((v) => (
              <span
                key={v}
                className="rounded-md bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700"
              >
                {v}
              </span>
            ))}
          </div>

          {produto.specs?.length ? (
            <ul className="mt-6 space-y-1.5 text-sm text-slate-600">
              {produto.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {spec}
                </li>
              ))}
            </ul>
          ) : null}

          <ComprarProduto
            produtoId={produto.id}
            nome={produto.name}
            preco={precoFinal}
            imagem={produto.image}
            tamanhos={tamanhos}
          />

          <p className="mt-3 text-xs text-slate-500">
            {imagens.length} foto{imagens.length === 1 ? "" : "s"} deste modelo
          </p>
        </div>
      </div>
    </div>
  );
}

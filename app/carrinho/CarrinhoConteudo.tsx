"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  alterarQuantidade,
  assinarCarrinho,
  limparCarrinho,
  lerCarrinho,
  removerDoCarrinho,
  totalCarrinho,
  type ItemCarrinho,
} from "@/lib/carrinho";
import { formatBRL, formatParcelas } from "@/lib/format";

export default function CarrinhoConteudo({
  numeroWhatsApp,
}: {
  numeroWhatsApp: string;
}) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    const atualizar = () => setItens(lerCarrinho());
    atualizar();
    setCarregado(true);
    return assinarCarrinho(atualizar);
  }, []);

  const total = totalCarrinho(itens);

  async function finalizar() {
    if (enviando || !itens.length) return;
    setErro(null);
    setEnviando(true);

    // Abre a aba do WhatsApp ainda dentro do clique para não ser bloqueada.
    const janela = window.open("", "_blank");

    try {
      // Confere o estoque antes de registrar para não criar vendas parciais.
      const resProdutos = await fetch("/api/produtos");
      const catalogo: Array<{ id: number; name: string; quantity: number }> =
        await resProdutos.json();

      const necessario = new Map<number, number>();
      itens.forEach((item) =>
        necessario.set(
          item.id,
          (necessario.get(item.id) ?? 0) + item.quantidade,
        ),
      );

      const indisponiveis: string[] = [];
      necessario.forEach((quantidade, id) => {
        const produto = catalogo.find((p) => p.id === id);
        if (!produto || produto.quantity < quantidade) {
          indisponiveis.push(
            `${produto?.name ?? `Produto ${id}`}: disponível ${
              produto?.quantity ?? 0
            }, pedido ${quantidade}`,
          );
        }
      });

      if (indisponiveis.length) {
        janela?.close();
        setErro(
          `Estoque insuficiente. ${indisponiveis.join(" | ")}. Ajuste o carrinho e tente novamente.`,
        );
        return;
      }

      const falhas: string[] = [];

      for (const item of itens) {
        const res = await fetch("/api/pedidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produtoId: item.id,
            quantidade: item.quantidade,
            tamanho: item.tamanho,
          }),
        });

        if (!res.ok) {
          const dados = await res.json().catch(() => ({}));
          falhas.push(
            `${item.nome}${item.tamanho ? ` (${item.tamanho})` : ""}: ${
              dados.error ?? "não foi possível registrar"
            }`,
          );
        }
      }

      if (falhas.length) {
        janela?.close();
        setErro(
          `Não foi possível registrar a venda. ${falhas.join(" | ")}. Ajuste o carrinho e tente novamente.`,
        );
        return;
      }

      const linhas = itens.map(
        (item) =>
          `${item.quantidade}x *${item.nome}*${item.tamanho ? ` (${item.tamanho})` : ""} — ${formatBRL(item.preco * item.quantidade)}`,
      );
      const mensagem = [
        "Olá! Quero finalizar este pedido:",
        "",
        ...linhas,
        "",
        `Total: ${formatBRL(total)}`,
      ].join("\n");

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

      if (janela) {
        janela.location.href = url;
      } else {
        window.location.href = url;
      }

      limparCarrinho();
      setConcluido(true);
    } catch {
      janela?.close();
      setErro("Erro de conexão ao registrar a venda. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (!carregado) {
    return (
      <div className="py-16 text-center text-slate-500">Carregando carrinho...</div>
    );
  }

  if (!itens.length) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        {concluido ? (
          <>
            <div className="text-5xl">✅</div>
            <h2 className="mt-4 text-xl font-semibold text-black">
              Venda registrada com sucesso!
            </h2>
            <p className="mx-auto mt-1 max-w-md text-slate-600">
              O estoque já foi atualizado e o pedido apareceu no painel
              administrativo. Finalize o pagamento pelo WhatsApp.
            </p>
            <a
              href={`https://wa.me/${numeroWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              Abrir WhatsApp
            </a>
          </>
        ) : (
          <>
            <div className="text-5xl">🛒</div>
            <h2 className="mt-4 text-xl font-semibold text-black">
              Seu carrinho está vazio
            </h2>
            <p className="mt-1 text-slate-600">
              Escolha um modelo e adicione ao carrinho para continuar.
            </p>
            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
            >
              Ver produtos
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {itens.map((item) => (
          <li
            key={`${item.id}-${item.tamanho ?? ""}`}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={`/produtos/${item.id}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50"
            >
              <Image
                src={item.imagem}
                alt={item.nome}
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/produtos/${item.id}`}
                className="line-clamp-2 font-semibold text-black transition hover:text-amber-600"
              >
                {item.nome}
              </Link>
              {item.tamanho ? (
                <p className="mt-0.5 text-sm text-slate-500">
                  Numeração {item.tamanho}
                </p>
              ) : null}
              <p className="mt-1 text-sm font-medium text-amber-700">
                {formatBRL(item.preco)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() =>
                    alterarQuantidade(item.id, item.tamanho, item.quantidade - 1)
                  }
                  aria-label={`Diminuir quantidade de ${item.nome}`}
                  className="grid h-9 w-9 place-items-center text-lg text-slate-600 transition hover:text-black"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold text-black">
                  {item.quantidade}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    alterarQuantidade(item.id, item.tamanho, item.quantidade + 1)
                  }
                  aria-label={`Aumentar quantidade de ${item.nome}`}
                  className="grid h-9 w-9 place-items-center text-lg text-slate-600 transition hover:text-black"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-bold text-black">
                {formatBRL(item.preco * item.quantidade)}
              </p>

              <button
                type="button"
                onClick={() => removerDoCarrinho(item.id, item.tamanho)}
                aria-label={`Remover ${item.nome} do carrinho`}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M6 7h12M9 7V5h6v2m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-32">
        <h2 className="text-lg font-bold text-black">Resumo do pedido</h2>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-black">{formatBRL(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span className="font-medium text-black">A combinar</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
            <span className="font-semibold text-black">Total</span>
            <span className="font-bold text-black">{formatBRL(total)}</span>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          até {formatParcelas(total, 6)}
        </p>

        {erro ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {erro}
          </p>
        ) : null}

        <button
          type="button"
          onClick={finalizar}
          disabled={enviando}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? (
            "Registrando venda..."
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 011.26-10.17 8.14 8.14 0 015.72-2.37c2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 012.4 5.79c0 4.54-3.7 8.21-8.19 8.21zm4.5-6.14c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
              </svg>
              Finalizar no WhatsApp
            </>
          )}
        </button>

        <p className="mt-2 text-center text-xs text-slate-500">
          Ao finalizar, a venda é registrada automaticamente e o estoque é atualizado.
        </p>

        <Link
          href="/produtos"
          className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-medium text-slate-700 transition hover:border-slate-400 hover:text-black"
        >
          Continuar comprando
        </Link>

        <button
          type="button"
          onClick={limparCarrinho}
          className="mt-3 w-full text-center text-xs font-medium text-slate-500 transition hover:text-red-600"
        >
          Limpar carrinho
        </button>
      </aside>
    </div>
  );
}

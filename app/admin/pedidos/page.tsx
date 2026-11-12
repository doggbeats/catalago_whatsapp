"use client";

import { useEffect, useState } from "react";
import { formatBRL } from "@/lib/format";
import type { Pedido, StatusPedido } from "@/lib/tipos";

const labels: Record<StatusPedido, string> = {
  aguardando: "Aguardando",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusColors: Record<StatusPedido, string> = {
  aguardando: "bg-amber-100 text-amber-700",
  confirmado: "bg-blue-100 text-blue-700",
  concluido: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

function formatData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

type ResumoVendido = {
  nome: string;
  quantidade: number;
  faturamento: number;
  pedidos: number;
};

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroMes, setFiltroMes] = useState(getCurrentMonthYear().month);
  const [filtroAno, setFiltroAno] = useState(getCurrentMonthYear().year);
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | "todos">("todos");
  const [processando, setProcessando] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    let ativo = true;

    fetch("/api/pedidos")
      .then((res) => res.json())
      .then((dados: Pedido[]) => {
        if (!ativo) return;
        setPedidos(dados);
        setLoading(false);
      })
      .catch(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function carregar() {
    const res = await fetch("/api/pedidos");
    if (res.ok) setPedidos(await res.json());
  }

  async function atualizarStatus(id: number, status: StatusPedido) {
    setProcessando(id);
    setMensagem(null);

    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMensagem({
          tipo: "erro",
          texto: data.error ?? "Não foi possível atualizar o pedido.",
        });
        return;
      }

      setMensagem({
        tipo: "sucesso",
        texto:
          status === "concluido"
            ? "Venda concluída: estoque baixado e valor contabilizado."
            : `Pedido atualizado para ${labels[status].toLowerCase()}.`,
      });
      await carregar();
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro de conexão ao atualizar o pedido." });
    } finally {
      setProcessando(null);
    }
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este pedido? O estoque será devolvido se já tiver sido baixado."))
      return;

    setProcessando(id);
    setMensagem(null);

    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMensagem({
          tipo: "erro",
          texto: data.error ?? "Não foi possível excluir o pedido.",
        });
        return;
      }
      setMensagem({ tipo: "sucesso", texto: "Pedido excluído." });
      await carregar();
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro de conexão ao excluir o pedido." });
    } finally {
      setProcessando(null);
    }
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const d = new Date(p.data);
    return d.getMonth() + 1 === filtroMes && d.getFullYear() === filtroAno;
  });

  const concluidos = pedidosFiltrados.filter((p) => p.status === "concluido");
  const pendentes = pedidosFiltrados.filter(
    (p) => p.status === "aguardando" || p.status === "confirmado",
  );

  const totais = {
    total: pedidosFiltrados.length,
    aguardando: pedidosFiltrados.filter((p) => p.status === "aguardando").length,
    confirmado: pedidosFiltrados.filter((p) => p.status === "confirmado").length,
    concluido: concluidos.length,
    cancelado: pedidosFiltrados.filter((p) => p.status === "cancelado").length,
    unidadesVendidas: concluidos.reduce((soma, p) => soma + p.quantidade, 0),
    faturamento: concluidos.reduce((soma, p) => soma + p.valor, 0),
    unidadesPendentes: pendentes.reduce((soma, p) => soma + p.quantidade, 0),
    ticketMedio: concluidos.length
      ? concluidos.reduce((soma, p) => soma + p.valor, 0) / concluidos.length
      : 0,
  };

  const hoje = new Date();
  const pedidosHoje = pedidos
    .filter((p) => mesmoDia(new Date(p.data), hoje))
    .sort((a, b) => (a.data < b.data ? 1 : -1));
  const vendasHoje = pedidosHoje.filter((p) => p.status === "concluido");
  const faturamentoHoje = vendasHoje.reduce((s, p) => s + p.valor, 0);
  const unidadesHoje = vendasHoje.reduce((s, p) => s + p.quantidade, 0);
  const ultimaVenda = vendasHoje[0];
  const ticketMedioHoje = vendasHoje.length
    ? faturamentoHoje / vendasHoje.length
    : 0;

  const maisVendidos = Object.values(
    concluidos.reduce<Record<string, ResumoVendido>>((acc, p) => {
      const chave = String(p.produtoId);
      acc[chave] ??= {
        nome: p.nome,
        quantidade: 0,
        faturamento: 0,
        pedidos: 0,
      };
      acc[chave].quantidade += p.quantidade;
      acc[chave].faturamento += p.valor;
      acc[chave].pedidos += 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const maiorQuantidade = Math.max(1, ...maisVendidos.map((p) => p.quantidade));

  const ultimos7Dias = Array.from({ length: 7 }, (_, indice) => {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    inicio.setDate(inicio.getDate() - (6 - indice));
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 1);

    const doDia = pedidos.filter((p) => {
      const data = new Date(p.data);
      return p.status === "concluido" && data >= inicio && data < fim;
    });

    return {
      label: inicio.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      data: inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      unidades: doDia.reduce((s, p) => s + p.quantidade, 0),
      faturamento: doDia.reduce((s, p) => s + p.valor, 0),
    };
  });
  const maiorDia = Math.max(1, ...ultimos7Dias.map((d) => d.unidades));

  const pedidosTabela = pedidos
    .filter((p) => filtroStatus === "todos" || p.status === filtroStatus)
    .sort((a, b) => (a.data < b.data ? 1 : -1));

  const cardClass = "rounded-xl border border-slate-200 bg-white p-6";

  const card = (titulo: string, valor: string, cor: string, detalhe?: string) => (
    <div className={cardClass}>
      <p className="text-base text-black">{titulo}</p>
      <p className={`mt-2 text-3xl font-bold ${cor}`}>{valor}</p>
      {detalhe ? <p className="mt-1 text-xs text-black">{detalhe}</p> : null}
    </div>
  );

  const meses = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const anos = Array.from({ length: 5 }, (_, i) => getCurrentMonthYear().year - 2 + i);

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Dashboard de Vendas</h1>
      <p className="mt-2 text-base text-black sm:text-lg">
        Acompanhe as vendas, conclua pedidos e veja os produtos mais vendidos.
      </p>

      {mensagem ? (
        <div
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-lg border px-4 py-3 text-sm font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </div>
      ) : null}

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-black">Vendas de hoje</h2>
            <p className="text-sm capitalize text-black">
              {hoje.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-black">
            Contabiliza apenas pedidos concluídos
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {card("Vendas hoje", String(vendasHoje.length), "text-black", "pedidos concluídos")}
          {card("Faturamento hoje", formatBRL(faturamentoHoje), "text-green-600")}
          {card("Unidades vendidas", String(unidadesHoje), "text-blue-600")}
          {card(
            "Última venda",
            ultimaVenda ? formatHora(ultimaVenda.data) : "—",
            "text-amber-600",
            ultimaVenda ? ultimaVenda.nome : "nenhuma venda concluída",
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="font-semibold text-black">
              Pedidos de hoje ({pedidosHoje.length})
            </p>
            <p className="text-sm text-black">
              Ticket médio concluído: {formatBRL(ticketMedioHoje)}
            </p>
          </div>

          {pedidosHoje.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-black">
              Nenhum pedido registrado hoje ainda. As vendas do site aparecem
              aqui automaticamente.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pedidosHoje.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
                >
                  <span className="w-14 font-mono text-base font-bold text-black">
                    {formatHora(p.data)}
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-black">
                    {p.nome}
                    {p.tamanho ? (
                      <span className="ml-1 text-black">({p.tamanho})</span>
                    ) : null}
                  </span>
                  <span className="text-black">{p.quantidade} un.</span>
                  <span className="font-semibold text-black">
                    {formatBRL(p.valor)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[p.status]}`}
                  >
                    {labels[p.status]}
                  </span>
                  {p.status !== "concluido" && p.status !== "cancelado" ? (
                    <button
                      type="button"
                      onClick={() => atualizarStatus(p.id, "concluido")}
                      disabled={processando === p.id}
                      className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                      {processando === p.id ? "Concluindo..." : "Concluir"}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-black">Últimos 7 dias</h2>
              <p className="text-xs text-black">Unidades vendidas por dia</p>
            </div>
            <span className="text-sm font-semibold text-black">
              {formatBRL(ultimos7Dias.reduce((s, d) => s + d.faturamento, 0))}
            </span>
          </div>

          <div className="mt-6 flex h-40 items-end gap-2">
            {ultimos7Dias.map((dia) => (
              <div key={dia.data} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-semibold text-black">
                  {dia.unidades || ""}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-amber-400 transition-all"
                    style={{ height: `${Math.max((dia.unidades / maiorDia) * 100, 2)}%` }}
                    title={`${dia.unidades} unidade(s) · ${formatBRL(dia.faturamento)}`}
                  />
                </div>
                <span className="text-[11px] capitalize text-black">{dia.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-black">Mais vendidos</h2>
              <p className="text-xs text-black">Ranking do mês selecionado</p>
            </div>
            <span className="text-xs font-medium text-black">
              {concluidos.length} venda(s) concluída(s)
            </span>
          </div>

          {maisVendidos.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-black">
              Conclua pedidos para gerar o ranking de produtos mais vendidos.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {maisVendidos.map((produto, indice) => (
                <li key={produto.nome + indice}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-black">
                      {indice + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-black">
                      {produto.nome}
                    </span>
                    <span className="font-semibold text-black">
                      {produto.quantidade} un.
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${(produto.quantidade / maiorQuantidade) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-black">
                    {formatBRL(produto.faturamento)} · {produto.pedidos} pedido(s)
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <span className="text-base font-semibold text-black">Relatório mensal</span>
        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-base text-black outline-none focus:border-blue-500"
        >
          {meses.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-base text-black outline-none focus:border-blue-500"
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {card("Faturamento concluído", formatBRL(totais.faturamento), "text-green-600", `${totais.concluido} pedido(s) concluído(s)`)}
        {card("Ticket médio", formatBRL(totais.ticketMedio), "text-black", "por pedido concluído")}
        {card("Unidades vendidas", String(totais.unidadesVendidas), "text-blue-600")}
        {card("Em aberto", String(totais.aguardando + totais.confirmado), "text-amber-600", `${totais.unidadesPendentes} unidade(s) pendente(s)`)}
        {card("Total de pedidos", String(totais.total), "text-black")}
        {card("Aguardando", String(totais.aguardando), "text-amber-600")}
        {card("Confirmados", String(totais.confirmado), "text-blue-600")}
        {card("Cancelados", String(totais.cancelado), "text-red-600")}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-black">
          Pedidos ({pedidosTabela.length})
        </h2>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusPedido | "todos")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-black outline-none focus:border-blue-500"
        >
          <option value="todos">Todos os status</option>
          {(Object.keys(labels) as StatusPedido[]).map((status) => (
            <option key={status} value={status}>
              {labels[status]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-4 text-black">Carregando...</p>
      ) : (
        <>
          <p className="mt-3 text-xs text-slate-500 sm:hidden">Deslize a tabela para os lados para ver todas as colunas.</p>
          <div className="mt-2 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white [touch-action:pan-x] sm:mt-4">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-black">
              <tr>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Qtd.</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Hora</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pedidosTabela.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                pedidosTabela.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-black">
                      {p.nome}
                      {p.tamanho ? (
                        <span className="ml-1 text-xs text-black">({p.tamanho})</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{p.quantidade}</td>
                    <td className="px-4 py-3">{formatBRL(p.valor)}</td>
                    <td className="px-4 py-3 text-black">{formatData(p.data)}</td>
                    <td className="px-4 py-3 font-mono text-black">{formatHora(p.data)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          atualizarStatus(p.id, e.target.value as StatusPedido)
                        }
                        disabled={processando === p.id}
                        className={`rounded-md border border-transparent px-2 py-1 text-xs font-semibold outline-none disabled:opacity-60 ${statusColors[p.status]}`}
                      >
                        {(Object.keys(labels) as StatusPedido[]).map((s) => (
                          <option key={s} value={s}>
                            {labels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {p.status !== "concluido" && p.status !== "cancelado" ? (
                          <button
                            type="button"
                            onClick={() => atualizarStatus(p.id, "concluido")}
                            disabled={processando === p.id}
                            className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                          >
                            {processando === p.id ? "Concluindo..." : "Concluir venda"}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => excluir(p.id)}
                          disabled={processando === p.id}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}

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

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroMes, setFiltroMes] = useState(getCurrentMonthYear().month);
  const [filtroAno, setFiltroAno] = useState(getCurrentMonthYear().year);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const res = await fetch("/api/pedidos");
    setPedidos(await res.json());
    setLoading(false);
  }

  async function atualizarStatus(id: number, status: StatusPedido) {
    await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await carregar();
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este pedido? O estoque será devolvido.")) return;
    await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
    await carregar();
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const d = new Date(p.data);
    return d.getMonth() + 1 === filtroMes && d.getFullYear() === filtroAno;
  });

  const totais = {
    total: pedidosFiltrados.length,
    aguardando: pedidosFiltrados.filter((p) => p.status === "aguardando").length,
    confirmado: pedidosFiltrados.filter((p) => p.status === "confirmado").length,
    concluido: pedidosFiltrados.filter((p) => p.status === "concluido").length,
    cancelado: pedidosFiltrados.filter((p) => p.status === "cancelado").length,
    unidades: pedidosFiltrados.filter((p) => p.status !== "cancelado").reduce((s, p) => s + p.quantidade, 0),
    faturamento: pedidosFiltrados
      .filter((p) => p.status !== "cancelado")
      .reduce((s, p) => s + p.valor, 0),
  };

  const hoje = new Date();
  const pedidosHoje = pedidos
    .filter((p) => mesmoDia(new Date(p.data), hoje))
    .sort((a, b) => (a.data < b.data ? 1 : -1));
  const vendasHoje = pedidosHoje.filter((p) => p.status !== "cancelado");
  const faturamentoHoje = vendasHoje.reduce((s, p) => s + p.valor, 0);
  const unidadesHoje = vendasHoje.reduce((s, p) => s + p.quantidade, 0);
  const ultimaVenda = vendasHoje[0];
  const ticketMedioHoje = vendasHoje.length
    ? faturamentoHoje / vendasHoje.length
    : 0;

  const cardClass =
    "rounded-xl border border-slate-200 bg-white p-6";

  const card = (
    titulo: string,
    valor: string,
    cor: string,
  ) => (
    <div className={cardClass}>
      <p className="text-base text-black">{titulo}</p>
      <p className={`mt-2 text-4xl font-bold ${cor}`}>{valor}</p>
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold text-black">Dashboard de Pedidos</h1>
      <p className="mt-2 text-lg text-black">
        Controle dos pedidos encaminhados ao WhatsApp e saída de estoque.
      </p>

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
            Atualizado automaticamente
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {card("Vendas hoje", String(vendasHoje.length), "text-black")}
          {card("Faturamento hoje", formatBRL(faturamentoHoje), "text-green-600")}
          {card("Unidades vendidas", String(unidadesHoje), "text-blue-600")}
          {card(
            "Última venda",
            ultimaVenda ? formatHora(ultimaVenda.data) : "—",
            "text-amber-600",
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="font-semibold text-black">
              Vendas registradas hoje ({pedidosHoje.length})
            </p>
            <p className="text-sm text-black">
              Ticket médio: {formatBRL(ticketMedioHoje)}
            </p>
          </div>

          {pedidosHoje.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-black">
              Nenhuma venda registrada hoje ainda. As vendas do site aparecem
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
                      <span className="ml-1 text-black">
                        ({p.tamanho})
                      </span>
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
                </li>
              ))}
            </ul>
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
        {card("Faturamento estimado", formatBRL(totais.faturamento), "text-green-600")}
        {card("Total de pedidos", String(totais.total), "text-black")}
        {card("Aguardando", String(totais.aguardando), "text-amber-600")}
        {card("Unidades saídas", String(totais.unidades), "text-blue-600")}
        {card("Confirmados", String(totais.confirmado), "text-blue-600")}
        {card("Concluídos", String(totais.concluido), "text-green-600")}
        {card("Cancelados", String(totais.cancelado), "text-red-600")}
      </div>

      <h2 className="mt-10 text-2xl font-bold text-black">Pedidos ({pedidos.length})</h2>

      {loading ? (
        <p className="mt-4 text-black">Carregando...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
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
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black">
                    Nenhum pedido registrado ainda.
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-black">
                      {p.nome}
                      {p.tamanho ? (
                        <span className="ml-1 text-xs text-black">
                          ({p.tamanho})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{p.quantidade}</td>
                    <td className="px-4 py-3">{formatBRL(p.valor)}</td>
                    <td className="px-4 py-3 text-black">{formatData(p.data)}</td>
                    <td className="px-4 py-3 font-mono text-black">{formatHora(p.data)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={(e) => atualizarStatus(p.id, e.target.value as StatusPedido)}
                        className={`rounded-md border border-transparent px-2 py-1 text-xs font-semibold outline-none ${statusColors[p.status]}`}
                      >
                        {(Object.keys(labels) as StatusPedido[]).map((s) => (
                          <option key={s} value={s}>
                            {labels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => excluir(p.id)}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

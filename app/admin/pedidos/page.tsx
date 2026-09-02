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
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totais = {
    total: pedidos.length,
    aguardando: pedidos.filter((p) => p.status === "aguardando").length,
    confirmado: pedidos.filter((p) => p.status === "confirmado").length,
    concluido: pedidos.filter((p) => p.status === "concluido").length,
    cancelado: pedidos.filter((p) => p.status === "cancelado").length,
    unidades: pedidos.filter((p) => p.status !== "cancelado").reduce((s, p) => s + p.quantidade, 0),
    faturamento: pedidos
      .filter((p) => p.status !== "cancelado")
      .reduce((s, p) => s + p.valor, 0),
  };

  const cardClass =
    "rounded-xl border border-slate-200 bg-white p-5";

  const card = (
    titulo: string,
    valor: string,
    cor: string,
  ) => (
    <div className={cardClass}>
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className={`mt-1 text-2xl font-bold ${cor}`}>{valor}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">Dashboard de Pedidos</h1>
      <p className="mt-1 text-slate-600">
        Controle dos pedidos encaminhados ao WhatsApp e saída de estoque.
      </p>

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
        <p className="mt-4 text-slate-600">Carregando...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Qtd.</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Nenhum pedido registrado ainda.
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-black">{p.nome}</td>
                    <td className="px-4 py-3">{p.quantidade}</td>
                    <td className="px-4 py-3">{formatBRL(p.valor)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatData(p.data)}</td>
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

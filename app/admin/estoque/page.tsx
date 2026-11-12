"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ESTOQUE_BAIXO, nivelEstoque, rotuloEstoque } from "@/lib/estoque";

type Produto = {
  id: number;
  name: string;
  marca?: string;
  image: string;
  quantity: number;
};

const badge: Record<string, string> = {
  sem: "bg-red-100 text-red-700",
  baixo: "bg-amber-100 text-amber-700",
  ok: "bg-green-100 text-green-700",
};

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [quantidades, setQuantidades] = useState<Record<number, string>>({});
  const [salvando, setSalvando] = useState<number | null>(null);
  const [salvo, setSalvo] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    let ativo = true;

    fetch("/api/produtos")
      .then((res) => res.json())
      .then((dados: Produto[]) => {
        if (!ativo) return;
        setProdutos(dados);
        setQuantidades(
          Object.fromEntries(dados.map((p) => [p.id, String(p.quantity)])),
        );
        setLoading(false);
      })
      .catch(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function salvar(id: number) {
    const valor = Number(quantidades[id]);
    if (!Number.isFinite(valor) || valor < 0) {
      setMensagem({
        tipo: "erro",
        texto: "Informe uma quantidade válida (0 ou mais).",
      });
      return;
    }

    setSalvando(id);
    setMensagem(null);
    const res = await fetch(`/api/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Math.floor(valor) }),
    });
    setSalvando(null);

    if (res.ok) {
      const atualizado: Produto = await res.json();
      setProdutos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...atualizado } : p)),
      );
      setQuantidades((prev) => ({
        ...prev,
        [id]: String(atualizado.quantity),
      }));
      setSalvo(id);
      setTimeout(() => setSalvo((atual) => (atual === id ? null : atual)), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setMensagem({
        tipo: "erro",
        texto: data.error ?? "Não foi possível atualizar o estoque.",
      });
    }
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este produto? Esta ação não pode ser desfeita.")) return;

    setExcluindo(id);
    setMensagem(null);

    try {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMensagem({
          tipo: "erro",
          texto: data.error ?? "Não foi possível excluir o produto.",
        });
        return;
      }

      setProdutos((prev) => prev.filter((p) => p.id !== id));
      setQuantidades((prev) => {
        const proximo = { ...prev };
        delete proximo[id];
        return proximo;
      });
      setMensagem({ tipo: "sucesso", texto: "Produto excluído do catálogo." });
    } catch {
      setMensagem({
        tipo: "erro",
        texto: "Erro de conexão ao excluir o produto.",
      });
    } finally {
      setExcluindo(null);
    }
  }

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(
      (p) =>
        p.name.toLowerCase().includes(termo) ||
        p.marca?.toLowerCase().includes(termo),
    );
  }, [produtos, busca]);

  const totais = {
    produtos: produtos.length,
    unidades: produtos.reduce((soma, p) => soma + p.quantity, 0),
    baixos: produtos.filter((p) => nivelEstoque(p.quantity) === "baixo").length,
    sem: produtos.filter((p) => nivelEstoque(p.quantity) === "sem").length,
  };

  const card = (titulo: string, valor: string, cor: string) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-black">{titulo}</p>
      <p className={`mt-1 text-3xl font-bold ${cor}`}>{valor}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">Controle de Estoque</h1>
      <p className="mt-1 text-black">
        Acompanhe as unidades disponíveis. Produtos com {ESTOQUE_BAIXO} unidades
        ou menos recebem alerta de estoque baixo.
      </p>

      {mensagem ? (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {card("Produtos cadastrados", String(totais.produtos), "text-black")}
        {card("Unidades em estoque", String(totais.unidades), "text-blue-600")}
        {card("Estoque baixo", String(totais.baixos), "text-amber-600")}
        {card("Sem estoque", String(totais.sem), "text-red-600")}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por produto ou marca..."
          className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-blue-500"
        />
        <p className="text-sm text-black">
          {filtrados.length} de {produtos.length} produtos
        </p>
      </div>

      {loading ? (
        <p className="mt-6 text-black">Carregando estoque...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-black">
              <tr>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Estoque atual</th>
                <th className="px-4 py-3 font-semibold">Situação</th>
                <th className="px-4 py-3 font-semibold">Ajustar estoque</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((p) => {
                const nivel = nivelEstoque(p.quantity);
                return (
                  <tr
                    key={p.id}
                    className={
                      nivel === "sem"
                        ? "bg-red-50/60"
                        : nivel === "baixo"
                          ? "bg-amber-50/60"
                          : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-lg">📦</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-black">{p.name}</p>
                          {p.marca ? (
                            <p className="text-xs text-black">{p.marca}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-black">
                        {p.quantity}
                      </span>{" "}
                      <span className="text-xs text-black">un.</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge[nivel]}`}
                      >
                        {rotuloEstoque[nivel]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={quantidades[p.id] ?? ""}
                          onChange={(e) =>
                            setQuantidades((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm text-black outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => salvar(p.id)}
                          disabled={salvando === p.id}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          {salvando === p.id ? "Salvando..." : "Salvar"}
                        </button>
                        {salvo === p.id ? (
                          <span className="text-xs font-medium text-green-600">
                            ✓ Salvo
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin?editar=${p.id}`}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-black transition hover:bg-slate-100"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => excluir(p.id)}
                          disabled={excluindo === p.id}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          {excluindo === p.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: number;
  name: string;
  description: string;
  price: number;
  promotion: number | null;
  category: string;
  quantity: number;
  image: string;
  specs: string[];
  installments: number;
};

const categorias = ["Áudio", "Computadores", "Periféricos", "Ferramentas", "Videogames", "Monitores"];

type FormState = {
  name: string;
  description: string;
  price: string;
  promotion: string;
  category: string;
  quantity: string;
  image: string;
  specs: string;
  installments: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  promotion: "",
  category: categorias[0],
  quantity: "",
  image: "",
  specs: "",
  installments: "4",
};

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [previa, setPrevia] = useState<string>("");
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const res = await fetch("/api/produtos");
    setProdutos(await res.json());
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlerArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setPrevia(URL.createObjectURL(arquivo));
    setEnviandoImagem(true);
    try {
      const fd = new FormData();
      fd.append("file", arquivo);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Erro ao enviar imagem");
        setPrevia("");
        return;
      }
      const data = await res.json();
      setForm({ ...form, image: data.image });
    } finally {
      setEnviandoImagem(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      promotion: form.promotion ? Number(form.promotion) : null,
      category: form.category,
      quantity: Number(form.quantity),
      image: form.image,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      installments: Number(form.installments) || 1,
    };
    if (editingId !== null) {
      await fetch(`/api/produtos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setForm(emptyForm);
    setPrevia("");
    setEditingId(null);
    await carregar();
  }

  function iniciarEdicao(p: Produto) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      promotion: p.promotion ? String(p.promotion) : "",
      category: p.category,
      quantity: String(p.quantity),
      image: p.image,
      specs: p.specs?.join(", ") ?? "",
      installments: String(p.installments ?? 1),
    });
    setPrevia(p.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    await carregar();
  }

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black outline-none focus:border-blue-500 focus:bg-white";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">Gestão de Produtos</h1>
      <p className="mt-1 text-slate-600">Cadastre produtos e anexe imagens.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="text-xl font-bold text-black md:col-span-2">
          {editingId !== null ? "Editar produto" : "Novo produto"}
        </h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Nome do produto" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className={inputClass} placeholder="0.00" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Valor promocional (R$)</label>
          <input name="promotion" type="number" step="0.01" value={form.promotion} onChange={handleChange} className={inputClass} placeholder="Deixe vazio se não houver" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Descrição do produto</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Descreva as características e benefícios do produto"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quantidade em estoque</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required className={inputClass} placeholder="0" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Parcelas (até quantas vezes)</label>
          <input name="installments" type="number" min="1" value={form.installments} onChange={handleChange} className={inputClass} placeholder="4" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Imagem do produto</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {enviandoImagem ? "Enviando..." : "Anexar imagem"}
              <input
                type="file"
                accept="image/*"
                onChange={handlerArquivo}
                className="hidden"
              />
            </label>
            {previa ? (
              <img src={previa} alt="Prévia" className="h-16 w-16 rounded-lg border border-slate-200 object-contain" />
            ) : (
              <span className="text-sm text-slate-400">Nenhuma imagem anexada</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Especificações (separadas por vírgula)</label>
          <input name="specs" value={form.specs} onChange={handleChange} className={inputClass} placeholder="Bluetooth 5.0, Bateria 10h, 20W" />
        </div>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            {editingId !== null ? "Salvar alterações" : "Adicionar produto"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setPrevia("");
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="mt-10 text-2xl font-bold text-black">Produtos ({produtos.length})</h2>

      {loading ? (
        <p className="mt-4 text-slate-600">Carregando...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Promoção</th>
                <th className="px-4 py-3 font-semibold">Qtd.</th>
                <th className="px-4 py-3 font-semibold">Parcelas</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produtos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-black">{p.name}</p>
                    {p.description ? (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500" title={p.description}>
                        {p.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3">{formatBRL(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.promotion ? (
                      <span className="font-semibold text-green-600">{formatBRL(p.promotion)}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.quantity}</td>
                  <td className="px-4 py-3">{p.installments}x</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicao(p)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluir(p.id)}
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useImagensConfiguradas, useSomenteLeitura } from "./useSomenteLeitura";

type Produto = {
  id: number;
  name: string;
  description: string;
  price: number;
  promotion: number | null;
  category: string;
  marca?: string;
  modelo?: string;
  tipo?: string;
  cor?: string;
  tamanho?: string;
  qualidade?: string;
  quantity: number;
  image: string;
  images?: string[];
  specs: string[];
  installments: number;
};

const MAX_IMAGENS = 8;
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

const categoriasIniciais = ["Masculino", "Feminino", "Infantil", "Painel de novidades"];
const marcasIniciais = ["Adidas", "New Balance", "Mizuno", "Nike", "Jordan", "Fila", "Humbro"];
const tipos = ["Corrida", "Casual", "Esportivo", "Fashion", "Slip-on", "Lazer"];
const cores = [
  "Preto",
  "Branco",
  "Cinza",
  "Azul",
  "Vermelho",
  "Verde",
  "Amarelo",
  "Rosa",
  "Bege",
  "Marrom",
  "Multicolorido",
];
const qualidades = ["Original", "Premium", "Nacional", "Importado", "Similar"];

const sugestoesSpecs = [
  "Leve",
  "Respirável",
  "Confortável",
  "Macio",
  "Amortecimento",
  "Solado emborrachado",
  "Solado EVA",
  "Cabedal em mesh",
  "Cabedal sintético",
  "Sem cadarço",
  "Anti-deslizante",
  "Antiderrapante",
  "Flexível",
  "Acabamento premium",
  "Alta durabilidade",
  "Unissex",
  ...cores,
];

type FormState = {
  name: string;
  description: string;
  price: string;
  promotion: string;
  category: string;
  marca: string;
  modelo: string;
  tipo: string;
  cor: string;
  tamanho: string;
  qualidade: string;
  quantity: string;
  imagens: string[];
  specs: string;
  installments: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  promotion: "",
  category: "Masculino",
  marca: "",
  modelo: "",
  tipo: "",
  cor: cores[0],
  tamanho: "",
  qualidade: qualidades[0],
  quantity: "",
  imagens: [],
  specs: "",
  installments: "4",
};

type Mensagem = { tipo: "sucesso" | "erro"; texto: string };

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function imagensDoProduto(p: Produto): string[] {
  if (p.images?.length) return p.images;
  return p.image ? [p.image] : [];
}

export default function AdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [categorias] = useState<string[]>(categoriasIniciais);
  const [marcasExtras, setMarcasExtras] = useState<string[]>([]);
  const [marcasOcultas, setMarcasOcultas] = useState<string[]>([]);
  const [novaMarca, setNovaMarca] = useState("");
  const somenteLeitura = useSomenteLeitura();
  const imagensConfiguradas = useImagensConfiguradas();

  // Marcas disponíveis = sugestões + marcas já cadastradas nos produtos
  // + as criadas nesta sessão, menos as removidas.
  const marcas = useMemo(() => {
    const nomes = new Set<string>(marcasIniciais);
    for (const produto of produtos) {
      if (produto.marca) nomes.add(produto.marca);
    }
    for (const marca of marcasExtras) nomes.add(marca);
    for (const marca of marcasOcultas) nomes.delete(marca);
    return [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [produtos, marcasExtras, marcasOcultas]);
  const edicaoDaUrlAplicada = useRef(false);

  function iniciarEdicao(p: Produto) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      promotion: p.promotion ? String(p.promotion) : "",
      category: p.category,
      marca: p.marca ?? "",
      modelo: p.modelo ?? "",
      tipo: p.tipo ?? "",
      cor: p.cor ?? "",
      tamanho: p.tamanho ?? "",
      qualidade: p.qualidade ?? "",
      quantity: String(p.quantity),
      imagens: imagensDoProduto(p),
      specs: p.specs?.join(", ") ?? "",
      installments: String(p.installments ?? 1),
    });
    setMensagem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditingId(null);
    setForm(emptyForm);
    setMensagem(null);
  }

  async function carregar() {
    try {
      const res = await fetch("/api/produtos");
      if (!res.ok) throw new Error("Falha ao carregar produtos");
      setProdutos(await res.json());
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível carregar os produtos." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    fetch("/api/produtos")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar produtos");
        return res.json() as Promise<Produto[]>;
      })
      .then((dados) => {
        if (!ativo) return;
        setProdutos(dados);

        if (!edicaoDaUrlAplicada.current) {
          edicaoDaUrlAplicada.current = true;
          const params = new URLSearchParams(window.location.search);
          const id = Number(params.get("editar"));
          const alvo = dados.find((p) => p.id === id);
          if (alvo) {
            iniciarEdicao(alvo);
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      })
      .catch(() => {
        if (ativo) {
          setMensagem({
            tipo: "erro",
            texto: "Não foi possível carregar os produtos.",
          });
        }
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function adicionarMarca() {
    const nome = novaMarca.trim();
    if (!nome) return;

    const existente = marcas.find(
      (m) => m.toLowerCase() === nome.toLowerCase(),
    );

    if (existente) {
      setMarcasOcultas((prev) =>
        prev.filter((m) => m.toLowerCase() !== nome.toLowerCase()),
      );
      setForm((atual) => ({ ...atual, marca: existente }));
    } else {
      setMarcasExtras((prev) => [...prev, nome]);
      setForm((atual) => ({ ...atual, marca: nome }));
    }

    setNovaMarca("");
  }

  function removerMarca(marca: string) {
    setMarcasExtras((prev) => prev.filter((m) => m !== marca));
    setMarcasOcultas((prev) =>
      prev.includes(marca) ? prev : [...prev, marca],
    );
    setForm((atual) =>
      atual.marca === marca ? { ...atual, marca: "" } : atual,
    );
  }

  function adicionarSpec(valor: string) {
    setForm((atual) => {
      const atuais = atual.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const existe = atuais.some((s) => s.toLowerCase() === valor.toLowerCase());
      const novos = existe
        ? atuais.filter((s) => s.toLowerCase() !== valor.toLowerCase())
        : [...atuais, valor];
      return { ...atual, specs: novos.join(", ") };
    });
  }

  function removerImagem(src: string) {
    setForm((atual) => ({
      ...atual,
      imagens: atual.imagens.filter((imagem) => imagem !== src),
    }));
  }

  function definirPrincipal(src: string) {
    setForm((atual) => ({
      ...atual,
      imagens: [src, ...atual.imagens.filter((imagem) => imagem !== src)],
    }));
  }

  async function handlerArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const arquivos = Array.from(input.files ?? []);
    if (!arquivos.length) return;

    if (somenteLeitura || !imagensConfiguradas) {
      input.value = "";
      setMensagem({
        tipo: "erro",
        texto: "O envio de imagens está desativado neste ambiente.",
      });
      return;
    }

    setMensagem(null);
    setEnviandoImagem(true);

    const enviadas: string[] = [];
    const erros: string[] = [];
    const espacos = MAX_IMAGENS - form.imagens.length;

    for (const arquivo of arquivos.slice(0, Math.max(espacos, 0))) {
      if (!arquivo.type.startsWith("image/")) {
        erros.push(`${arquivo.name}: formato inválido.`);
        continue;
      }
      if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
        erros.push(`${arquivo.name}: maior que 5MB.`);
        continue;
      }

      try {
        const fd = new FormData();
        fd.append("file", arquivo);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          erros.push(data.error ?? `${arquivo.name}: falha no envio.`);
          continue;
        }
        enviadas.push(data.image);
      } catch {
        erros.push(`${arquivo.name}: erro de conexão.`);
      }
    }

    if (arquivos.length > Math.max(espacos, 0)) {
      erros.push(`Máximo de ${MAX_IMAGENS} imagens por produto.`);
    }

    if (enviadas.length) {
      setForm((atual) => {
        const imagens = [...atual.imagens];
        for (const src of enviadas) {
          if (!imagens.includes(src)) imagens.push(src);
        }
        return { ...atual, imagens: imagens.slice(0, MAX_IMAGENS) };
      });
    }

    input.value = "";
    setEnviandoImagem(false);

    if (erros.length) {
      setMensagem({ tipo: "erro", texto: erros.join(" ") });
    } else if (enviadas.length) {
      setMensagem({
        tipo: "sucesso",
        texto:
          enviadas.length === 1
            ? "Imagem anexada."
            : `${enviadas.length} imagens anexadas.`,
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (somenteLeitura) {
      setMensagem({
        tipo: "erro",
        texto:
          "Este ambiente é somente leitura: o produto não pode ser salvo na Vercel.",
      });
      return;
    }

    if (enviandoImagem) {
      setMensagem({ tipo: "erro", texto: "Aguarde o envio das imagens terminar." });
      return;
    }

    const nome = form.name.trim();
    const preco = Number(form.price);
    const quantidade = Number(form.quantity);
    const parcelas = Number(form.installments);
    const promocaoTexto = form.promotion.trim();
    const promocao = promocaoTexto ? Number(promocaoTexto) : null;

    if (!nome) {
      setMensagem({ tipo: "erro", texto: "Informe o nome do produto." });
      return;
    }
    if (!Number.isFinite(preco) || preco <= 0) {
      setMensagem({ tipo: "erro", texto: "Informe um valor válido para o produto." });
      return;
    }
    if (
      promocao !== null &&
      (!Number.isFinite(promocao) || promocao <= 0 || promocao >= preco)
    ) {
      setMensagem({
        tipo: "erro",
        texto: "O valor promocional deve ser maior que zero e menor que o valor original.",
      });
      return;
    }
    if (!Number.isFinite(quantidade) || quantidade < 0) {
      setMensagem({ tipo: "erro", texto: "Informe uma quantidade em estoque válida." });
      return;
    }
    if (!form.imagens.length) {
      setMensagem({ tipo: "erro", texto: "Anexe pelo menos uma imagem do produto." });
      return;
    }

    const editando = editingId !== null;
    const payload = {
      name: nome,
      description: form.description.trim(),
      price: preco,
      promotion: promocao,
      category: form.category,
      marca: form.marca || undefined,
      modelo: form.modelo.trim() || undefined,
      tipo: form.tipo || undefined,
      cor: form.cor || undefined,
      tamanho: form.tamanho.trim() || undefined,
      qualidade: form.qualidade || undefined,
      quantity: Math.floor(quantidade),
      image: form.imagens[0],
      images: form.imagens,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      installments: Number.isFinite(parcelas) && parcelas > 0 ? Math.floor(parcelas) : 1,
    };

    setSalvando(true);
    setMensagem(null);

    try {
      const res = await fetch(
        editando ? `/api/produtos/${editingId}` : "/api/produtos",
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMensagem({
          tipo: "erro",
          texto: data.error ?? "Não foi possível salvar o produto.",
        });
        return;
      }

      setForm(emptyForm);
      setEditingId(null);
      setMensagem({
        tipo: "sucesso",
        texto: editando ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.",
      });
      await carregar();
    } catch {
      setMensagem({
        tipo: "erro",
        texto: "Erro de conexão ao salvar o produto. Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: number) {
    if (somenteLeitura) {
      setMensagem({
        tipo: "erro",
        texto:
          "Este ambiente é somente leitura: o produto não pode ser excluído na Vercel.",
      });
      return;
    }

    if (!confirm("Excluir este produto?")) return;

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
      if (editingId === id) cancelarEdicao();
      setMensagem({ tipo: "sucesso", texto: "Produto excluído." });
      await carregar();
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro de conexão ao excluir o produto." });
    }
  }

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-black outline-none focus:border-blue-500 focus:bg-white";

  const semEspacoParaImagem = form.imagens.length >= MAX_IMAGENS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-black">Gestão de Produtos</h1>
      <p className="mt-1 text-black">Cadastre produtos e anexe uma ou mais imagens.</p>

      {somenteLeitura ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-black">
          Banco Neon não configurado: adicione DATABASE_URL nas variáveis de ambiente da Vercel para salvar as alterações.
        </div>
      ) : null}

      {!somenteLeitura && !imagensConfiguradas ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-black">
          Conecte um Blob público ao projeto Vercel para habilitar o envio de imagens.
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="text-xl font-bold text-black md:col-span-2">
          {editingId !== null ? "Editar produto" : "Novo produto"}
        </h2>

        {mensagem ? (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm font-medium md:col-span-2 ${
              mensagem.tipo === "sucesso"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {mensagem.texto}
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Nome do produto" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Categoria</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Marca</label>
          <select name="marca" value={form.marca} onChange={handleChange} className={inputClass}>
            <option value="">Sem marca</option>
            {marcas.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Modelo</label>
          <input
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex.: Air Force 1, Wave Prophecy"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-black">Gerenciar marcas</label>
          <div className="flex gap-2">
            <input
              value={novaMarca}
              onChange={(e) => setNovaMarca(e.target.value)}
              className={inputClass}
              placeholder="Nova marca"
            />
            <button
              type="button"
              onClick={adicionarMarca}
              className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Adicionar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {marcas.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-black"
              >
                {m}
                <button
                  type="button"
                  onClick={() => removerMarca(m)}
                  className="text-red-500 transition hover:text-red-700"
                  aria-label={`Remover ${m}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
            <option value="">Sem tipo</option>
            {tipos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Valor (R$)</label>
          <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required className={inputClass} placeholder="0.00" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Valor promocional (R$)</label>
          <input name="promotion" type="number" min="0.01" step="0.01" value={form.promotion} onChange={handleChange} className={inputClass} placeholder="Deixe vazio se não houver" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-black">Descrição do produto</label>
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
          <label className="mb-1 block text-sm font-medium text-black">Cor</label>
          <select name="cor" value={form.cor} onChange={handleChange} className={inputClass}>
            {cores.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Tamanho</label>
          <input name="tamanho" value={form.tamanho} onChange={handleChange} className={inputClass} placeholder="38-44, P, M, G..." />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Qualidade</label>
          <select name="qualidade" value={form.qualidade} onChange={handleChange} className={inputClass}>
            {qualidades.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Quantidade em estoque</label>
          <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} required className={inputClass} placeholder="0" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">Parcelas (até quantas vezes)</label>
          <input name="installments" type="number" min="1" step="1" value={form.installments} onChange={handleChange} className={inputClass} placeholder="4" />
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-medium text-black">Imagens do produto *</label>
            <span className="text-xs font-medium text-black">
              {form.imagens.length} de {MAX_IMAGENS}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-black transition ${
                enviandoImagem || semEspacoParaImagem || somenteLeitura || !imagensConfiguradas
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {enviandoImagem ? "Enviando..." : "Anexar imagens"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handlerArquivos}
                disabled={enviandoImagem || semEspacoParaImagem || somenteLeitura || !imagensConfiguradas}
                className="hidden"
              />
            </label>
            <span className="text-xs text-black">
              JPG, PNG, WEBP ou GIF · até 5MB cada
            </span>
          </div>

          {form.imagens.length ? (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {form.imagens.map((src, indice) => (
                  <div
                    key={src}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <Image
                      src={src}
                      alt={`Imagem ${indice + 1} do produto`}
                      fill
                      className="object-contain p-1"
                      sizes="120px"
                    />
                    {indice === 0 ? (
                      <span className="absolute left-1 top-1 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-black">
                        Principal
                      </span>
                    ) : null}
                    <div className="absolute inset-x-1 bottom-1 flex gap-1">
                      {indice > 0 ? (
                        <button
                          type="button"
                          onClick={() => definirPrincipal(src)}
                          className="flex-1 rounded bg-black/75 px-1 py-1 text-[10px] font-medium text-white transition hover:bg-black"
                        >
                          Principal
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removerImagem(src)}
                        className="flex-1 rounded bg-red-600/90 px-1 py-1 text-[10px] font-medium text-white transition hover:bg-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-black">
                A primeira imagem é a principal do catálogo. Use “Principal” para reordenar.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-black">Nenhuma imagem anexada.</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-black">Especificações (separadas por vírgula)</label>
          <input
            name="specs"
            value={form.specs}
            onChange={handleChange}
            className={inputClass}
            placeholder="Leve, Respirável, Confortável, Original, Preto, Branco"
          />
          <p className="mt-1 text-xs text-black">
            Use palavras-chave de tênis, qualidade e cores para facilitar a busca.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sugestoesSpecs.map((s) => {
              const ativo = form.specs
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .includes(s.toLowerCase());
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => adicionarSpec(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    ativo
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 text-black hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={somenteLeitura || salvando || enviandoImagem}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviandoImagem
              ? "Anexando imagens..."
              : salvando
                ? "Salvando..."
                : editingId !== null
                  ? "Salvar alterações"
                  : "Adicionar produto"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-black transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="mt-10 text-2xl font-bold text-black">Produtos ({produtos.length})</h2>

      {loading ? (
        <p className="mt-4 text-black">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-black">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {produtos.map((p) => {
            const imagens = imagensDoProduto(p);
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 hover:bg-slate-50"
              >
                <div className="flex min-w-0 flex-[1_1_240px] items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {imagens[0] ? (
                      <Image
                        src={imagens[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-lg">📦</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black">{p.name}</p>
                    {p.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-black">
                        {p.description}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-black">
                      {imagens.length} {imagens.length === 1 ? "imagem" : "imagens"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-[1_1_180px] flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-black">
                    {p.category}
                  </span>
                  {[p.cor, p.tamanho, p.qualidade]
                    .filter(Boolean)
                    .map((v) => (
                      <span
                        key={v}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-black"
                      >
                        {v}
                      </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Valor</p>
                    <p className="text-sm font-semibold text-black">
                      {formatBRL(p.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Promoção</p>
                    {p.promotion ? (
                      <p className="text-sm font-semibold text-green-600">
                        {formatBRL(p.promotion)}
                      </p>
                    ) : (
                      <p className="text-sm text-black">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Estoque</p>
                    <p className="text-sm text-black">{p.quantity} un.</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Parcelas</p>
                    <p className="text-sm text-black">{p.installments}x</p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => iniciarEdicao(p)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-black transition hover:bg-slate-100"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluir(p.id)}
                    disabled={somenteLeitura}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

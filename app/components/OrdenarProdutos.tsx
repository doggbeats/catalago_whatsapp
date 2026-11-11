"use client";

import { useRouter } from "next/navigation";

const opcoes = [
  { value: "destaque", label: "Destaques" },
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "nome", label: "Nome (A-Z)" },
];

export default function OrdenarProdutos({
  ordem,
  params,
}: {
  ordem: string;
  params: Record<string, string | undefined>;
}) {
  const router = useRouter();

  function alterar(valor: string) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && v.trim()) sp.set(k, v);
    });
    if (valor && valor !== "destaque") sp.set("ordem", valor);
    else sp.delete("ordem");
    const q = sp.toString();
    router.push(q ? `/produtos?${q}` : "/produtos");
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Ordenar produtos</span>
      <select
        value={ordem}
        onChange={(e) => alterar(e.target.value)}
        className="h-10 appearance-none rounded-xl border border-neutral-200 bg-white pl-3 pr-9 text-sm font-medium text-black outline-none transition hover:border-neutral-400 focus:border-black"
      >
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 h-4 w-4 text-neutral-500"
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
    </label>
  );
}

import Link from "next/link";

export function buildUrl(
  base: string,
  params: Record<string, string | undefined>,
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim()) sp.set(k, v);
  });
  const q = sp.toString();
  return q ? `${base}?${q}` : base;
}

export type Contagem = { nome: string; total: number };

type Props = {
  categoria?: string;
  marca?: string;
  tipo?: string;
  tamanho?: string;
  busca?: string;
  promoAtiva: boolean;
  tamanhos: string[];
  categorias: Contagem[];
  marcas: Contagem[];
  tipos: Contagem[];
};

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-100 px-5 py-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        {titulo}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function OpcaoFiltro({
  href,
  label,
  total,
  ativo,
}: {
  href: string;
  label: string;
  total: number;
  ativo: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-pressed={ativo}
        className={`group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
          ativo
            ? "bg-neutral-100 font-semibold text-black"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition ${
              ativo
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white group-hover:border-neutral-500"
            }`}
          >
            {ativo ? (
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : null}
          </span>
          <span className="truncate">{label}</span>
        </span>
        <span className="text-[11px] tabular-nums text-neutral-400">
          {total}
        </span>
      </Link>
    </li>
  );
}

export default function Filtros({
  categoria,
  marca,
  tipo,
  tamanho,
  busca,
  promoAtiva,
  tamanhos,
  categorias,
  marcas,
  tipos,
}: Props) {
  const base = {
    categoria,
    marca,
    tipo,
    tamanho,
    busca,
    promo: promoAtiva ? "sim" : undefined,
  };

  const url = (overrides: Record<string, string | undefined>) =>
    buildUrl("/produtos", { ...base, ...overrides });

  const temFiltro = Boolean(
    categoria || marca || tipo || tamanho || busca || promoAtiva,
  );

  return (
    <div>
      <Secao titulo="Gêneros">
        <ul className="space-y-0.5">
          {categorias.map((cat) => (
            <OpcaoFiltro
              key={cat.nome}
              href={url({
                categoria: categoria === cat.nome ? undefined : cat.nome,
              })}
              label={cat.nome}
              total={cat.total}
              ativo={categoria === cat.nome}
            />
          ))}
        </ul>
      </Secao>

      <Secao titulo="Tamanhos">
        {tamanhos.length ? (
          <div className="grid grid-cols-5 gap-1.5">
            {tamanhos.map((tam) => {
              const ativo = tamanho === tam;
              return (
                <Link
                  key={tam}
                  href={url({ tamanho: ativo ? undefined : tam })}
                  aria-pressed={ativo}
                  className={`flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                    ativo
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black"
                  }`}
                >
                  {tam}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Nenhum tamanho disponível com os filtros atuais.
          </p>
        )}
      </Secao>

      <Secao titulo="Marcas">
        <ul className="space-y-0.5">
          {marcas.map((m) => (
            <OpcaoFiltro
              key={m.nome}
              href={url({ marca: marca === m.nome ? undefined : m.nome })}
              label={m.nome}
              total={m.total}
              ativo={marca === m.nome}
            />
          ))}
        </ul>
      </Secao>

      <Secao titulo="Tipos">
        <ul className="space-y-0.5">
          {tipos.map((t) => (
            <OpcaoFiltro
              key={t.nome}
              href={url({ tipo: tipo === t.nome ? undefined : t.nome })}
              label={t.nome}
              total={t.total}
              ativo={tipo === t.nome}
            />
          ))}
        </ul>
      </Secao>

      {temFiltro ? (
        <div className="px-5 py-5">
          <Link
            href="/produtos"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-black hover:text-black"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Limpar filtros
          </Link>
        </div>
      ) : null}
    </div>
  );
}

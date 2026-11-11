export type ItemCarrinho = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  tamanho?: string;
  quantidade: number;
};

const CHAVE = "tenis-neon-carrinho";
const EVENTO = "carrinho:atualizado";

function mesmaVariacao(
  a: { id: number; tamanho?: string },
  b: { id: number; tamanho?: string },
): boolean {
  return a.id === b.id && (a.tamanho ?? "") === (b.tamanho ?? "");
}

export function lerCarrinho(): ItemCarrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (item): item is ItemCarrinho =>
        typeof item?.id === "number" && typeof item?.preco === "number",
    );
  } catch {
    return [];
  }
}

function salvar(itens: ItemCarrinho[]) {
  window.localStorage.setItem(CHAVE, JSON.stringify(itens));
  window.dispatchEvent(new Event(EVENTO));
}

export function adicionarAoCarrinho(
  item: Omit<ItemCarrinho, "quantidade">,
  quantidade = 1,
): void {
  const itens = lerCarrinho();
  const existente = itens.find((i) => mesmaVariacao(i, item));

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    itens.push({ ...item, quantidade });
  }

  salvar(itens);
}

export function alterarQuantidade(
  id: number,
  tamanho: string | undefined,
  quantidade: number,
): void {
  const itens = lerCarrinho()
    .map((i) =>
      mesmaVariacao(i, { id, tamanho }) ? { ...i, quantidade } : i,
    )
    .filter((i) => i.quantidade > 0);
  salvar(itens);
}

export function removerDoCarrinho(id: number, tamanho?: string): void {
  salvar(lerCarrinho().filter((i) => !mesmaVariacao(i, { id, tamanho })));
}

export function limparCarrinho(): void {
  salvar([]);
}

export function contarItens(itens: ItemCarrinho[]): number {
  return itens.reduce((total, i) => total + i.quantidade, 0);
}

export function totalCarrinho(itens: ItemCarrinho[]): number {
  return itens.reduce((total, i) => total + i.preco * i.quantidade, 0);
}

export function assinarCarrinho(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}

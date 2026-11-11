export function listaTamanhos(tamanho?: string): string[] {
  if (!tamanho) return [];
  if (tamanho.includes("-")) {
    const [ini, fim] = tamanho.split("-").map((n) => parseInt(n.trim()));
    if (Number.isFinite(ini) && Number.isFinite(fim) && fim >= ini) {
      return Array.from({ length: fim - ini + 1 }, (_, i) => String(ini + i));
    }
  }
  return tamanho
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function tamanhosDisponiveis(
  produtos: Array<{ tamanho?: string }>,
): string[] {
  const todos = new Set<string>();
  produtos.forEach((p) => {
    listaTamanhos(p.tamanho).forEach((t) => todos.add(t));
  });
  return [...todos].sort((a, b) => Number(a) - Number(b));
}

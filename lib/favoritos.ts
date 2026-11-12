const CHAVE_FAVORITOS = "well-fashion-favoritos";
const EVENTO_FAVORITOS = "well-fashion-favoritos-atualizados";

export function lerFavoritos(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const valor: unknown = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) ?? "[]");
    return Array.isArray(valor)
      ? valor.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

export function alternarFavorito(id: number): number[] {
  const atuais = lerFavoritos();
  const novos = atuais.includes(id)
    ? atuais.filter((favorito) => favorito !== id)
    : [...atuais, id];
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novos));
  window.dispatchEvent(new Event(EVENTO_FAVORITOS));
  return novos;
}

export function assinarFavoritos(atualizar: () => void): () => void {
  window.addEventListener(EVENTO_FAVORITOS, atualizar);
  window.addEventListener("storage", atualizar);
  return () => {
    window.removeEventListener(EVENTO_FAVORITOS, atualizar);
    window.removeEventListener("storage", atualizar);
  };
}

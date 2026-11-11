export const ESTOQUE_BAIXO = 5;

export type NivelEstoque = "sem" | "baixo" | "ok";

export function nivelEstoque(quantity: number): NivelEstoque {
  if (quantity <= 0) return "sem";
  if (quantity <= ESTOQUE_BAIXO) return "baixo";
  return "ok";
}

export const rotuloEstoque: Record<NivelEstoque, string> = {
  sem: "Sem estoque",
  baixo: "Estoque baixo",
  ok: "Em estoque",
};

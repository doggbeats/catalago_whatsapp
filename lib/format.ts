export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Contatos oficiais da loja (DDI + DDD + número, só dígitos). */
export const whatsappContatos = [
  { nome: "Wellerson", numero: "5561994282217" },
  { nome: "Ana Paula", numero: "5561993283388" },
] as const;

export function whatsappNumber(): string {
  return process.env.WHATSAPP_NUMBER ?? whatsappContatos[0].numero;
}

/** Formata "5561994282217" como "(61) 99428-2217". */
export function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  const local =
    digitos.startsWith("55") && digitos.length > 10 ? digitos.slice(2) : digitos;

  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return valor;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function formatParcelas(valor: number, parcelas: number): string {
  const total = parcelas > 0 ? valor / parcelas : valor;
  return `${parcelas > 0 ? parcelas : 1}x de ${formatBRL(total)}`;
}

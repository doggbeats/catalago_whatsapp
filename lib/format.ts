export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function whatsappNumber(): string {
  return process.env.WHATSAPP_NUMBER ?? "5511999999999";
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function formatParcelas(valor: number, parcelas: number): string {
  const total = parcelas > 0 ? valor / parcelas : valor;
  return `${parcelas > 0 ? parcelas : 1}x de ${formatBRL(total)}`;
}

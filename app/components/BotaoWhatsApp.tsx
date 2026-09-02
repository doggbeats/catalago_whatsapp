"use client";

import { useState } from "react";
import { whatsappLink, formatBRL } from "@/lib/format";
import { trackEvent } from "@/lib/tracking";

type Props = {
  produtoId: number;
  nome: string;
  categoria: string;
  precoFinal: number;
};

export default function BotaoWhatsApp({ produtoId, nome, categoria, precoFinal }: Props) {
  const [enviando, setEnviando] = useState(false);

  async function handleClick() {
    if (enviando) return;
    setEnviando(true);
    try {
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId, quantidade: 1 }),
      });
    } catch {
      // ignora erro de registro; o WhatsApp ainda abre
    }
    window.open(
      whatsappLink(`Olá! Tenho interesse no produto *${nome}* (${categoria}) por ${formatBRL(precoFinal)}.`),
      "_blank",
      "noopener,noreferrer",
    );
    trackEvent("Purchase", {
      content_name: nome,
      content_category: categoria,
      currency: "BRL",
      value: precoFinal,
    });
    setEnviando(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={enviando}
      className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 font-semibold text-white transition hover:bg-green-600"
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 011.26-10.17 8.14 8.14 0 015.72-2.37c2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 012.4 5.79c0 4.54-3.7 8.21-8.19 8.21zm4.5-6.14c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
      </svg>
      Comprar no WhatsApp
    </button>
  );
}

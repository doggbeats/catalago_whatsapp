import type { Metadata } from "next";
import Link from "next/link";
import { whatsappNumber } from "@/lib/format";
import CarrinhoConteudo from "./CarrinhoConteudo";

export const metadata: Metadata = {
  title: "Carrinho | TENIS NEON",
  description: "Revise os itens do seu carrinho e finalize o pedido.",
};

export default function CarrinhoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition hover:text-black">
          Início
        </Link>
        <span>/</span>
        <span className="text-black">Carrinho</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-black">Meu carrinho</h1>
      <p className="mt-1 text-slate-600">
        Confira os modelos escolhidos antes de finalizar.
      </p>

      <CarrinhoConteudo numeroWhatsApp={whatsappNumber()} />
    </div>
  );
}

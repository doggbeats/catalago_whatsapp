import Link from "next/link";
import { whatsappNumber } from "@/lib/format";
import ContatoForm from "../components/ContatoForm";

export const metadata = {
  title: "Contato | TENIS NEON",
  description: "Fale com a TENIS NEON pelo WhatsApp, e-mail ou formulário.",
};

const numero = whatsappNumber();
const whatsappHref = `https://wa.me/${numero}`;

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Link href="/" className="transition hover:text-white">Início</Link>
            <span aria-hidden>/</span>
            <span className="text-neutral-200">Contato</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Fale com a <span className="text-amber-400">TENIS NEON</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">
            Estamos prontos para tirar suas dúvidas sobre produtos, tamanhos, pedidos e entregas.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-green-400 hover:bg-green-50">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-black">WhatsApp</p>
                <p className="text-sm text-neutral-600">Atendimento rápido • {numero}</p>
              </div>
            </a>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-black">E-mail</p>
                  <p className="text-sm text-neutral-600">contato@tenisneon.com.br</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-black">Endereço</p>
                  <p className="text-sm text-neutral-600">Av. das Tênis, 1000 — São Paulo/SP</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-black">Horário</p>
                  <p className="text-sm text-neutral-600">Seg a Sex, 9h às 18h • Sáb, 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>

          <ContatoForm />
        </div>
      </div>
    </div>
  );
}

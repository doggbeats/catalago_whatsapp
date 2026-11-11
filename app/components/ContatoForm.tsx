"use client";

import { useState } from "react";
import { whatsappNumber } from "@/lib/format";

export default function ContatoForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const texto = [
      `Olá! Me chamo ${nome}.`,
      email ? `E-mail: ${email}` : "",
      assunto ? `Assunto: ${assunto}` : "",
      "",
      mensagem,
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-black">Envie uma mensagem</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Preencha o formulário e continuaremos no WhatsApp.
      </p>

      {enviado ? (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Mensagem enviada! Abrimos o WhatsApp em uma nova aba para você
          finalizar o atendimento.
          <button
            type="button"
            onClick={() => setEnviado(false)}
            className="ml-2 font-semibold underline"
          >
            Enviar outra
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Nome
            </label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Assunto
            </label>
            <input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500"
              placeholder="Sobre o que deseja falar?"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Mensagem
            </label>
            <textarea
              required
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500"
              placeholder="Digite sua mensagem..."
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Enviar pelo WhatsApp
          </button>
        </form>
      )}
    </div>
  );
}

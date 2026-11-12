"use client";

import Link from "next/link";
import { useState } from "react";

function CampoSenha({
  id,
  label,
  value,
  onChange,
  autoComplete,
  dica,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  autoComplete?: string;
  dica?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visivel ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm text-black outline-none focus:border-blue-500 focus:bg-white"
        />
        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          title={visivel ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>
      {dica ? <p className="mt-1 text-xs text-slate-500">{dica}</p> : null}
    </div>
  );
}

export default function AlterarSenhaPage() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (novaSenha.length < 8) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha precisa ter pelo menos 8 caracteres.",
      });
      return;
    }

    if (novaSenha !== confirmacao) {
      setMensagem({
        tipo: "erro",
        texto: "A confirmação não confere com a nova senha.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha, confirmacao }),
      });

      const dados = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setMensagem({
          tipo: "erro",
          texto: dados.error ?? "Não foi possível alterar a senha.",
        });
        return;
      }

      setMensagem({
        tipo: "sucesso",
        texto:
          "Senha alterada com sucesso. Use a nova senha no próximo acesso ao painel.",
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
    } catch {
      setMensagem({
        tipo: "erro",
        texto: "Falha de conexão. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 text-3xl font-bold text-black">Alterar senha</h1>
      <p className="mt-1 text-black">
        Atualize a senha usada para entrar no painel administrativo.
      </p>

      {mensagem ? (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      >
        <CampoSenha
          id="senha-atual"
          label="Senha atual"
          value={senhaAtual}
          onChange={setSenhaAtual}
          autoComplete="current-password"
        />

        <CampoSenha
          id="nova-senha"
          label="Nova senha"
          value={novaSenha}
          onChange={setNovaSenha}
          autoComplete="new-password"
          dica="Use pelo menos 8 caracteres."
        />

        <CampoSenha
          id="confirmar-senha"
          label="Confirmar nova senha"
          value={confirmacao}
          onChange={setConfirmacao}
          autoComplete="new-password"
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-slate-100"
          >
            Cancelar
          </Link>
        </div>
      </form>

      <p className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        A senha fica salva apenas neste servidor, no arquivo{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5">
          lib/admin-config.json
        </code>
        , que não é versionado no Git.
      </p>
    </div>
  );
}

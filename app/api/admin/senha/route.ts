import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminConfig, setAdminPassword, verifyPassword } from "@/lib/admin";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  criarSessaoAdmin,
  isAdmin,
} from "@/lib/auth";
import { AVISO_SOMENTE_LEITURA, somenteLeitura } from "@/lib/ambiente";

const TAMANHO_MINIMO = 8;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (somenteLeitura) {
    return NextResponse.json({ error: AVISO_SOMENTE_LEITURA }, { status: 409 });
  }

  let body: {
    senhaAtual?: unknown;
    novaSenha?: unknown;
    confirmacao?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const senhaAtual =
    typeof body.senhaAtual === "string" ? body.senhaAtual : "";
  const novaSenha = typeof body.novaSenha === "string" ? body.novaSenha : "";
  const confirmacao =
    typeof body.confirmacao === "string" ? body.confirmacao : "";

  if (!senhaAtual || !novaSenha || !confirmacao) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 },
    );
  }

  if (novaSenha.length < TAMANHO_MINIMO) {
    return NextResponse.json(
      { error: `A nova senha precisa ter pelo menos ${TAMANHO_MINIMO} caracteres.` },
      { status: 400 },
    );
  }

  if (novaSenha !== confirmacao) {
    return NextResponse.json(
      { error: "A confirmação não confere com a nova senha." },
      { status: 400 },
    );
  }

  const { password: senhaSalva } = await getAdminConfig();

  if (!(await verifyPassword(senhaAtual, senhaSalva))) {
    return NextResponse.json(
      { error: "Senha atual incorreta." },
      { status: 400 },
    );
  }

  if (await verifyPassword(novaSenha, senhaSalva)) {
    return NextResponse.json(
      { error: "A nova senha precisa ser diferente da atual." },
      { status: 400 },
    );
  }

  try {
    const novaConfig = await setAdminPassword(novaSenha);
    const cookieStore = await cookies();
    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      criarSessaoAdmin(novaConfig.user, novaConfig.password),
      {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: ADMIN_SESSION_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Não foi possível salvar a nova senha." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

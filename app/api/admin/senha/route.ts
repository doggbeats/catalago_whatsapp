import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminConfig, setAdminPassword, verifyPassword } from "@/lib/admin";

const TAMANHO_MINIMO = 8;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "1") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
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
    await setAdminPassword(novaSenha);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível salvar a nova senha." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminConfig, verifyPassword, type AdminConfig } from "@/lib/admin";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  criarSessaoAdmin,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { user?: unknown; password?: unknown };
  try {
    const recebido: unknown = await request.json();
    if (!recebido || typeof recebido !== "object" || Array.isArray(recebido)) {
      throw new Error("Corpo inválido");
    }
    body = recebido as typeof body;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  let config: AdminConfig;
  try {
    config = await getAdminConfig();
  } catch {
    return NextResponse.json(
      { error: "Não foi possível verificar as credenciais agora. Tente novamente." },
      { status: 503 },
    );
  }

  const { user: adminUser, password: senhaSalva } = config;

  if (
    (typeof body.user === "string" && body.user.length > 256) ||
    (typeof body.password === "string" && body.password.length > 1024)
  ) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 400 });
  }

  const usuarioOk =
    typeof body.user === "string" && body.user.trim() === adminUser;
  const senhaOk =
    usuarioOk &&
    typeof body.password === "string" &&
    (await verifyPassword(body.password, senhaSalva));

  if (!usuarioOk || !senhaOk) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 },
    );
  }

  const secure = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    criarSessaoAdmin(adminUser, senhaSalva),
    {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
      secure,
    },
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

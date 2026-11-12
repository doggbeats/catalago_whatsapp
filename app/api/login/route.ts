import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminConfig, verifyPassword } from "@/lib/admin";

export async function POST(request: Request) {
  let body: { user?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { user: adminUser, password: senhaSalva } = await getAdminConfig();

  const usuarioOk = typeof body.user === "string" && body.user === adminUser;
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

  const secure = new URL(request.url).protocol === "https:";
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 4,
    secure,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  return NextResponse.json({ ok: true });
}

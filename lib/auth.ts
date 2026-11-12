import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getAdminConfig } from "./admin";

export const ADMIN_SESSION_COOKIE = "admin_auth";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 4;

function assinaturaSessao(
  usuario: string,
  senhaSalva: string,
  expiraEm: number,
): string {
  const segredo =
    process.env.ADMIN_SESSION_SECRET || `well-fashion-admin:${usuario}:${senhaSalva}`;
  return createHmac("sha256", segredo)
    .update(`${usuario}:${senhaSalva}:${expiraEm}`)
    .digest("base64url");
}

export function criarSessaoAdmin(usuario: string, senhaSalva: string): string {
  const expiraEm = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  return `${expiraEm}.${assinaturaSessao(usuario, senhaSalva, expiraEm)}`;
}

function sessaoValida(
  valor: string,
  usuario: string,
  senhaSalva: string,
): boolean {
  const [expiraTexto, assinaturaRecebida, ...resto] = valor.split(".");
  if (!expiraTexto || !assinaturaRecebida || resto.length) return false;

  const expiraEm = Number(expiraTexto);
  const agora = Math.floor(Date.now() / 1000);
  if (
    !Number.isSafeInteger(expiraEm) ||
    expiraEm <= agora ||
    expiraEm > agora + ADMIN_SESSION_MAX_AGE + 60
  ) {
    return false;
  }

  const esperada = Buffer.from(
    assinaturaSessao(usuario, senhaSalva, expiraEm),
    "base64url",
  );
  const recebida = Buffer.from(assinaturaRecebida, "base64url");
  return recebida.length === esperada.length && timingSafeEqual(recebida, esperada);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const valor = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!valor) return false;

  try {
    const { user, password } = await getAdminConfig();
    return Boolean(user && password && sessaoValida(valor, user, password));
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(PROTECTED_ADMIN_PREFIX);
  const isLoginRoute = pathname === LOGIN_PATH;

  const authed = request.cookies.get("admin_auth")?.value === "1";

  // Se já estiver logado e tentar acessar /login, redireciona para /admin
  if (isLoginRoute && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Protege todas as rotas /admin
  if (isAdminRoute && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  // Protege APIs sensíveis
  // Bloqueia mutações em /api/produtos (exceto GET que já é público para listagem)
  if (pathname.startsWith("/api/produtos")) {
    if (request.method !== "GET" && !authed) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  }

  // Bloqueia upload de imagens
  if (pathname.startsWith("/api/upload") && !authed) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Bloqueia alteração/exclusão de pedidos
  if (pathname.startsWith("/api/pedidos") && !authed) {
    if (request.method === "PUT" || request.method === "DELETE") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/api/produtos/:path*",
    "/api/upload",
    "/api/pedidos/:path*",
  ],
};

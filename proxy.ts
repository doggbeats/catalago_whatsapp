import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(PROTECTED_ADMIN_PREFIX);
  const temCookieDeSessao = Boolean(request.cookies.get("admin_auth")?.value);

  // Se já estiver logado e tentar acessar /login, redireciona para /admin
  // Protege todas as rotas /admin
  if (isAdminRoute && !temCookieDeSessao) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  // Bloqueia mutações em /api/produtos (GET é público para listagem)
  if (pathname.startsWith("/api/produtos")) {
    if (request.method !== "GET" && !temCookieDeSessao) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  }

  // Bloqueia upload de imagens
  if (pathname.startsWith("/api/upload") && !temCookieDeSessao) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Bloqueia rotas administrativas (ex.: alterar senha)
  if (pathname.startsWith("/api/admin") && !temCookieDeSessao) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Bloqueia alteração/exclusão de pedidos
  if (pathname.startsWith("/api/pedidos") && !temCookieDeSessao) {
    if (["PUT", "PATCH", "DELETE"].includes(request.method)) {
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
    "/api/admin/:path*",
    "/api/pedidos/:path*",
  ],
};

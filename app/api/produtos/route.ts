import { NextResponse } from "next/server";
import { getProdutos, salvarProdutos, type Produto } from "@/lib/produtos";
import { isAdmin } from "@/lib/auth";
import { AVISO_SOMENTE_LEITURA, somenteLeitura } from "@/lib/ambiente";

const MAX_IMAGENS = 8;

function texto(valor: unknown): string | undefined {
  return typeof valor === "string" && valor.trim() ? valor.trim() : undefined;
}

function listaImagens(body: Record<string, unknown>): string[] {
  const informadas = Array.isArray(body.images) ? body.images : [];
  const imagens = informadas.map(texto).filter((v): v is string => Boolean(v));
  const principal = texto(body.image);
  if (principal && !imagens.includes(principal)) imagens.unshift(principal);
  return Array.from(new Set(imagens)).slice(0, MAX_IMAGENS);
}

export async function GET() {
  const produtos = await getProdutos();
  return NextResponse.json(produtos);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (somenteLeitura) {
    return NextResponse.json({ error: AVISO_SOMENTE_LEITURA }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const name = texto(body.name);
  const category = texto(body.category);
  const price = Number(body.price);
  const quantity = Number(body.quantity);
  const installments = Number(body.installments);
  const imagens = listaImagens(body);

  if (!name) {
    return NextResponse.json({ error: "Informe o nome do produto." }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "Informe a categoria." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Informe um valor válido." }, { status: 400 });
  }
  if (!Number.isFinite(quantity) || quantity < 0) {
    return NextResponse.json(
      { error: "Informe uma quantidade em estoque válida." },
      { status: 400 },
    );
  }
  if (!imagens.length) {
    return NextResponse.json(
      { error: "Anexe pelo menos uma imagem do produto." },
      { status: 400 },
    );
  }

  const promocao = texto(String(body.promotion ?? ""));
  const promotion = promocao ? Number(promocao) : null;
  if (promotion !== null && (!Number.isFinite(promotion) || promotion <= 0)) {
    return NextResponse.json(
      { error: "Informe um valor promocional válido." },
      { status: 400 },
    );
  }
  if (promotion !== null && promotion >= price) {
    return NextResponse.json(
      { error: "O valor promocional deve ser menor que o valor original." },
      { status: 400 },
    );
  }

  const specs = Array.isArray(body.specs)
    ? body.specs.map(texto).filter((v): v is string => Boolean(v))
    : [];

  const produtos = await getProdutos();
  const novo: Produto = {
    id: produtos.length ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
    name,
    description: texto(body.description) ?? "",
    price,
    promotion,
    category,
    marca: texto(body.marca),
    modelo: texto(body.modelo),
    tipo: texto(body.tipo),
    cor: texto(body.cor),
    tamanho: texto(body.tamanho),
    qualidade: texto(body.qualidade),
    quantity: Math.floor(quantity),
    image: imagens[0],
    images: imagens,
    specs,
    installments:
      Number.isFinite(installments) && installments > 0 ? Math.floor(installments) : 1,
  };

  await salvarProdutos([...produtos, novo]);
  return NextResponse.json(novo, { status: 201 });
}

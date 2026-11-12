import { NextResponse } from "next/server";
import { getProdutos, salvarProdutos } from "@/lib/produtos";
import { isAdmin } from "@/lib/auth";
import { AVISO_SOMENTE_LEITURA, somenteLeitura } from "@/lib/ambiente";

const MAX_IMAGENS = 8;

type Params = { params: Promise<{ id: string }> };

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

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (somenteLeitura) {
    return NextResponse.json({ error: AVISO_SOMENTE_LEITURA }, { status: 409 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const produtos = await getProdutos();
  const atual = produtos.find((p) => p.id === Number(id));
  if (!atual) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const atualizado = { ...atual };

  if (body.name !== undefined) {
    const name = texto(body.name);
    if (!name) {
      return NextResponse.json({ error: "Informe o nome do produto." }, { status: 400 });
    }
    atualizado.name = name;
  }

  if (body.description !== undefined) {
    atualizado.description = texto(body.description) ?? "";
  }

  if (body.category !== undefined) {
    const category = texto(body.category);
    if (!category) {
      return NextResponse.json({ error: "Informe a categoria." }, { status: 400 });
    }
    atualizado.category = category;
  }

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Informe um valor válido." }, { status: 400 });
    }
    atualizado.price = price;
  }

  if (body.promotion !== undefined) {
    const promocao = texto(String(body.promotion ?? ""));
    const promotion = promocao ? Number(promocao) : null;
    if (promotion !== null && (!Number.isFinite(promotion) || promotion <= 0)) {
      return NextResponse.json(
        { error: "Informe um valor promocional válido." },
        { status: 400 },
      );
    }
    if (promotion !== null && promotion >= atualizado.price) {
      return NextResponse.json(
        { error: "O valor promocional deve ser menor que o valor original." },
        { status: 400 },
      );
    }
    atualizado.promotion = promotion;
  }

  if (body.quantity !== undefined) {
    const quantity = Number(body.quantity);
    if (!Number.isFinite(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: "Informe uma quantidade em estoque válida." },
        { status: 400 },
      );
    }
    atualizado.quantity = Math.floor(quantity);
  }

  if (body.images !== undefined || body.image !== undefined) {
    const imagens = listaImagens(body);
    if (!imagens.length) {
      return NextResponse.json(
        { error: "Anexe pelo menos uma imagem do produto." },
        { status: 400 },
      );
    }
    atualizado.image = imagens[0];
    atualizado.images = imagens;
  }

  if (body.installments !== undefined) {
    const installments = Number(body.installments);
    atualizado.installments =
      Number.isFinite(installments) && installments > 0 ? Math.floor(installments) : 1;
  }

  if (body.specs !== undefined) {
    atualizado.specs = Array.isArray(body.specs)
      ? body.specs.map(texto).filter((v): v is string => Boolean(v))
      : [];
  }

  if (body.marca !== undefined) atualizado.marca = texto(body.marca);
  if (body.modelo !== undefined) atualizado.modelo = texto(body.modelo);
  if (body.tipo !== undefined) atualizado.tipo = texto(body.tipo);
  if (body.cor !== undefined) atualizado.cor = texto(body.cor);
  if (body.tamanho !== undefined) atualizado.tamanho = texto(body.tamanho);
  if (body.qualidade !== undefined) atualizado.qualidade = texto(body.qualidade);

  await salvarProdutos(
    produtos.map((p) => (p.id === atual.id ? atualizado : p)),
  );

  return NextResponse.json(atualizado);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (somenteLeitura) {
    return NextResponse.json({ error: AVISO_SOMENTE_LEITURA }, { status: 409 });
  }

  const { id } = await params;
  const produtos = await getProdutos();
  await salvarProdutos(produtos.filter((p) => p.id !== Number(id)));
  return NextResponse.json({ ok: true });
}

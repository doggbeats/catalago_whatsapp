import { NextResponse } from "next/server";
import {
  getProdutos,
  salvarProdutos,
  type Produto,
} from "@/lib/produtos";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const produtos = await getProdutos();
  return NextResponse.json(produtos);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const body = (await request.json()) as Omit<Produto, "id">;
  const produtos = await getProdutos();
  const novo: Produto = {
    id: produtos.length ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
    name: body.name,
    description: body.description || "",
    price: Number(body.price),
    promotion: body.promotion ? Number(body.promotion) : null,
    category: body.category,
    marca: (body as any).marca || undefined,
    tipo: (body as any).tipo || undefined,
    cor: (body as any).cor || undefined,
    tamanho: (body as any).tamanho || undefined,
    qualidade: (body as any).qualidade || undefined,
    quantity: Number(body.quantity),
    image: body.image || "",
    specs: body.specs || [],
    installments: Number(body.installments) || 1,
  };
  const atualizados = [...produtos, novo];
  await salvarProdutos(atualizados);
  return NextResponse.json(novo, { status: 201 });
}

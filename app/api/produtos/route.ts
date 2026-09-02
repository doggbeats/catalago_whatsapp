import { NextResponse } from "next/server";
import {
  getProdutos,
  salvarProdutos,
  type Produto,
} from "@/lib/produtos";

export async function GET() {
  const produtos = await getProdutos();
  return NextResponse.json(produtos);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<Produto, "id">;
  const produtos = await getProdutos();
  const novo: Produto = {
    id: produtos.length ? Math.max(...produtos.map((p) => p.id)) + 1 : 1,
    name: body.name,
    description: body.description || "",
    price: Number(body.price),
    promotion: body.promotion ? Number(body.promotion) : null,
    category: body.category,
    quantity: Number(body.quantity),
    image: body.image || "",
    specs: body.specs || [],
    installments: Number(body.installments) || 1,
  };
  const atualizados = [...produtos, novo];
  await salvarProdutos(atualizados);
  return NextResponse.json(novo, { status: 201 });
}

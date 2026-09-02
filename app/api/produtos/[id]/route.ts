import { NextResponse } from "next/server";
import { getProdutos, salvarProdutos } from "@/lib/produtos";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  let produtos = await getProdutos();
  produtos = produtos.map((p) =>
    p.id === Number(id)
      ? {
          ...p,
          name: body.name ?? p.name,
          description: body.description ?? p.description,
          price: body.price !== undefined ? Number(body.price) : p.price,
          promotion:
            body.promotion !== undefined
              ? body.promotion
                ? Number(body.promotion)
                : null
              : p.promotion,
          category: body.category ?? p.category,
          quantity:
            body.quantity !== undefined ? Number(body.quantity) : p.quantity,
          image: body.image ?? p.image,
          specs: body.specs ?? p.specs,
          installments:
            body.installments !== undefined
              ? Number(body.installments)
              : p.installments,
        }
      : p,
  );
  await salvarProdutos(produtos);
  return NextResponse.json(
    produtos.find((p) => p.id === Number(id)),
  );
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const produtos = await getProdutos();
  const atualizados = produtos.filter((p) => p.id !== Number(id));
  await salvarProdutos(atualizados);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getPedidos, salvarPedidos, type Pedido, type StatusPedido } from "@/lib/pedidos";
import { getProdutos, salvarProdutos } from "@/lib/produtos";

function dataAtual(): string {
  return new Date().toISOString();
}

export async function GET() {
  const pedidos = await getPedidos();
  pedidos.sort((a, b) => (a.data < b.data ? 1 : -1));
  return NextResponse.json(pedidos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const produtoId = Number(body.produtoId);
  const quantidade = Math.max(1, Number(body.quantidade) || 1);

  const produtos = await getProdutos();
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  if (produto.quantity < quantidade) {
    return NextResponse.json({ error: "Estoque insuficiente" }, { status: 400 });
  }

  produto.quantity -= quantidade;
  await salvarProdutos(produtos);

  const valor = (produto.promotion ?? produto.price) * quantidade;
  const pedidos = await getPedidos();
  const novo: Pedido = {
    id: pedidos.length ? Math.max(...pedidos.map((p) => p.id)) + 1 : 1,
    produtoId: produto.id,
    nome: produto.name,
    valor,
    quantidade,
    data: dataAtual(),
    status: "aguardando" as StatusPedido,
  };
  await salvarPedidos([...pedidos, novo]);

  return NextResponse.json(novo, { status: 201 });
}

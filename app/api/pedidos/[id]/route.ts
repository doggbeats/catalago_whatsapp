import { NextResponse } from "next/server";
import { getPedidos, salvarPedidos, type StatusPedido } from "@/lib/pedidos";
import { getProdutos, salvarProdutos } from "@/lib/produtos";

type Params = { params: Promise<{ id: string }> };

const statusValidos: StatusPedido[] = ["aguardando", "confirmado", "concluido", "cancelado"];

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const novoStatus = body.status as StatusPedido;

  if (!statusValidos.includes(novoStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const pedidos = await getPedidos();
  const pedido = pedidos.find((p) => p.id === Number(id));
  if (!pedido) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const eraAtivo = pedido.status !== "cancelado";
  const devolver = eraAtivo && novoStatus === "cancelado";

  if (devolver) {
    const produtos = await getProdutos();
    const produto = produtos.find((p) => p.id === pedido.produtoId);
    if (produto) {
      produto.quantity += pedido.quantidade;
      await salvarProdutos(produtos);
    }
  }

  pedido.status = novoStatus;
  await salvarPedidos(pedidos);

  return NextResponse.json(pedido);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const pedidos = await getPedidos();
  const pedido = pedidos.find((p) => p.id === Number(id));

  if (pedido && pedido.status !== "cancelado") {
    const produtos = await getProdutos();
    const produto = produtos.find((p) => p.id === pedido.produtoId);
    if (produto) {
      produto.quantity += pedido.quantidade;
      await salvarProdutos(produtos);
    }
  }

  await salvarPedidos(pedidos.filter((p) => p.id !== Number(id)));
  return NextResponse.json({ ok: true });
}

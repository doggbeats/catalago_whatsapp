import { NextResponse } from "next/server";
import { getPedidos, salvarPedidos, type Pedido, type StatusPedido } from "@/lib/pedidos";
import { getProdutos, salvarProdutos } from "@/lib/produtos";
import { isAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const statusValidos: StatusPedido[] = ["aguardando", "confirmado", "concluido", "cancelado"];

// Pedidos antigos não têm a flag; na lógica anterior o estoque era baixado
// na criação e devolvido no cancelamento.
function estoqueJaBaixado(pedido: Pedido): boolean {
  return pedido.estoqueBaixado ?? pedido.status !== "cancelado";
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const novoStatus = body.status as StatusPedido;

  if (!statusValidos.includes(novoStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const pedidos = await getPedidos();
  const pedido = pedidos.find((p) => p.id === Number(id));
  if (!pedido) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const jaBaixado = estoqueJaBaixado(pedido);
  const deveBaixar = novoStatus === "concluido";

  if (deveBaixar && !jaBaixado) {
    const produtos = await getProdutos();
    const produto = produtos.find((p) => p.id === pedido.produtoId);
    if (!produto) {
      return NextResponse.json(
        { error: "Produto deste pedido não está mais cadastrado." },
        { status: 400 },
      );
    }
    if (produto.quantity < pedido.quantidade) {
      return NextResponse.json(
        {
          error: `Estoque insuficiente para concluir: restam ${produto.quantity} unidade(s) e o pedido tem ${pedido.quantidade}.`,
        },
        { status: 400 },
      );
    }
    produto.quantity -= pedido.quantidade;
    await salvarProdutos(produtos);
    pedido.estoqueBaixado = true;
  } else if (!deveBaixar && jaBaixado) {
    const produtos = await getProdutos();
    const produto = produtos.find((p) => p.id === pedido.produtoId);
    if (produto) {
      produto.quantity += pedido.quantidade;
      await salvarProdutos(produtos);
    }
    pedido.estoqueBaixado = false;
  } else if (deveBaixar) {
    pedido.estoqueBaixado = true;
  }

  pedido.status = novoStatus;
  await salvarPedidos(pedidos);

  return NextResponse.json(pedido);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const pedidos = await getPedidos();
  const pedido = pedidos.find((p) => p.id === Number(id));

  if (pedido && estoqueJaBaixado(pedido)) {
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

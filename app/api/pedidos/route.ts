import { NextResponse } from "next/server";
import { getPedidos, salvarPedidos, type Pedido, type StatusPedido } from "@/lib/pedidos";
import { getProdutos } from "@/lib/produtos";

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
  const tamanho =
    typeof body.tamanho === "string" && body.tamanho.trim()
      ? body.tamanho.trim()
      : undefined;

  const produtos = await getProdutos();
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  if (produto.quantity < quantidade) {
    return NextResponse.json({ error: "Estoque insuficiente" }, { status: 400 });
  }

  // O estoque só é baixado quando o admin concluir a venda.
  const valor = (produto.promotion ?? produto.price) * quantidade;
  const pedidos = await getPedidos();
  const novo: Pedido = {
    id: pedidos.length ? Math.max(...pedidos.map((p) => p.id)) + 1 : 1,
    produtoId: produto.id,
    nome: produto.name,
    tamanho,
    valor,
    quantidade,
    data: dataAtual(),
    status: "aguardando" as StatusPedido,
    estoqueBaixado: false,
  };
  // Na Vercel o disco é somente leitura: a venda segue para o WhatsApp
  // mesmo quando não é possível gravar o pedido no arquivo local.
  try {
    await salvarPedidos([...pedidos, novo]);
  } catch (erro) {
    console.error("Não foi possível gravar o pedido:", erro);
  }

  return NextResponse.json(novo, { status: 201 });
}

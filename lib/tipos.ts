export type Produto = {
  id: number;
  name: string;
  description: string;
  price: number;
  promotion: number | null;
  category: string;
  quantity: number;
  image: string;
  specs: string[];
  installments: number;
};

export type StatusPedido = "aguardando" | "confirmado" | "concluido" | "cancelado";

export type Pedido = {
  id: number;
  produtoId: number;
  nome: string;
  valor: number;
  quantidade: number;
  data: string;
  status: StatusPedido;
};

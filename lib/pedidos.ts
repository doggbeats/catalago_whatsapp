import { promises as fs } from "fs";
import path from "path";
import type { Pedido } from "./tipos";

const dataFile = path.join(process.cwd(), "lib", "pedidos.json");

export async function getPedidos(): Promise<Pedido[]> {
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw);
}

export async function salvarPedidos(pedidos: Pedido[]): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(pedidos, null, 2), "utf-8");
}

export type { Pedido, StatusPedido } from "./tipos";

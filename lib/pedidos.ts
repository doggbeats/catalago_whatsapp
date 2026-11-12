import { promises as fs } from "fs";
import path from "path";
import type { Pedido } from "./tipos";
import { lerDadosPersistidos, salvarDadosPersistidos } from "./database";

const dataFile = path.join(process.cwd(), "lib", "pedidos.json");

export async function getPedidos(): Promise<Pedido[]> {
  const persistidos = await lerDadosPersistidos<Pedido[]>("pedidos");
  if (persistidos) return persistidos;

  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw erro;
  }
}

export async function salvarPedidos(pedidos: Pedido[]): Promise<void> {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL) {
    await salvarDadosPersistidos("pedidos", pedidos);
    return;
  }

  await fs.writeFile(dataFile, JSON.stringify(pedidos, null, 2), "utf-8");
}

export type { Pedido, StatusPedido } from "./tipos";

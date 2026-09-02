import { promises as fs } from "fs";
import path from "path";
import type { Produto } from "./tipos";

const dataFile = path.join(process.cwd(), "lib", "produtos.json");

export async function getProdutos(): Promise<Produto[]> {
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw);
}

export async function salvarProdutos(produtos: Produto[]): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(produtos, null, 2), "utf-8");
}

export type { Produto };

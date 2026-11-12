import { promises as fs } from "fs";
import path from "path";
import { connection } from "next/server";
import type { Produto } from "./tipos";

const dataFile = path.join(process.cwd(), "lib", "produtos.json");

export async function getProdutos(): Promise<Produto[]> {
  // Garante que o catálogo seja lido a cada requisição, para que os
  // produtos cadastrados no painel apareçam sem precisar de novo build.
  await connection();

  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Produto[]) : [];
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw erro;
  }
}

/** Marcas cadastradas nos produtos, em ordem alfabética. */
export async function getMarcas(): Promise<string[]> {
  const produtos = await getProdutos();
  return Array.from(
    new Set(produtos.map((p) => p.marca).filter((m): m is string => Boolean(m))),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function salvarProdutos(produtos: Produto[]): Promise<void> {
  const temporario = `${dataFile}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporario, JSON.stringify(produtos, null, 2), "utf-8");
  await fs.rename(temporario, dataFile);
}

export type { Produto };

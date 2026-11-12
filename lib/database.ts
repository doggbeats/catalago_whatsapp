import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL;

type AppDataKey = "produtos" | "pedidos" | "admin";

let schemaReady: Promise<void> | null = null;

function getSql() {
  if (!connectionString) return null;
  return neon(connectionString);
}

export function temBancoConfigurado(): boolean {
  return Boolean(connectionString);
}

async function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL não configurada.");
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS catalogo_app_data (
        chave TEXT PRIMARY KEY,
        valor JSONB NOT NULL,
        atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined).catch((erro) => {
      schemaReady = null;
      throw erro;
    });
  }
  await schemaReady;
}

export async function lerDadosPersistidos<T>(
  chave: AppDataKey,
): Promise<T | null> {
  const sql = getSql();
  if (!sql) return null;

  await ensureSchema();
  const rows = await sql`
    SELECT valor FROM catalogo_app_data WHERE chave = ${chave} LIMIT 1
  `;
  return rows.length ? (rows[0].valor as T) : null;
}

export async function salvarDadosPersistidos<T>(
  chave: AppDataKey,
  valor: T,
): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  await ensureSchema();
  const json = JSON.stringify(valor);
  await sql`
    INSERT INTO catalogo_app_data (chave, valor, atualizado_em)
    VALUES (${chave}, ${json}::jsonb, NOW())
    ON CONFLICT (chave) DO UPDATE
    SET valor = EXCLUDED.valor, atualizado_em = NOW()
  `;
}

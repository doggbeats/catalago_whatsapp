const temBanco = Boolean(
  process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL,
);

export const somenteLeitura = process.env.VERCEL === "1" && !temBanco;

export const imagensConfiguradas =
  process.env.VERCEL !== "1" ||
  Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );

export const AVISO_SOMENTE_LEITURA =
  "Banco Neon não configurado: adicione DATABASE_URL nas variáveis de ambiente da Vercel para salvar alterações do painel.";

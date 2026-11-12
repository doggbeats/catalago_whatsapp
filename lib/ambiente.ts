/**
 * A Vercel executa as rotas em um sistema de arquivos somente leitura.
 * Nesse ambiente o catálogo é servido normalmente, mas o painel não
 * consegue gravar produtos, senha, pedidos ou imagens.
 */
export const somenteLeitura = process.env.VERCEL === "1";

export const AVISO_SOMENTE_LEITURA =
  "Ambiente somente leitura: esta alteração não é salva na Vercel. Edite os dados no projeto local ou use um servidor com disco gravável.";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";
import { AVISO_SOMENTE_LEITURA, somenteLeitura } from "@/lib/ambiente";

const tiposPermitidos: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
};
const tamanhoMaximo = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (somenteLeitura) {
    return NextResponse.json({ error: AVISO_SOMENTE_LEITURA }, { status: 409 });
  }

  const blobConfigurado = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );
  if (process.env.VERCEL === "1" && !blobConfigurado) {
    return NextResponse.json(
      { error: "Conecte um Blob público à Vercel para habilitar o envio de imagens." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const arquivo = formData.get("file");

    if (!arquivo || typeof arquivo === "string" || !("arrayBuffer" in arquivo)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (arquivo.size > tamanhoMaximo) {
      return NextResponse.json(
        { error: "Imagem muito grande (máx. 5MB)" },
        { status: 400 },
      );
    }

    const ext = path.extname(arquivo.name).slice(1).toLowerCase();
    const extensoesDoTipo = tiposPermitidos[arquivo.type];
    if (!extensoesDoTipo || !extensoesDoTipo.includes(ext)) {
      return NextResponse.json(
        { error: "Formato inválido. Envie uma imagem JPG, PNG, WEBP ou GIF." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await arquivo.arrayBuffer());
    if (bytes.length > tamanhoMaximo) {
      return NextResponse.json(
        { error: "Imagem muito grande (máx. 5MB)" },
        { status: 400 },
      );
    }

    const nomeBase = path
      .basename(arquivo.name, path.extname(arquivo.name))
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40)
      .replace(/^-|-$/g, "");
    const nomeArquivo = `${randomUUID()}${nomeBase ? `-${nomeBase}` : ""}.${ext}`;

    // A pasta pode não existir em um deploy novo; cria antes de gravar.
    if (process.env.VERCEL === "1") {
      const blob = await put(`produtos/${nomeArquivo}`, bytes, {
        access: "public",
        contentType: arquivo.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ image: blob.url }, { status: 201 });
    }

    const pastaUploads = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(pastaUploads, { recursive: true });
    await fs.writeFile(path.join(pastaUploads, nomeArquivo), bytes);

    return NextResponse.json({ image: `/uploads/${nomeArquivo}` }, { status: 201 });
  } catch (erro) {
    console.error("Erro ao salvar imagem:", erro);
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}

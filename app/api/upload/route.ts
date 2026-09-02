import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const extensoesPermitidas = ["jpg", "jpeg", "png", "webp", "gif"];
const tamanhoMaximo = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const arquivo = formData.get("file");

    if (!arquivo || typeof arquivo === "string" || !("arrayBuffer" in arquivo)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const ext = path.extname(arquivo.name).slice(1).toLowerCase();
    if (!extensoesPermitidas.includes(ext)) {
      return NextResponse.json(
        { error: "Tipo de imagem não permitido" },
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
      .replace(/[^a-zA-Z0-9-_]/g, "-");
    const nomeArquivo = `${Date.now()}-${nomeBase}.${ext}`;
    const destino = path.join(process.cwd(), "public", "uploads", nomeArquivo);
    await fs.writeFile(destino, bytes);

    return NextResponse.json({ image: `/uploads/${nomeArquivo}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}

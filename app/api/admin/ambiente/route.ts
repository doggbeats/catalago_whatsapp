import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { somenteLeitura } from "@/lib/ambiente";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  return NextResponse.json({ somenteLeitura });
}

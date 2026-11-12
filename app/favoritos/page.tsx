import type { Metadata } from "next";
import { getProdutos } from "@/lib/produtos";
import FavoritosLista from "./FavoritosLista";

export const metadata: Metadata = {
  title: "Meus favoritos | Well Fashion",
  description: "Veja os tênis que você salvou como favoritos.",
};

export default async function FavoritosPage() {
  const produtos = await getProdutos();
  return <FavoritosLista produtos={produtos} />;
}

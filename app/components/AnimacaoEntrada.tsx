"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Elementos que entram deslizando: blocos de conteúdo e itens de grade.
 * O filtro :not(:has(...)) evita animar um bloco e seus cartões ao mesmo
 * tempo — só o elemento mais interno recebe a animação.
 */
const CANDIDATOS = "section, article, aside, footer, .grid > *";
const ALVO = `:is(${CANDIDATOS}):not(:has(:is(${CANDIDATOS})))`;

/** Painel e login ficam sem animação para não atrapalhar formulários. */
const SEM_ANIMACAO = /^\/(admin|login)(\/|$)|^\/produtos\/\d+(\/|$)/;

export default function AnimacaoEntrada() {
  const pathname = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    const main = document.querySelector("main");
    const desativar = SEM_ANIMACAO.test(pathname);

    raiz.classList.toggle("pagina-contato", pathname === "/contato");
    raiz.classList.toggle("animar", !desativar);

    if (!main || desativar) return;

    if (
      !("IntersectionObserver" in window) ||
      typeof CSS === "undefined" ||
      !CSS.supports("selector(:has(*))")
    ) {
      raiz.classList.remove("animar");
      return;
    }

    const observados = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const alvo = entrada.target as HTMLElement;
          alvo.classList.add("entrada-visivel");
          observer.unobserve(alvo);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    let frame = 0;

    const revelar = () => {
      frame = 0;

      let alvos: HTMLElement[];
      try {
        alvos = Array.from(main.querySelectorAll<HTMLElement>(ALVO));
      } catch {
        raiz.classList.remove("animar");
        return;
      }

      const conjunto = new Set(alvos);

      for (const alvo of alvos) {
        if (observados.has(alvo)) continue;
        observados.add(alvo);

        const irmaos = alvo.parentElement
          ? Array.from(alvo.parentElement.children).filter((filho) =>
              conjunto.has(filho as HTMLElement),
            )
          : [];
        const indice = Math.max(irmaos.indexOf(alvo), 0);

        alvo.style.setProperty(
          "--entrada-delay",
          `${Math.min(indice, 6) * 70}ms`,
        );
        observer.observe(alvo);
      }
    };

    const agendar = () => {
      if (frame) return;
      frame = requestAnimationFrame(revelar);
    };

    agendar();

    // Conteúdo carregado depois (carrinho, filtros etc.) também é animado.
    const mutacoes = new MutationObserver((lista) => {
      if (lista.some((m) => m.addedNodes.length > 0)) agendar();
    });
    mutacoes.observe(main, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      mutacoes.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

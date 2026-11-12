"use client";

import { useEffect, useState } from "react";

/** Informa se o painel está rodando em um ambiente sem escrita em disco. */
export function useSomenteLeitura(): boolean {
  const [somenteLeitura, setSomenteLeitura] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch("/api/admin/ambiente")
      .then((res) => (res.ok ? res.json() : null))
      .then((dados: { somenteLeitura?: boolean } | null) => {
        if (ativo && dados) setSomenteLeitura(Boolean(dados.somenteLeitura));
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  return somenteLeitura;
}

export function useImagensConfiguradas(): boolean {
  const [configuradas, setConfiguradas] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch("/api/admin/ambiente")
      .then((res) => (res.ok ? res.json() : null))
      .then((dados: { imagensConfiguradas?: boolean } | null) => {
        if (ativo && dados) setConfiguradas(Boolean(dados.imagensConfiguradas));
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  return configuradas;
}

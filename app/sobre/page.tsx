const values = [
  {
    title: "Qualidade",
    description: "Produtos selecionados e de marcas reconhecidas.",
  },
  {
    title: "Melhor preço",
    description: "Condições especiais e promoções frequentes.",
  },
  {
    title: "Atendimento",
    description: "Suporte atencioso antes e depois da compra.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-black">Sobre a ELETRICS</h1>
      <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
        <p>
          A <strong className="text-black">ELETRICS</strong> é o seu catálogo
          completo de produtos eletrônicos. Reunimos áudio, computadores,
          periféricos, ferramentas, videogames e monitores de qualidade em um
          só lugar, para que você compare e encontre o melhor preço.
        </p>
        <p>
          Nossa missão é oferecer tecnologia de ponta com atendimento de
          excelência, garantindo uma experiência de compra simples, segura e
          satisfatória.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-black">Nossos valores</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {values.map((v) => (
          <div
            key={v.title}
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h3 className="text-lg font-bold text-black">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

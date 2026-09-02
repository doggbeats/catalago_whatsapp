import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Áudio",
    description: "Caixas de som e fones de ouvido",
    image: "/caixa de som1.jpg",
    href: "/produtos?categoria=Áudio",
  },
  {
    name: "Computadores",
    description: "Desktops e monitores",
    image: "/pc gamer.jpg",
    href: "/produtos?categoria=Computadores",
  },
  {
    name: "Periféricos",
    description: "Mouses, teclados e acessórios",
    image: "/teclado_mecanico.jpg",
    href: "/produtos?categoria=Periféricos",
  },
  {
    name: "Ferramentas",
    description: "Ferramentas elétricas",
    image: "/furadeira.jpg",
    href: "/produtos?categoria=Ferramentas",
  },
  {
    name: "Videogames",
    description: "Consoles e jogos",
    image: "/ps4.jpg",
    href: "/produtos?categoria=Videogames",
  },
  {
    name: "Monitores",
    description: "Monitores de alta resolução",
    image: "/monitor.jpg",
    href: "/produtos?categoria=Monitores",
  },
];

const advantages = [
  {
    title: "Frete Grátis",
    description: "Entrega gratuita em compras acima de R$ 299.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Compra Segura",
    description: "Pagamento criptografado e 100% seguro.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Troca Fácil",
    description: "30 dias para trocar sem custo adicional.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Suporte 24h",
    description: "Atendimento por WhatsApp a qualquer hora.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
              Novidades 2026
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Encontre os melhores eletrônicos aqui.
            </h1>
            <p className="mt-4 max-w-md text-base text-blue-100">
              Tecnologia de ponta com os melhores preços. Navegue pelas categorias e encontre o que precisa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Ver produtos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Falar com vendedor
              </a>
            </div>
          </div>
          <div className="relative hidden h-72 md:block lg:h-96">
            <Image
              src="/pc gamer.jpg"
              alt="PC Gamer"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {advantages.map((adv) => (
          <div
            key={adv.title}
            className="rounded-xl border border-slate-200 bg-white p-5 text-center transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-600">
              {adv.icon}
            </div>
            <h3 className="mt-3 text-sm font-bold text-black">{adv.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {adv.description}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:p-10">
          <div className="relative h-64 w-full md:h-80">
            <Image
              src="/pc gamer.jpg"
              alt="PC Gamer em destaque"
              fill
              className="object-contain"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Destaque da semana
            </span>
            <h2 className="mt-4 text-2xl font-bold text-black lg:text-3xl">
              PC Gamer High-Performance
            </h2>
            <p className="mt-3 max-w-md text-slate-600">
              Processador Ryzen 5, 16GB de RAM e placa de vídeo RTX 4060. Desempenho máximo para os seus jogos favoritos.
            </p>
            <div className="mt-4">
              <span className="text-sm text-slate-400 line-through">R$ 5.999</span>
              <p className="text-3xl font-extrabold text-black">R$ 4.999</p>
              <p className="text-sm font-semibold text-green-600">Economia de R$ 1.000</p>
            </div>
            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Ver todos os produtos
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <h2 className="mt-14 text-2xl font-bold text-black">Categorias</h2>
      <p className="mt-1 text-slate-600">Explore por tipo de produto</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <h3 className="text-lg font-bold text-black">{cat.name}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{cat.description}</p>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

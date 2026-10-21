import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Homens",
    description: "Tênis masculinos",
    image: "/tenis-masculino.svg",
    href: "/produtos?categoria=Masculino",
  },
  {
    name: "Mulheres",
    description: "Tênis femininos",
    image: "/tenis-feminino.svg",
    href: "/produtos?categoria=Feminino",
  },
  {
    name: "Infantil",
    description: "Tênis infantis",
    image: "/tenis-infantil.svg",
    href: "/produtos?categoria=Infantil",
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
    <div>
      <section className="relative h-[calc(100dvh-5rem)] w-full bg-white md:h-[calc(100dvh-6rem)]">
        <Image
          src="/page_inicio1.png"
          alt="TENIS NEON - Coleção de tênis"
          fill
          className="hidden object-cover object-center md:block"
          priority
          sizes="100vw"
        />
        <Image
          src="/Tenis_premium.png"
          alt="TENIS NEON - Coleção de tênis"
          fill
          className="block object-contain object-center md:hidden"
          priority
          sizes="100vw"
        />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Promoções</h2>
              <p className="mt-1 text-slate-600">Aproveite os melhores preços</p>
            </div>
            <Link href="/produtos?promo=sim" className="text-sm font-semibold text-amber-600 transition hover:text-amber-500">
              Ver todos
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/produtos?promo=sim" className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-amber-400 hover:shadow-md">
              <div className="relative h-40 w-full overflow-hidden bg-slate-50">
                <Image
                  src="/tenis-masculino-1.svg"
                  alt="Promoções"
                  fill
                  className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-2.5 py-1 text-xs font-bold text-black">PROMO</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-black">Tênis em Promoção</h3>
                <p className="mt-1 text-sm text-slate-600">Veja todos os produtos com desconto</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Por Tipo de Tênis</h2>
              <p className="mt-1 text-slate-600">Corrida, Casual, Esportivo, Fashion, Slip-on e Lazer</p>
            </div>
            <Link href="/tipos" className="text-sm font-semibold text-amber-600 transition hover:text-amber-500">
              Ver todos
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[{name:"Corrida",href:"/produtos?tipo=Corrida"},{name:"Casual",href:"/produtos?tipo=Casual"},{name:"Esportivo",href:"/produtos?tipo=Esportivo"},{name:"Fashion",href:"/produtos?tipo=Fashion"},{name:"Slip-on",href:"/produtos?tipo=Slip-on"},{name:"Lazer",href:"/produtos?tipo=Lazer"}].map((t)=>(
              <Link key={t.name} href={t.href} className="rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-amber-400 hover:shadow-sm">
                <span className="text-sm font-semibold text-black">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {advantages.map((adv) => (
            <div
              key={adv.title}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center transition hover:border-amber-400 hover:shadow-sm"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-600">
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
                src="/Tenis_premium.png"
                alt="Tênis Premium em destaque"
                fill
                className="object-contain p-4"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Destaque da semana
              </span>
              <h2 className="mt-4 text-2xl font-bold text-black lg:text-3xl">
                Tênis Runner Masculino
              </h2>
              <p className="mt-3 max-w-md text-slate-600">
                Solado em EVA, cabedal em mesh e numeração do 38 ao 44. Leveza e
                conforto para os seus treinos e para o dia a dia.
              </p>
              <div className="mt-4">
                <span className="text-sm text-slate-500 line-through">R$ 199,90</span>
                <p className="text-3xl font-extrabold text-black">R$ 159,90</p>
                <p className="text-sm font-semibold text-green-600">Economia de R$ 40,00</p>
              </div>
              <Link
                href="/produtos"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
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
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-amber-400 hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-50">
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
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-amber-100 group-hover:text-amber-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <section id="contato" className="mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-black">Contato</h2>
              <p className="mt-2 text-slate-600">Fale conosco pelo WhatsApp e tire suas dúvidas</p>
              <div className="mt-6 space-y-3">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-green-400 hover:bg-green-50">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-black">WhatsApp</p>
                    <p className="text-sm text-slate-600">(11) 99999-9999</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image src="/tenis_neon.png" alt="TENIS NEON" width={400} height={200} className="h-auto w-64 md:w-80" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <Image src="/tenis_neon.png" alt="TENIS NEON" width={1774} height={887} className="h-12 w-auto" />
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} TENIS NEON. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

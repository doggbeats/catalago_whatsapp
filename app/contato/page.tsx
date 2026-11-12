import Image from "next/image";
import Link from "next/link";
import { formatarTelefone, whatsappContatos } from "@/lib/format";

export const metadata = {
  title: "Fale com Well Fashion | Contato",
  description:
    "Fale com a Well Fashion pelo WhatsApp, Instagram ou e-mail. Veja também nosso horário de atendimento.",
};

/** Link de conversa no WhatsApp com mensagem inicial padrão. */
const whatsappHref = (numero: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(
    "Olá! Vim pelo site da Well Fashion e gostaria de atendimento.",
  )}`;

// Canais oficiais — troque aqui quando algo mudar.
const EMAIL = "Wellerson.Araujo.s@gmail.com";
const INSTAGRAM_USUARIO = "wellfshionmoda";
const INSTAGRAM_HREF = `https://instagram.com/${INSTAGRAM_USUARIO}`;

const HORARIOS = [
  { dias: "Segunda a sábado", horas: "8h às 19h" },
  { dias: "Domingo", horas: "Fechado" },
];

const cardBase =
  "flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition";
const rotulo =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500";
const acao =
  "mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold transition";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <Link href="/" className="transition hover:text-white">
                Início
              </Link>
              <span aria-hidden>/</span>
              <span className="text-neutral-200">Contato</span>
            </nav>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Fale com a <span className="text-amber-400">Well Fashion</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">
              Escolha o canal que preferir. Respondemos dúvidas sobre produtos,
              tamanhos, pedidos e entregas.
            </p>
          </div>

          <div className="shrink-0 self-start rounded-2xl bg-white p-4 shadow-lg shadow-black/25 md:self-center">
            <Image
              src="/logo1.png"
              alt="Well Fashion"
              width={418}
              height={146}
              priority
              className="h-auto w-52 sm:w-64 lg:w-72"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* WhatsApp */}
          <article className={`${cardBase} hover:border-green-400`}>
            <header className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-50 text-green-600">
                <svg
                  aria-hidden
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className={rotulo}>WhatsApp</p>
                <p className="text-sm text-neutral-500">
                  Fale direto com a loja
                </p>
              </div>
            </header>

            <div className="mt-4 flex-1 space-y-2">
              {whatsappContatos.map((contato) => (
                <a
                  key={contato.numero}
                  href={whatsappHref(contato.numero)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-2.5 transition hover:border-green-400 hover:bg-green-50"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-black">
                      {contato.nome}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {formatarTelefone(contato.numero)}
                    </span>
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                    <svg
                      aria-hidden
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>

            <p className={`${acao} text-neutral-400`}>
              Toque em um contato para abrir o chat
            </p>
          </article>

          {/* Instagram */}
          <a
            href={INSTAGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardBase} group hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-md`}
          >
            <header className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pink-50 text-pink-600">
                <svg
                  aria-hidden
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className={rotulo}>Instagram</p>
                <p className="text-sm text-neutral-500">
                  Novidades e promoções
                </p>
              </div>
            </header>

            <div className="mt-4 flex-1">
              <p className="break-all text-base font-semibold text-black">
                @{INSTAGRAM_USUARIO}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                Acompanhe lançamentos, novidades e ofertas.
              </p>
            </div>

            <span className={`${acao} text-pink-600 group-hover:text-pink-700`}>
              Seguir no Instagram →
            </span>
          </a>

          {/* E-mail */}
          <a
            href={`mailto:${EMAIL}`}
            className={`${cardBase} group hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md`}
          >
            <header className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                <svg
                  aria-hidden
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className={rotulo}>E-mail</p>
                <p className="text-sm text-neutral-500">
                  Dúvidas, trocas e parcerias
                </p>
              </div>
            </header>

            <div className="mt-4 flex-1">
              <p className="break-all text-base font-semibold text-black">
                {EMAIL}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                Respondemos em horário comercial.
              </p>
            </div>

            <span className={`${acao} text-blue-600 group-hover:text-blue-700`}>
              Enviar e-mail →
            </span>
          </a>

          {/* Horário */}
          <article className={cardBase}>
            <header className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600">
                <svg
                  aria-hidden
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className={rotulo}>Horário de funcionamento</p>
                <p className="text-sm text-neutral-500">
                  Atendimento em horário comercial
                </p>
              </div>
            </header>

            <dl className="mt-4 flex-1 space-y-2 text-sm">
              {HORARIOS.map((item) => (
                <div
                  key={item.dias}
                  className="flex items-baseline justify-between gap-3 border-b border-dashed border-neutral-200 pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-neutral-600">{item.dias}</dt>
                  <dd className="font-semibold text-black">{item.horas}</dd>
                </div>
              ))}
            </dl>

            <p className={`${acao} text-neutral-400`}>
              Pedidos pelo site: 24 horas
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

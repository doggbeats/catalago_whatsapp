import type { Metadata } from "next";
import Link from "next/link";
import { Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import BotoesFlutuantes from "./components/BotoesFlutuantes";
import AnimacaoEntrada from "./components/AnimacaoEntrada";
import { getMarcas } from "@/lib/produtos";
import { whatsappContatos } from "@/lib/format";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TENIS NEON + TÊNIS",
  description:
    "TENIS NEON - Os melhores tênis com os melhores preços. Masculino, Feminino, Infantil e muito mais.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Marcas cadastradas nos produtos alimentam o menu "Marcas" do site.
  const marcas = await getMarcas();
  const whatsappHref = `https://wa.me/${whatsappContatos[0].numero}?text=${encodeURIComponent(
    "Olá! Vim pelo site da Well Fashion e gostaria de atendimento.",
  )}`;

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!/^\\/(admin|login)(\\/|$)/.test(location.pathname)){document.documentElement.classList.add("animar")}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.PIXEL_ID ?? "941509875374620"}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar marcas={marcas} />
        <main className="flex-1">{children}</main>
        <AnimacaoEntrada />

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2 font-bold text-black">
                  Well Fashion
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Os melhores tênis com os melhores preços. Masculino, Feminino, Infantil e muito mais.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Produtos
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Tênis Masculino
                    </span>
                  </li>
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Tênis Feminino
                    </span>
                  </li>
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Tênis Infantil
                    </span>
                  </li>
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Acessórios
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Institucional
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Sobre
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/contato"
                      className="transition hover:text-amber-600"
                    >
                      Contato
                    </Link>
                  </li>
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Política de Troca
                    </span>
                  </li>
                  <li>
                    <span className="cursor-pointer transition hover:text-amber-600">
                      Termos de Uso
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/politica-de-privacidade"
                      className="transition hover:text-amber-600"
                    >
                      Política de Privacidade
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Contato
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="break-all">Wellerson.Araujo.s@gmail.com</li>
                  <li>(61) 99428-2217</li>
                  <li>(61) 99328-3388</li>
                  <li>Brasília - DF</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
              <p>
                © {new Date().getFullYear()} Well Fashion. Todos os direitos
                reservados.
              </p>
              <p className="font-medium text-slate-600">
                code_ph Assistência técnica &amp; Soluções Digitais
              </p>
            </div>
          </div>
        </footer>

        <BotoesFlutuantes whatsappHref={whatsappHref} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ELECTRICS | Catálogo de Produtos Eletrônicos",
  description:
    "ELECTRICS - Os melhores eletrônicos com os melhores preços. Celulares, notebooks, áudio, acessórios e muito mais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
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
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2 font-bold text-black">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white text-sm">
                    ⚡
                  </span>
                  ELECTRICS
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Sua loja de eletrônicos de confiança. Qualidade e preço justo em todos os produtos.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Categorias
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Áudio</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Computadores</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Periféricos</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Videogames</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Institucional
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Sobre</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Contato</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Política de Troca</span></li>
                  <li><span className="hover:text-blue-600 cursor-pointer transition">Termos de Uso</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Contato
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>contato@electrics.com</li>
                  <li>(11) 4002-8922</li>
                  <li>Brasilia - DF</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} ELECTRICS. Todos os direitos reservados.
              CODE_PH - SOLUÇÕES DIGITAIS.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

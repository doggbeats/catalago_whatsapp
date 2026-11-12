import Link from "next/link";
import { whatsappContatos, formatarTelefone } from "@/lib/format";

export const metadata = {
  title: "Política de Privacidade | Well Fashion",
  description:
    "Saiba como a Well Fashion coleta, usa e protege os seus dados pessoais.",
};

const EMAIL = "Wellerson.Araujo.s@gmail.com";

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Link href="/" className="transition hover:text-white">
              Início
            </Link>
            <span aria-hidden>/</span>
            <span className="text-neutral-200">Política de Privacidade</span>
          </nav>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Política de <span className="text-amber-400">Privacidade</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-400">
            Transparência sobre quais dados coletamos, por que coletamos e como
            você pode exercer os seus direitos.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <article className="space-y-10 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10">
          <section>
            <h2 className="text-xl font-bold text-black">1. Quem somos</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              A <strong className="text-black">Well Fashion</strong> é uma loja
              de calçados que atende pelo site e pelo WhatsApp. Esta política
              explica como tratamos os dados pessoais de quem visita o site,
              fala com a loja ou realiza um pedido, em conformidade com a Lei
              Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">
              2. Dados que coletamos
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
              <li>
                <strong className="text-black">Dados de contato:</strong> nome,
                e-mail e telefone/WhatsApp informados por você ao falar com a
                loja.
              </li>
              <li>
                <strong className="text-black">Dados do pedido:</strong>{" "}
                produtos escolhidos, tamanhos, quantidades e endereço de
                entrega.
              </li>
              <li>
                <strong className="text-black">Dados de navegação:</strong>{" "}
                páginas visitadas, itens no carrinho e informações técnicas do
                dispositivo, coletadas por meio de cookies e ferramentas de
                análise.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">
              3. Para que usamos os dados
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
              <li>Responder dúvidas e dar andamento ao atendimento.</li>
              <li>Processar, separar e entregar os pedidos.</li>
              <li>
                Enviar avisos sobre o pedido, como confirmação e código de
                rastreio.
              </li>
              <li>
                Melhorar o site, entender quais produtos são mais procurados e
                exibir ofertas relevantes.
              </li>
              <li>Cumprir obrigações legais e fiscais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">4. Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Usamos cookies próprios para manter o carrinho funcionando e
              cookies de medição (como o Pixel da Meta) para entender o
              desempenho das nossas campanhas. Você pode bloquear ou apagar
              cookies nas configurações do seu navegador — o carrinho e algumas
              funções podem deixar de funcionar corretamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">
              5. Compartilhamento de dados
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Não vendemos dados pessoais. Compartilhamos apenas o necessário
              com quem nos ajuda a atender você: transportadoras e serviços de
              entrega, meios de pagamento, provedores de hospedagem e
              ferramentas de comunicação. Esses parceiros tratam os dados
              somente para as finalidades descritas aqui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">
              6. Por quanto tempo guardamos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Mantemos os dados de pedidos pelo prazo necessário para
              atendimento, trocas, garantia e cumprimento de obrigações legais.
              Depois disso, os dados são eliminados ou anonimizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">
              7. Seus direitos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Você pode solicitar, a qualquer momento: confirmação de que
              tratamos seus dados, acesso, correção, anonimização, portabilidade
              ou exclusão de informações, além de revogar o consentimento dado.
              Para exercer esses direitos, fale com a gente pelos canais abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">8. Segurança</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Adotamos medidas técnicas e administrativas para proteger os dados
              contra acessos não autorizados, perda ou alteração. Ainda assim,
              nenhum sistema é totalmente imune a incidentes — se algo
              acontecer, comunicaremos os titulares afetados conforme a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black">9. Fale com a gente</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Dúvidas sobre esta política ou sobre seus dados podem ser
              enviadas para{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="font-semibold text-black underline decoration-amber-400 decoration-2 underline-offset-2"
              >
                {EMAIL}
              </a>{" "}
              ou pelo WhatsApp:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-neutral-600">
              {whatsappContatos.map((contato) => (
                <li key={contato.numero}>
                  <span className="font-semibold text-black">
                    {contato.nome}
                  </span>{" "}
                  — {formatarTelefone(contato.numero)}
                </li>
              ))}
            </ul>
          </section>

          <p className="border-t border-neutral-200 pt-6 text-xs text-neutral-500">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}.
          </p>
        </article>

        <div className="mt-6 text-center">
          <Link
            href="/contato"
            className="text-sm font-semibold text-amber-600 transition hover:text-amber-500"
          >
            ← Voltar para o contato
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-black">Contato</h1>
      <p className="mt-3 text-slate-600">
        Tem alguma dúvida ou precisa de ajuda? Fale com a gente.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <h2 className="mt-3 font-bold text-black">E-mail</h2>
          <p className="mt-1 text-sm text-slate-600">contato@electrics.com</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.44 1.2l-1.87 1.12a12.05 12.05 0 005.32 5.32l1.12-1.87a1 1 0 011.2-.44l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-2C9.72 21 3 14.28 3 6V5z" />
            </svg>
          </span>
          <h2 className="mt-3 font-bold text-black">Telefone</h2>
          <p className="mt-1 text-sm text-slate-600">(11) 4002-8922</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <h2 className="mt-3 font-bold text-black">Endereço</h2>
          <p className="mt-1 text-sm text-slate-600">Av. Tecnologia, 1000<br />São Paulo/SP</p>
        </div>
      </div>
    </div>
  );
}

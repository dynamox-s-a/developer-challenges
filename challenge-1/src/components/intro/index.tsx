export function Intro() {
  return (
    <section className="w-full max-w-[1348px] mx-auto py-16 lg:mt-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:px-1">
        <h2 className="text-3xl md:text-5xl font-bold">
          Dynamox,{' '}
          <span className="text-gray-dy">
            por uma <br />
            indústria mais segura e <br />
            produtiva
          </span>
        </h2>

        <div className="flex flex-col gap-6">
          <p className="text-gray-600 lg:text-xl">
            Em um mundo em que há crescimento na oferta de sensores e hardwares é normal que a
            escolha entre diferentes produtos seja um processo trabalhoso. Afinal, pesquisas e
            comparações tornam-se necessárias para entender as melhores opções para as respectivas
            aplicações.
          </p>

          <p className="text-gray-600 lg:text-xl">
            Se essa escolha já parece complicada, ao acrescentarmos a questão da análise do
            software, a comparação se torna ainda mais complexa.
          </p>

          <p className="text-gray-600 lg:text-xl">
            Uma forma de simplificar este processo é basear os critérios de análise em um sistema de
            referência. Esse manifesto é a consolidação da visão Dynamox: ser referência em
            tecnologias eficientes e eficazes para monitoramento, manutenção e performance de
            ativos.
          </p>
        </div>
      </div>
    </section>
  );
}

import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dynamox</title>
        <meta name="title" content="Dynamox landing page" />
        <meta
          name="description"
          content="Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <header>
        <nav className="bg-blue flex items-center justify-between px-11 h-[120px]">
          <Link href="https://dynamox.net/">
            <img
              src="/logo-dynamox.png"
              alt="dynamox logo"
              className="w-44"
              draggable={false}
            />
          </Link>
          <ul className="flex text-white gap-9 font-medium -mb-10">
            <li>
              <Link href="https://dynamox.net/dynapredict/">DynaPredict</Link>
            </li>
            <li>
              <Link href="#sensores">Sensores</Link>
            </li>
            <li>
              <Link href="#contato">Contato</Link>
            </li>
          </ul>
        </nav>
      </header>
      <section id="inicio" className="relative h-[calc(100vh-120px)]">
        <img
          src="/grafismo.png"
          alt="grafismo backgroud"
          className="absolute w-screen h-full object-cover"
          draggable={false}
        />
        <div className="flex justify-around items-center w-screen z-10 px-20">
          <div className="z-10 leading-snug gap-8">
            <h1 className="font-bold text-[80px] text-white">
              Solução DynaPredict
            </h1>
            <img
              src="/logo-dynapredict.png"
              alt="logo dynamox"
              draggable={false}
            />
          </div>
          <img
            src="/desktop-and-mobile.png"
            alt="desktop-and-mobile"
            className="z-10 w-[700px]"
            draggable={false}
          />
        </div>
      </section>
      <section
        id="sensores"
        className="flex flex-col justify-center items-center h-screen max-w-5xl mx-auto gap-4"
      >
        <h2 className="font-bold text-4xl text-black text-center">
          Sensores para Manutenção Preditiva
        </h2>
        <p className="text-center text-gray text-xl">
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <Link
          href="https://dynamox.net/dynapredict/"
          className="text-white bg-blue px-11 py-2 rounded font-bold my-8"
        >
          VER MAIS
        </Link>
        <div className="grid grid-cols-3 text-center font-bold text-4xl text-lightBlue">
          <div>
            <img
              src="/sensor-tca.png"
              alt="sensor-tca"
              id="tca"
              className="w-[300px] object-cover"
              draggable={false}
            />
            <label htmlFor="tca">TcA+</label>
          </div>
          <div>
            <img
              src="/sensor-af.png"
              alt="sensor-af"
              id="af"
              className="w-[300px] object-cover"
              draggable={false}
            />
            <label htmlFor="af">AS</label>
          </div>
          <div>
            <img
              src="/sensor-hf.png"
              alt="sensor-hf"
              id="hf"
              className="w-[300px] object-cover"
              draggable={false}
            />
            <label htmlFor="hf">HF</label>
          </div>
        </div>
      </section>
      <section id="contato" className="flex flex-col bg-blue text-center py-10">
        <h3 className="font-bold text-white text-3xl">Ficou com dúvida?</h3>
        <h3 className="font-bold text-white text-3xl">
          Nós entramos em contato com você
        </h3>
        <form className="flex flex-col w-96 mx-auto gap-3 mt-8">
          <input
            type="text"
            placeholder="Como gostaria de ser chamado?"
            className="text-center rounded py-3 placeholder:text-gray"
            required
          />
          <input
            type="text"
            placeholder="Em qual empresa você trabalha?"
            className="text-center rounded py-3 placeholder:text-gray"
            required
          />
          <input
            type="email"
            placeholder="Digite aqui o seu email"
            className="text-center rounded py-3 placeholder:text-gray"
            required
          />
          <input
            type="tel"
            placeholder="Qual o seu telefone?"
            className="text-center rounded py-3 placeholder:text-gray"
            required
          />
          <button
            type="submit"
            className="bg-shockBLue px-14 py-2 text-white font-bold rounded w-fit mx-auto mt-8 tracking-wide"
          >
            ENVIAR
          </button>
        </form>
      </section>
    </>
  );
}

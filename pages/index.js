import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Dynamox - Solução DynaPredict</title>
        <meta 
          name="description" 
          content="Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
          temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
          registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
          são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hello world</h1>
      </main>
    </>
  )
}

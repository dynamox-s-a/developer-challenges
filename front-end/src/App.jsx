import React from 'react'
import Contact from './component/Contact'
import Header from './component/Header'

function App() {

  return (
    <>
      <Header />
      <main className="flex-2 flex-col container max-w-screen-xl">
        <div className="bg-[url('../src/assets/path742.png')] h-[720px] pt-12 bg-no-repeat max-w-96 flex content-between">
          <div className=" text-white flex flex-col ">
            <p className="font-bold text-xs p-8 items-start"> Solução DynaPredict </p>
            <div className="p-8">
              <img src="../src/assets/logo-dynapredict.svg" alt="Logo" />
            </div>
          </div>
          <div className=" bg-[url('../src/assets/13.png')] bg-no-repeat pr-12 max-h-max " >
            <img src="../src/assets/3.png" alt="Notebook" />
          </div>

        </div>
        <section id="sensors">

        <div className="p-2 bg-slate-200">
          <h1 className="font-bold text-sm text-center py-8">Sensores para Manutenção Preditiva</h1>
          <p className="text-base font-normal p-8 text-[#454545] ">Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
            temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
            registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
            são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
        </div>
        <div className=" bg-slate-100">
          <div className="p-8 flex flex-col justify-center items-center">
          <a href="https://dynamox.net/dynapredict/"  className="text-white p-2" >
            <button className="bg-[#263252] text-white text-base px-8 p-4 rounded-lg ">Saiba mais</button>
            </a>
          </div>
          <div className="flex flex-row p-8 justify-between">
            <div>
              <img src="../src/assets/tca 3.png" alt="Notebook" />
              <h1 className="font-bold text-sm text-center py-8 text-[#5D7A8C]">TcA+</h1>
            </div>
            <div>
              <img src="../src/assets/as 3.png" alt="Notebook" />
              <h1 className="font-bold text-sm text-center py-8 text-[#5D7A8C]">AS</h1>
            </div>
            <div>
              <img src="../src/assets/hf 3.png" alt="Notebook" />
              <h1 className="font-bold text-sm text-center py-8 text-[#5D7A8C]">HF</h1>
            </div>
          </div>
        </div>
        </section>
        <Contact/>

      </main>
    </>

  )
}

export default App

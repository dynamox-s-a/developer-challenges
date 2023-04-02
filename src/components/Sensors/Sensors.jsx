import sensores from '../../json/sensores.json';

export default function Sensors() {
  return (
    <section id="sensores" className="bg-dyna-white p-20 flex flex-col items-center">
      <div className="text-center text-dyna-gray">
        <h2 className="text-4xl  font-bold">
          Sensores para Manutenção Preditiva
        </h2>
        <p className="text-2xl mt-4">
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
      </div>
      <div className="">
        <button className="p-1 px-11 rounded-lg bg-dyna-blue text-white text-xl font-bold uppercase m-8">
          <a href="https://dynamox.net/dynapredict/" target="_blank">
            Ver mais
          </a>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row text-center">
        {sensores.map((sensor, i) => (
          <div className="flex flex-col items-center" key={i}>
          <img
            src={sensor.src}
            alt={sensor.alt}
            className="w-[60%] md:w-[100%]"
          />
          <h4 className="sensors-titles">{sensor.name}</h4>
        </div>
        ))}
      </div>
    </section>
  );
}

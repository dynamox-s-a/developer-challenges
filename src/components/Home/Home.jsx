import dynaPredictLogo from '../../assets/logo-dynapredict.png';
import devicesImg from '../../assets/desktop-and-mobile.png';

export default function Home() {
  return (
    <section className='bg-dyna-blue flex flex-col md:flex-row md:bg-home md:bg-no-repeat md:bg-cover md:bg-center  p-12 items-center'>
        <div className='flex flex-col items-center md:items-start md:block md:pl-4'>
            <h1 className='text-center text-3xl md:text-7xl  font-bold text-white'>Solução DynaPredict</h1>
            <img src={dynaPredictLogo} alt="logo do dyna predict" className='mt-2'/>
        </div>
        <div>
            <img src={devicesImg} alt="imagem de um laptop e um smartphone mostrando a interface do dyna predict em suas telas" />
        </div>
    </section>
  )
}

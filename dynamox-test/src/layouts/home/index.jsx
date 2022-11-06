import { Header } from "src/components/header";
import LogoPredict from "src/assets/logo-dynapredict.png";
import graphics from "src/assets/grafismo.png";
import devices from "src/assets/desktop-and-mobile.png";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { SENSORS } from "./constants";
import { Pagination } from "swiper";
import { useForm } from "react-hook-form";
import { Input } from "src/components/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { schemaContactForm } from "./controller";

export const HomeLayout = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schemaContactForm),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <>
      <Header />
      <section
        className="flex-col md:flex-row py-[30px] flex justify-between px-[90px] items-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${graphics.src})`,
        }}
      >
        <aside className="flex md:flex-col gap-[20px] md:gap-[32px] items-start">
          <h1 className="text-[#ffffff] font-bold md:leading-[90px] break-words text-[2rem] md:text-[3rem] lg:text-[5rem]">
            Solução <br />
            DynaPredict
          </h1>
          <Image
            src={LogoPredict}
            alt="Logo Dynamox"
            className="max-w-[131px] w-full h-fit mt-[10px] sm:mt-0"
          />
        </aside>
        <aside>
          <Image src={devices} alt="devices" className="w-full mt-[32px]" />
        </aside>
      </section>
      <section
        className="bg-[#F4F7FC] py-5 flex flex-col items-center justify-center px-5 md:px-36"
        id="sensores"
      >
        <h2 className="text-[#37383D] font-bold text-[1.8rem] md:text-[2.5rem] text-center">
          Sensores para Manutenção Preditiva
        </h2>
        <p className="font-normal text-[1.2rem] text-[#454545] leading-8 text-center max-w-[1050px]">
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <a
          className="uppercase w-full max-w-[183px] transition-colors bg-[#263252] hover:bg-[#182034] font-bold text-[#fff] flex items-center justify-center h-[39px] rounded-[5px] mt-[27px]"
          href="https://dynamox.net/dynapredict/"
        >
          Ver mais
        </a>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          centeredSlides={false}
          modules={[Pagination]}
          className="w-full"
          breakpoints={{
            320: {
              allowTouchMove: true,
              slidesPerView: 1,
              spaceBetween: 0,
              autoplay: {
                delay: 1000,
              },
            },
            720: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {SENSORS.map((sensor) => (
            <SwiperSlide
              key={sensor.title}
              className="flex flex-col items-center justify-center mt-[27px]"
            >
              <Image src={sensor.img} alt={sensor.title} className="w-full" />
              <h3 className="text-[#5D7A8C] font-bold text-[1.5rem] mt-[27px]">
                {sensor.title}
              </h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section
        className="bg-[#263252] py-5 flex flex-col items-center justify-center px-5 md:px-36"
        id="contato"
      >
        <h2 className="text-[#ffffff] font-bold text-[1.875rem] text-center">
          Ficou com dúvida? <br /> Nós entramos em contato com você
        </h2>
        <form
          className="flex flex-col items-center justify-center mt-[31px] w-full gap-[11px]"
          onSubmit={handleSubmit((data) => {
            toast.success(() => (
              <div className="flex flex-col">
                <h3 className="font-bold text-[0.875rem]">
                  Obrigado por entrar em contato!
                </h3>
                <ul>
                  <li className="text-[0.875rem]">Nome: {data.name}</li>
                  <li className="text-[0.875rem]">Email: {data.email}</li>
                  <li className="text-[0.875rem]">Telefone: {data.phone}</li>
                  <li className="text-[0.875rem]">Empresa: {data.company}</li>
                </ul>
              </div>
            ));
            reset();
          })}
        >
          <Input
            placeholder="Como gostaria de ser chamado?"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            placeholder="Em qual empresa você trabalha?"
            error={errors.company?.message}
            {...register("company")}
          />
          <Input
            placeholder="Digite aqui o seu email"
            error={errors.email?.message}
            {...register("email")}
            type="email"
          />
          <Input
            value={(watch("phone") || "").replace(/\D/g, "")}
            placeholder="Qual o seu telefone?"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <button
            type="submit"
            className="uppercase w-full max-w-[183px] transition-colors bg-[#0165DB] hover:bg-[#376192] font-bold text-[#fff] flex items-center justify-center h-[39px] rounded-[5px] mt-[27px]"
          >
            ENVIAR
          </button>
        </form>
      </section>
    </>
  );
};

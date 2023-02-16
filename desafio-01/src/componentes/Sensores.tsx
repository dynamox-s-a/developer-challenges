import React from "react";
import style from "./sensores.module.css";

export default function Senores() {
    return (
        <>
        <div className={style.center} id="sensores">
            <div className={style.maxWidth}>
                <div className={style.content}>
                    <div className={style.text}>
                        <div className={style.title}>
                        Sensores para Manutenção Preditiva
                        </div>
                        <p>
                        Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
        temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
        registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
        são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
                        </p>
                    </div>
                <a href="https://dynamox.net/dynapredict/.">ver mais</a>
                <div className={style.images}>
                    <div className={style.containerImg}>
                        <img src="tca 3.png" alt="sensor tca 3" />
                        TcA+
                    </div>
                    <div className={style.containerImg}>
                        <img src="as 3.png" alt="sensor as 3" />
                        AS
                    </div>
                    <div className={style.containerImg}>
                        <img src="hf 3.png" alt=" sensor hf" />
                        HF
                    </div>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}
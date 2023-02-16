import React from "react";
import style from "./dynaPredict.module.css";

export default function DynaPredict() {
    return (
        <>
            <div className={style.top}>
                <div className={style.maxWidth}>
                    <div className={style.content}>
                        <div className={style.text}>
                            <div className={style.title}>
                                Solução DynaPredict
                            </div>
                            <img src="logo-dynapredict.svg" alt="logo do serviço"/>
                        </div>
                        <img src="desktop-and-mobile.png" alt="imagem notebook" />
                    </div>
                </div>
            </div>
        </>
    )
}
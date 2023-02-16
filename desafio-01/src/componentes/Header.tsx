import React from "react"
import style from "./header.module.css"

export default function Header() {
    return (
        <>
        <nav className={style.Header}>
            <div className={style.maxWidth}>
            <div className={style.content}>
                <a href="https://dynamox.net/">
                <img src="logo-dynamox.png" alt="logo Dynamox" />
                </a>
            <div className={style.buttons}>
                <li><a href="https://dynamox.net/dynapredict/">DynaPredict</a></li>
                <li><a href="#sensores">Sensores</a></li>
                <li><a href="#contato">Contato</a></li>
            </div>
            </div>
            </div>
        </nav>
        </>
    )
}
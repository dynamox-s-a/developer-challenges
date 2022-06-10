import styles from './Solucao.module.css'
import logo from '../../imagens/logo-dynapredict.png';
import dispositivos from '../../imagens/desktop-and-mobile.png';

const Solucao = () => {
    return (
        <section id="SolucaoSection" className={styles.solucao_container}>
            <div className={styles.solucao_message}>
                <h1 className={styles.solucao_title}>Solução<br></br>DynaPredict</h1>
                <img src={logo} className={styles.logo_dynapredict} alt="logo-dynapredict" />
            </div>
            <img src={dispositivos} className={styles.dispositivos} alt="dispositivos" />
        </section>
    );
}
export default Solucao

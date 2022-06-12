import styles from './Solution.module.css'
import logo from '../../images/logo-dynapredict.png';
import devices from '../../images/desktop-and-mobile.png';

const Solution = () => {
    return (
        <section id="SolutionSection" className={styles.solution_container}>
            <div className={styles.solution_message}>
                <h1 className={styles.solution_title}>Solução<br></br>DynaPredict</h1>
                <img src={logo} className={styles.logo_dynapredict} alt="logo-dynapredict" />
            </div>
            <img src={devices} className={styles.devices} alt="dispositivos" />
        </section>
    );
}
export default Solution;

import styles from './Header.module.css'
import LOGO from '../../images/logo-dynamox.png'

const Header = () => {

    return (
        <header className={styles.header}>
            <nav className={styles.header_nav}>
                <img className={styles.nav_img} src={LOGO}/><a href="https://dynamox.net/"></a>
                <ul className={styles.nav_list}>
                    <li className={styles.nav_item}><a className={styles.nav_item_link} href="https://dynamox.net/dynapredict/">DynaPredict</a></li>
                    <li className={styles.nav_item}><a className={styles.nav_item_link} href="#SensorsSection">Sensores</a></li>
                    <li className={styles.nav_item}><a className={styles.nav_item_link} href="#Footer">Contato</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;

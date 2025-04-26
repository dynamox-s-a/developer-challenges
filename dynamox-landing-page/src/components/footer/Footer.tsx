import { SocialIcon } from "../socialIcon/SocialIcon";
import linkedin from "../../assets/icons/LinkedIN_white.png";
import instagram from "../../assets/icons/Instagram_white.png";
import facebook from "../../assets/icons/Facebook_white.png";
import youtube from "../../assets/icons/Youtube_white.png";
import logo from "../../assets/logo_Dynamox 2.png";
import { ButtonLink } from "../buttons/ButtonLink";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} id="contato">
      <div className={styles.content}>
        <img src={logo} className={styles.logo} />

        <div className={styles.socialIcon}>
          <SocialIcon
            link="https://www.linkedin.com/company/dynamox/"
            icon={linkedin}
          />
          <SocialIcon
            link="https://www.instagram.com/dynamox_s.a/"
            icon={instagram}
          />
          <SocialIcon
            link="https://www.facebook.com/dynamoxtech/"
            icon={facebook}
          />
          <SocialIcon
            link="https://www.youtube.com/@DynamoxTech"
            icon={youtube}
          />
        </div>
      </div>

      <div className={styles.containerText}>
        <p>&copy; {new Date().getFullYear()} Dynamox. All Rights Reserved.</p>
        <div className={styles.contentText}>
          <ButtonLink variante="footer">Consentimentos de cookies</ButtonLink>
          <span className={styles.dot}></span>
          <ButtonLink variante="footer">Aviso de privacidade</ButtonLink>
        </div>
      </div>
    </footer>
  );
}

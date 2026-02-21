import styles from './Footer.module.scss';
import Icon from '@/components/atoms/Icon/Icon';
import { footerData } from './Footer.data';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <img src={footerData.brand.logoSrc} alt={footerData.brand.logoAlt} className={styles.footer__logo} />
        <nav aria-label="Social media" className={styles.footer__social}>
          {footerData.socialLinks.map((item) => (
            <a key={item.label} href={item.href} aria-label={item.label}>
              <Icon icon={item.icon} size={20} />
            </a>
          ))}
        </nav>
      </div>
      <hr className={styles.footer__divider} />
      <div className={styles.footer__bottom}>
        <span>©{footerData.year} Dynamox. All Rights Reserved</span>

        <div className={styles.footer__links}>
          {footerData.legalLinks.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
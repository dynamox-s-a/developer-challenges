import styles from '@/styles/Button.module.css'

export const Button = ({ children, color }) => {

  const colorClass = color === "dark" ? styles.darkblue : styles.blue;

  return (
    <button className={`${styles.button} ${colorClass}`}>
      {children}
    </button>
  )
}
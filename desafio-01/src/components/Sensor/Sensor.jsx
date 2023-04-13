import styles from '@/styles/Sensor.module.css';

export const Sensor = ({ img, text }) => {
  return (
    <div className={styles.secContinerItem}>
      <img src={img} alt={"Sensor " + text} />
      <h3>{text}</h3>
    </div>
  )
}
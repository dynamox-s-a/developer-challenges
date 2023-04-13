import styles from '@/styles/Input.module.css';

export const Input = ({ type = "text", placeholder, onChange }) => {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
}
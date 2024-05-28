import styles from "../Styles/Loading.module.css";
import ReactLoading from "react-loading";

interface iLoading {
  size: number;
  type: any;
  label?: string;
}

const Loading: React.FC<iLoading> = ({ size, type, label }) => {
  return (
    <div className={styles.container}>
      <ReactLoading type={type} height={size} width={size} color="lightblue" />
      {label && <p>{label}</p>}
    </div>
  );
};

export default Loading;
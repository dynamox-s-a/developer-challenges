import styles from "./InputDates.module.css"

const InputDates = ({children, date_id, value, onChange}) => {
    return (
        <div className={styles.Date_container}>
            <label className={styles.Input_date_label} for="date">{children}</label>
            <input 
            name="date"
            value={value} 
            id={date_id}
            onChange={onChange}
            className={styles.Input_date} 
            type="date"
            required 
            />
        </div>
    )
}

export default InputDates
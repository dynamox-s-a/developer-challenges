import styles from "./PerishableProductValidDates.module.css"
import { useEffect, useState } from "react";
import InputDates from "../InputDates/InputDates";

const PerishableProductValidDates = () => {

    const [isPerishable, setIsPerishable] = useState();
    const [manufacturingDate, setManufacturingDate] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [isDateValid, setIsDateValid] = useState();

    useEffect(() => {
        if (expirationDate > manufacturingDate) {
          setIsDateValid(true);
        } else {
          setIsDateValid(false);
        }
    }, [expirationDate, isDateValid, manufacturingDate]);

    const transformValue = (value) => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
        }
        return value;
    }

    const checkIfPerishable = (e) => setIsPerishable(transformValue(e.target.value));

    return (
        <div className={styles.Perishable_product_container}>
            <legend className={styles.Perishable_product_legend}>Produto Perecível?</legend>
            <div className={styles.Perishable_product_option}>
                <input 
                className={styles.Perishable_product_input} 
                name="prodPerecivel" 
                value={true}
                id="yes" 
                type="radio" 
                onChange={checkIfPerishable}
                required
                />
                <label className={styles.Perishable_product_input_label} for="yes">Sim</label>
            </div>
            <div className={styles.Perishable_product_option}>
                <input 
                className={styles.Perishable_product_input} 
                name="prodPerecivel" 
                value={false} 
                id="no" 
                type="radio" 
                onChange={checkIfPerishable}
                onRadioChange
                required 
                />
                <label className={styles.Perishable_product_input_label} for="no">Não</label>
            </div>
            <InputDates
            children="Data de Fabricação:"
            value={manufacturingDate}
            onChange={(e) => setManufacturingDate(e.target.value)}
            />
            {isPerishable && (
            <>
            <InputDates
            children="Data de Validade:"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            />
            {!isDateValid && <p className={styles.Invalid_dates}>A data de validade precisa ser maior que a data de fabricação</p>}
            </>
            )}
        </div>
    )
}

export default PerishableProductValidDates
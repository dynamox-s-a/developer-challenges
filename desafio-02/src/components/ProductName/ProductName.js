import styles from "./ProductName.module.css";
import { useState } from "react";


const ProductName = () => {

    const [enteredName, setEnteredName] = useState('');
    const [enteredNameIsValid, setEnteredNameIsValid] = useState();

    const nameInputChangeHandler = (event) => {
        setEnteredName(event.target.value);
        if (enteredName.trim() !== '') {
            setEnteredNameIsValid(true)
        } else {
            setEnteredNameIsValid(false)
        }
    };

    return (
        <div className={styles.Product_name_container}>
            <label className={styles.Input_name_label} for="nome">Nome do Produto:</label>
            <input className={styles.Input_name} 
            onChange={nameInputChangeHandler}
            value={enteredName} 
            name="name" 
            id="name"  
            type="text" 
            placeholder="Nome do Produto" />
            {!enteredNameIsValid && (
            <p className={styles.Input_name_error}>Este campo deve ser preenchido</p>
            )}
        </div>          
    )
}

export default ProductName
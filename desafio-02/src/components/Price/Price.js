import styles from './Price.module.css';
import CurrencyInput from 'react-currency-masked-input';
import { useState } from 'react';

const Price = () => {

    const [enteredPrice, setEnteredPrice] = useState('');
    const [enteredPriceIsValid, setEnteredPriceIsValid] = useState();

    const priceInputChangeHandler = (event) => {
        setEnteredPrice(event.target.value);
        if (enteredPrice.trim() !== '') {
            setEnteredPriceIsValid(true)
        } else {
            setEnteredPriceIsValid(false)
        }
    }
    
    return(
        <div className={styles.Price_container}>
            <label className={styles.Price_label} for="price">Preço do Produto (R$):</label>
            <CurrencyInput
            name="price" 
            id="price" 
            onChange={priceInputChangeHandler}
            className={styles.Price_input}
            type="number"
            placeholder='0,00'
            required/>
            {!enteredPriceIsValid && (
            <p className={styles.Input_price_error}>Este campo deve ser preenchido</p>
            )}
        </div>
    )
}
export default Price
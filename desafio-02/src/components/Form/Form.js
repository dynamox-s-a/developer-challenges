import ProductName from "../ProductName/ProductName";
import PerishableProductValidDates from "../PerishableProductValidDates/PerishableProductValidDates";
import Price from "../Price/Price";
import Button from "../Button/Button";

const Form = () => {
    return (
        <form>
            <ProductName />
            <PerishableProductValidDates />
            <Price />
            <Button />
        </form>
    )
}

export default Form;
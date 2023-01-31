import SubmitProduct from '../../components/productForm/productForm';

export default function NewProduct() {
  const product = {
    name: '',
    fabricationDate: '',
    perishable: '',
    expirationDate: '',
    price: ''
  };

  return <SubmitProduct product={product} page={'newProductPage'} />;
}

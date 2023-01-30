import SubmitProduct from "../../components/productForm/productForm";
import { getProductById } from "../../services/apiProducts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useConfigHeaders from "../../utils/useConfigHeaders";

export default function EditProduct() {
  const { id } = useParams();
  const config = useConfigHeaders();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    async function GetProduct() {
      try {
        const product = await getProductById(id, config);
        setProduct(product);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
    GetProduct();
  }, []);

  return <SubmitProduct product={product} page={"editproduct"} />;
}

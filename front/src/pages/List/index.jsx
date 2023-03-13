import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import ModalProduct from "../../components/ModalProduct";
import convertDate from "../../utils/convertDate";

import {getAllProducts, removeProductFetch} from "../../store/fethActions";

import {Table, Button} from "react-bootstrap";
import {PencilSimple, Trash} from "phosphor-react";

export default function List() {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };
  function removeItem(product) {
    dispatch(removeProductFetch(product.id));
  }

  return (
    <>
      <Button className="primary mb-3" onClick={handleShow}>
        Adicionar
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Data de Fabricação</th>
            <th>Perecível</th>
            <th>Data de Validade</th>
            <th>Preço (R$)</th>
            <th>Editar</th>
            <th>Remover</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            return (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{convertDate(product.manufacturing_date)}</td>
                {product.perishable === "true" ? <td>Sim</td> : <td>Não</td>}
                <td>
                  {product.expiration_date
                    ? convertDate(product.expiration_date)
                    : "-"}
                </td>
                <td>{product.price}</td>
                <td>
                  <div>
                    <PencilSimple
                      cursor="pointer"
                      onClick={() => handleEditProduct(product)}
                      alt="edit"
                    />
                  </div>
                </td>
                <td>
                  <div>
                    <Trash
                      cursor="pointer"
                      alt="remove"
                      onClick={() => removeItem(product)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <ModalProduct show={show} onClose={handleClose} product={selectedProduct} />
    </>
  );
}

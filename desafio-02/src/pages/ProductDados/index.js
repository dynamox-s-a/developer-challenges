import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';

import productApi from '../../helpers/productApi'
import ProductForm from '../../components/Form/ProductForm';

import { Container, Row, Col } from 'react-grid';

export default () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const res = await productApi.getProducts();
        if (res.error === '') {
            setProducts(res.result);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Container>
            <Row>
                <Col style={{ position: "static" }}>
                    <ProductForm></ProductForm>
                </Col>

            </Row>
            <Row style={{ marginTop: "25px" }}>
                <Col style={{ position: "static" }}>
                    <Button variant="outlined" color="primary" onClick={() => history.push('/product')} style={{ textTransform: "none", marginTop: "25px", margin: "0px" }}>Voltar</Button>
                </Col>
            </Row>
        </Container>
    );
}
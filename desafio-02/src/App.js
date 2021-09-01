import React from 'react';
import { BrowserRouter, Switch } from "react-router-dom";

import RouterHandler from './components/RouterHandler';

import Sidebar from './components/Sidebar/Sidebar'

import { Container, PageBody, Header, Footer, MainContainer } from './AppStyled';
import './App.css';
import HomeScreen from './pages/HomeScreen';
import Poduct from './pages/Product';
import ProductDados from './pages/ProductDados';
import Login from './pages/Login';

export default () => {
    //const name = useSelector(state => state.user.name);

    return (
        <BrowserRouter>
            <RouterHandler exact path="/login">
                <Login />
            </RouterHandler>

            <Container>
                <MainContainer>
                    <Header>
                        <Sidebar />
                        React - Desafio 02
                    </Header>
                </MainContainer>
                <PageBody>
                    <Switch>
                        <RouterHandler private exact path="/">
                            <HomeScreen />
                        </RouterHandler>
                        <RouterHandler private path="/product">
                            <Poduct />
                        </RouterHandler>
                        <RouterHandler private path="/product-dados">
                            <ProductDados />
                        </RouterHandler>


                    </Switch>
                </PageBody>
                <Footer>
                    React - Desafio 02
                </Footer>
                
            </Container>
        </BrowserRouter>
    );
}
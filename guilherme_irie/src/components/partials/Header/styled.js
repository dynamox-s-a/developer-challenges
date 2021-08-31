import styled from 'styled-components';

export const HeaderArea = styled.div`
    height: 120px;
    background-color: #263252;
    
    .container {
        max-width: 80%;
        height: 120px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .logo {
        height: 65px;
        width: 175px;
        display: flex;
    }
    img {
        width: 100%;
        height: auto;
    }
    nav {
        padding-top: 60px;
        padding-bottom: 10px;
        
        ul, li{
            margin: 0;
            padding: 0;
            list-style: none;            
        }
        ul {
            display: flex;
            align-items: center;
        }
        li {
            margin-left: 20px;
            margin-right: 20px;

            a {
                color: #fff;
                text-decoration: none;
                font-size: 20px;
                font-weight: 500;
            }
        }
    }
    
    @media (max-width: 600px) {
        height: auto;
        .container {
            flex-direction: column;
            height: auto;
        }
        .logo {
            margin: 20px 0px;
        }
        nav {
            padding-top: 40px;
        }
        ul {
            flex-direction: column;
            height: auto;
        }
        nav li {
            margin-bottom: 15px;
        }
    }
`;
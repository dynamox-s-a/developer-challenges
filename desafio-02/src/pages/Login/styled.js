import styled from 'styled-components';

export const PageArea = styled.div`

    form{
        background-color:#FFF;
        border-radius:3px;
        padding:10px;
        box-shadow:0px 0px 3px #999;
        margin-bottom:40px;

        
        .area2 {
            display:flex;
        }

        .area2 p {
            margin-top:0;
            margin-bottom:0;
            margin-left:auto;
            max-width:107px;
        }

        .area {
            display:flex;
            align-items:center;
            padding:10px;
            max-width:500px;
            

            .area--title {
                width:200px;
                text-align:right;
                padding-right:20px;
                font-weight:bold;
                font-size:14px;
            }
            .area--input {
                flex:1;
                
                input {
                    width:100%;
                    font-size:14px;
                    padding:5px;
                    border:1px solid #DDD;
                    border-radius:3px;
                    outline:0;
                    transition:all ease .4s;
                    float:left;

                    &:focus {
                        border:1px solid #333;
                        color:#333;
                    }
                }

                .checkbox { 
                    width:14px;
                    
                }

                button {
                    background-color:#0089FF;
                    border:0;
                    outline:0;
                    padding:5px 10px;
                    border-radius:4px;
                    color:#FFF;
                    font-size:15px;
                    cursor:pointer;

                    &:hover {
                        background-color:#006FCE;
                    }
                }
            }

        }
    }
`;
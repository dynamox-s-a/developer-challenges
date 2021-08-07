import styled from "styled-components";
import grafismo from "../../assets/grafismo.png"

export const Grafismo = styled.div`
  background-size: 100vw 80vh;
  height: 80vh;
  width: 100vw;
  background-image: url(${grafismo});
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  h1{
      font-size: 80px;
      font-family: 'Raleway', sans-serif;
      line-height: 90px;
  }
  .left {
    margin-left: 8vw;
    display: flex;
    flex-direction: column;
    text-align: left;
    img{
        width:10vw;
        margin-top: 20px;
    }
  }
  `
  
export const Container = styled.div`
  height: 100vh;
  width: 100vw;

  `
export const Sensores = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 100px 90px 0px 90px;
    color: var(--boldgreen);
    h1{
        font-size:50px;
        font-family: 'Raleway', sans-serif;
        line-height: 110px;
    }
    h2{
        font-size:20px;
        font-family: 'Raleway', sans-serif;
        line-height: 25px;
        font-weight: lighter;
        color:'#5D7A8C'
    }
    img{
        margin-top: 100px;
        margin-left: 60px;
        height:300px;
    }
`
export const Down = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
    margin-bottom: 36px;
    h2{
        color:'#5D7A8C';
        font-weight: bold;
        font-size: 40px;
        margin-left:70px;
    }
`
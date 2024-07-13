import styled from '@emotion/styled'


const fontColor = '#3A3B3F'
const borderColor = '#DFE3E8'

const Main = styled.main`
    background-color: #F8FAFC;
`

const HeaderTitleBox = styled.div`
    padding: 24px;
    background-color: #fff;
    border-top: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};
`

const HeaderTitle = styled.p`
    font-weight: 500; 
    font-size: 20px;
`

const MachineInfo = styled.header`
    display: flex;
    justify-content: space-around;
    padding: 10px;
    margin: 24px;
    font-size: 14px;
    font-weight: bold;
    color: ${fontColor};
    background-color: #fff;
    border: 1px solid ${borderColor};
`

export function Data() {
    return (
        <Main>
            <HeaderTitleBox>
                <HeaderTitle>Análise de dados</HeaderTitle>
            </HeaderTitleBox>
            <MachineInfo>
                <span>Máquina 1023</span>
                <span>Ponto 20192</span>
                <span>200 RPM</span>
                <span>16g</span>
                <span>20 min</span>
            </MachineInfo>
        </Main>
    )
}

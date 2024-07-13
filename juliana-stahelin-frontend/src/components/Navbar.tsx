import styled from '@emotion/styled'


const fontColor = '#303552'

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    color: ${fontColor};
`

const Span = styled.span`
    font-weight: 700;
    font-size: 20px;
`

const Ul = styled.ul`
    padding-left: 0;
    list-style-type: none;
    text-decoration: none;
`
const A = styled.a`
    text-decoration: none;
    &:visited {
        color: ${fontColor};
    }
`

export function Navbar() {
    return (
        <Nav>
            <Span>
                <A href='/'>DynaPredict</A>
            </Span>
            <Ul>
                <li>
                    <A href='/data'>Data</A>
                </li>
            </Ul>
        </Nav>
    )
}
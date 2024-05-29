import styled from "@emotion/styled";

export const CardContainer = styled.div`
  position: relative;
  padding: 16px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows[3]};
  height: 100%;
  display: flex;
  align-items: center;
  min-height: 40px;
`
export const CardHeader = styled.header`
  display: flex;
  gap: 16px;
`

export const CardDescription = styled.header`
  display: flex;
  gap: 4px;

  span {
    font-size: 0.875rem;
    color: ${props => props.theme.palette.grey[600]};
  }

  p {
    font-weight: 700;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.grey[700]};
  }

`

interface CardInfoProps {
  variant: boolean | null
}

export const CardInfo = styled.span<CardInfoProps>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 8px;
  

  svg {
    font-size: 12px;
    color: ${props => props.theme.palette.grey[400]};

    cursor: ${props => props.variant === false ? 'pointer' : 'auto'};

    &:hover {
      color: ${props => props.theme.palette.grey[500]};
    }
  }
`

export const CardHelper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 16px;
  
  top: 56px;
  right: 0;
  z-index: 1000;
  background-color: ${props => props.theme.palette.grey.A100};
  padding: 16px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows[3]};

  span {
    font-size: 0.75rem;
    color: ${props => props.theme.palette.grey[700]}
  }

`

// export const CardContent = styled.body``

// export const CardFooter = styled.footer``



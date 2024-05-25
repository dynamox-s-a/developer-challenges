import { useState } from "react";
import { CardContainer, CardDescription, CardHeader, CardInfo, InfoPortal } from "./card.styles";
import InfoIcon from '@mui/icons-material/Info';



interface CardProps {
  data: {
    icon: string,
    title?: string,
    description: string
    helper?: string
  }
}

export function Card({ data }: CardProps ){
  const [isInfoVisible, setInfoVisible] = useState(false)

  return (
    <>
      <CardContainer>
        <CardHeader>
          <img src={data.icon} alt={data.title} />

          <CardDescription>
            {data.title && (
              <span>{data.title}</span>
            )}
            <p>
              {data.description}
            </p>
          </CardDescription>

          <CardInfo variant={isInfoVisible} onClick={() => setInfoVisible(true)} onMouseLeave={() => setInfoVisible(false)}>
            <span >
              <InfoIcon />
            </span>
            
            {data.helper && isInfoVisible ? <InfoPortal >{data.helper}</InfoPortal> : null}
            
          </CardInfo>
        </CardHeader>
      </CardContainer>
    </>
  )
}
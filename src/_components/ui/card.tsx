import { useState } from "react";
import { CardContainer, CardDescription, CardHeader, CardInfo, CardHelper } from "./card.styles";
import InfoIcon from '@mui/icons-material/Info';

interface CardProps {
  data: {
    type: string;
    title?: string | undefined;
    description: string;
    helper?: string | undefined;
  }
  icon: string;
}

export function Card({ data, icon }: CardProps ){
  const [isInfoVisible, setInfoVisible] = useState(false)

  return (
    <>
      <CardContainer>
        <CardHeader>
          <img src={icon} alt={data.title} />

          <CardDescription>
            {data.title && (
              <span>{data.title}</span>
            )}
            <p>
              {data.description}
            </p>
          </CardDescription>

          <CardInfo variant={isInfoVisible} onClick={() => setInfoVisible(!isInfoVisible)} onMouseLeave={() => setInfoVisible(false)}>
            <span >
              <InfoIcon />
            </span>
          </CardInfo>
          
          {data.helper && isInfoVisible ? (
            <CardHelper>
              <InfoIcon />
              <span>{data.helper}</span>
            </CardHelper> 
          ) : (
            null
          )}
        </CardHeader>
      </CardContainer>
    </>
  )
}
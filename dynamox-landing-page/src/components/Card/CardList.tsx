import { cardData } from "./cardData";
import { Card } from "./Card";
import styles from "./card.module.css";

export const CardList = () => {
  return (
    <div className={styles.container}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          image={card.image}
          icon={card.icon}
          titleSpan={card.titleSpan}
          title={card.title}
          description={card.description}
          list={card.list}
          linkText={card.linkText}
          invert={index % 2 !== 0}
        />
      ))}
    </div>
  );
};

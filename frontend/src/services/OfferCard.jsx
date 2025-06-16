import React from "react";
import "./offer-card.css";

const OfferCard = ({ item }) => {
  const { imgUrl, title, desc } = item;

  return (
    <div className="offer__item">
      <div className="offer__img">
        {/* Render the icon directly here */}
        <div className="icon-container">{imgUrl}</div>
      </div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  );
};

export default OfferCard;

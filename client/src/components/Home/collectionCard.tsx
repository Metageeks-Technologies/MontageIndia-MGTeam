import React from "react";
interface Card {
  title: string;
  image: string;
}

const CardSlider = (card: Card) => {
  return (
    <div className="">
      <div className="relative group">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  rounded flex items-center justify-center">
          <div className="text-white font-semibold text-lg absolute bottom-3 left-5">
            {card.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSlider;

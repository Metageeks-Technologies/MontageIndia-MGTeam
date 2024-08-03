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
          className="lg:w-[21rem] md:w-[23rem] w-[23rem] h-[27rem] object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity rounded-lg flex items-center justify-center">
          <div className="text-white font-semibold text-lg absolute bottom-20 text-center">
            {card.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSlider;

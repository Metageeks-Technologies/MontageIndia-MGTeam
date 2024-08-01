import React from "react";
import { GoVideo } from "react-icons/go";

interface Card {
  title: string;
  image: string;
}

const cards: Card[] = [
  {
    title: "Cinematic Lightscapes",
    image:
      "https://images.ctfassets.net/hrltx12pl8hq/15JSyH0rEvAQWTU2OP55Kw/1fc5ea75df571edd7c2731acd5124a6e/Cinematic-lightscapes.jpg",
  },
  {
    title: "Summer Action",
    image:
      "https://images.ctfassets.net/hrltx12pl8hq/6n76rBKjbDYUTu6cIWlBp8/58f297d91bd0057626197e1ac5d0fadb/SummerAction.jpg",
  },
  {
    title: "Calming Textures",
    image:
      "https://images.ctfassets.net/hrltx12pl8hq/6kdzY2fgPHsyBwEXVLGb9/7b99fed0765784014b03506703e34482/Calming-Textures.jpg",
  },
  {
    title: "Time-Lapsed Cities",
    image:
      "https://images.ctfassets.net/hrltx12pl8hq/7errAkofD3gYCvRAEXMGfG/9a02870250fc2c82edbda96757aa1f9d/Time-Lapsed.jpg",
  },
];

const CollectionVideos: React.FC = () => {
  return (
    <div className="container mx-auto gap-4 grid grid-cols-4 mt-4">
      {cards.map((card, index) => (
        <div key={index} className="">
          <div className="relative group">
            <img
              src={card.image}
              alt={card.title}
              className="w-[21rem] h-[27rem] object-cover rounded-md"
            />
           
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white font-semibold text-lg absolute bottom-20 text-center">
                {card.title}
              </div>
              <div className="absolute m-2 top-0 left-0  ">
             <GoVideo className="text-white h-6 w-6"/>
             
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionVideos;

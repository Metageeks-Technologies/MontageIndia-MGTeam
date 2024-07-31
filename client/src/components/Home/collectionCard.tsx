import React from "react";
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

interface Card {
  title: string;
  image: string;
}

const cards: Card[] = [
  { title: "Fourth of July",
  image: "https://wallpapers.com/images/hd/natural-scenery-pictures-736-x-1308-2yckka60jpvm2q4e.jpg"
  },
  { title: "Summer Gardens",
     image: "https://i.pinimg.com/736x/79/fd/d1/79fdd17253b569a417e980a99aecd978.jpg" 
    },
  { title: "Lucid Dreaming",
     image: "https://mrwallpaper.com/images/high/single-boy-in-yellow-hoodie-0lwl18k2bha6gwz6.jpg" },
  { title: "Teamwork",
     image: "https://i0.wp.com/thetitansfa.com/wp-content/uploads/2024/01/034www.emmahurleyphotography.com_-scaled.jpg?fit=1708%2C2560&ssl=1"
     },
];

const CardSlider: React.FC = () => {
  //   const settings = {
  //     dots: true,
  //     infinite: true,
  //     speed: 500,
  //     slidesToShow: 4,
  //     slidesToScroll: 1,
  //     responsive: [
  //       {
  //         breakpoint: 1024,
  //         settings: {
  //           slidesToShow: 3,
  //           slidesToScroll: 1,
  //           infinite: true,
  //           dots: true,
  //         },
  //       },
  //       {
  //         breakpoint: 600,
  //         settings: {
  //           slidesToShow: 2,
  //           slidesToScroll: 1,
  //         },
  //       },
  //       {
  //         breakpoint: 480,
  //         settings: {
  //           slidesToShow: 1,
  //           slidesToScroll: 1,
  //         },
  //       },
  //     ],
  //   };

  return (
    <div className="container mx-auto gap-4 grid grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className="">
         <div className="relative group">
              <img
                src={card.image}
                alt={card.title}
                className="w-[21rem] h-[27rem] object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity rounded-lg flex items-center justify-center">
                <div className="text-white font-semibold text-lg absolute bottom-20 text-center">{card.title}</div>
              </div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default CardSlider;

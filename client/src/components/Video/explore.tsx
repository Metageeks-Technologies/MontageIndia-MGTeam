import React from 'react';

// Define the type for the data
interface DataItem {
  src: string;
  alt: string;
  title: string;
}

// Create the data array with the defined type
const data: DataItem[] = [
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/3gYAxshGSCUIGBxXnZcQ3g/265cf34736c5d138f28bf8512b7b604d/ANIMATION.jpg',
    alt: 'photo',
    title: 'Animation',
  },
  {
    src: 'https://th.bing.com/th/id/OIP.Wyh-5QTAg_V8E6CF42Jh3QHaEo?rs=1&pid=ImgDetMain',
    alt: 'photo',
    title: 'Technology',
  },
  {
    src: 'https://wallpapercave.com/wp/wp9252388.jpg',
    alt: 'People',
    title: 'People',
  },
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/6ALMt46m23i1dGGBG1Mgoy/dcf86387d9c0a603184d32999c65d789/Vertical-Videos.png',
    alt: 'photo',
    title: 'Vertical Videos',
  },
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/YfNwagJs5Ompmwp6RVlWU/645e5e4e3d817bc7b3feac650fe6dcdf/Shutterstock_Aerial_Footage.png',
    alt: 'photo',
    title: 'Aerial',
  },
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/7LTISDm9CN2AT2GMHhRccq/92bb2d54733521118040494b1bcd0f04/LANDSCAPE.jpg',
    alt: 'photo',
    title: 'Editorial',
  },
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/70BLhrXKeb1EZQqFOrumoM/2e1aa806ea65d171f9fbcc1bc135ecd6/ELEMENTS.jpg',
    alt: 'photo',
    title: 'Video effect',
  },
  {
    src: 'https://images.ctfassets.net/hrltx12pl8hq/3FTM1NJ5J6fdfn5FHavsDY/526b18d56021261b411787550475b73d/SELECT.jpg',
    alt: 'photo',
    title: 'Select',
  },
];

const Explore: React.FC = () => {
  return (
   
      <div className="grid grid-cols-4">
        {data.map((item, index) => (
          <div key={index} className="flex gap-3 mt-5 items-center">
            <img
              src={item.src}
              alt={item.alt}
              className="object-cover rounded-md h-24 w-24"
            />
            <h1 className="font-semibold">{item.title}</h1>
          </div>
        ))}
      </div>
    
  );
};

export default Explore;

// components/WeeklyInspiration.tsx
import React from 'react';

type ImageData = {
  title: string;
  imageUrl: string;
  author: string;
  authorUrl: string;
  downloadUrl: string;
};

const images = [
    {
      title: 'Free stock image of the week',
      imageUrl: 'https://thumbs.dreamstime.com/b/father-s-day-happy-family-daughter-hugging-dad-laughs-holiday-father-s-day-happy-family-daughter-hugging-dad-laughs-114528530.jpg', // Replace with actual image path
      author: 'Oakland Images',
      authorUrl: '#', // Replace with actual author URL
      downloadUrl: '#', // Replace with actual download URL
    },
    {
      title: 'Free stock vector of the week',
      imageUrl: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2020/05/Frame-9.png', // Replace with actual image path
      author: 'Net Vector',
      authorUrl: '#', // Replace with actual author URL
      downloadUrl: '#', // Replace with actual download URL
    },
  ];
const WeeklyCard: React.FC = () => {
  return (
    <div className="bg-gray-100 py-10">
      <div className=" flex mx-24 justify-around items-center ">
        <div className="text-center lg:text-left basis-[35%]">
          <h1 className="text-5xl font-bold mb-4">A weekly dose of inspiration, just for you</h1>
          <p className="text-gray-600 mb-6 text-xl">Sign up and get a free image or photo every week</p>
          <button className="bg-red-500 text-white py-3 px-8 rounded-full">Get Started</button>
        </div>
        <div className="flex  basis-[65%] justify-around">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden ">
              <img src={image.imageUrl} alt={image.title} className="w-80 rounded-md h-44 object-cover" />
              <div className="mt-2">
                <p className="font-semibold">{image.title}</p>
                <p className="text-sm text-gray-600">By <a href={image.authorUrl} className="text-blue-600">{image.author}</a></p>
                <a href={image.downloadUrl} className="text-blue-600 mt-2 block">Download</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCard;

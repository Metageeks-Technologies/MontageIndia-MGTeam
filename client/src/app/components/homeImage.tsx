import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";

const imageUrls: string[] = [
  "https://st4.depositphotos.com/13349494/27948/i/450/depositphotos_279485478-stock-photo-close-view-coffee-white-cup.jpg",
  "https://weavinghomes.in/cdn/shop/articles/wepik-export-20240307060627bjSq.jpg?v=1709791629",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDo890dsxpB5UCLQFdVBWmK4qVxTrsrLEEUg&s",
  "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg",
  "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736881_640.jpg",
  "https://images.ctfassets.net/hrltx12pl8hq/3Z1N8LpxtXNQhBD5EnIg8X/975e2497dc598bb64fde390592ae1133/spring-images-min.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/026/722/501/small/illustration-image-nature-and-sustainability-eco-friendly-living-and-conservation-concept-art-of-earth-and-animal-life-in-different-environments-generative-ai-illustration-free-photo.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqSWmUnh99TCZJ2UmJt0-LR8hrCjX3LlauMw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3KLsKw0jLKi6EOWlMs2QnOvqlopxW-8i54w&s",
];

const ImageGallery: React.FC = () => {


    function truncateText(text: string, wordLimit: number): string {
        const words = text.split(" ");
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
      }

      const text = "Pink macro image of a ranunculus flower";
  const truncatedText = truncateText(text, 6);

  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between ">
        <div className=" flex space-x-4">
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Flower
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            porttrait
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Interior
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            texture
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Animal
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Nature
          </button>
        </div>
        <div className="flex gap-5">
          <h2 className="text-xl font-bold">Handpicked content</h2>
          <h2 className="text-xl">Most popular</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 mt-5">
  {imageUrls.map((url, index) => (
    <div key={index} className="relative rounded-md overflow-hidden group cursor-pointer">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={url}
          alt={`Image ${index + 1}`}
          className="w-full h-72 object-cover"
        />
      </div>
      <div className="absolute top-0 left-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white  px-2 py-2 rounded">{truncatedText}</p>
      </div>
      <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center">
        <IoMdHeartEmpty className="h-5 w-5"/>
         <p className="text-sm">Save</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 m-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="text-white bg-black bg-opacity-50 p-1 flex items-center gap-1 ml-2">
      <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="16" height="3" fill="#fff" />
    <rect x="4" y="8" width="16" height="3" fill="#fff" />
    <rect x="4" y="12" width="16" height="8" fill="#fff" />
  </svg>
         <p>Save</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 m-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button className="text-white bg-black bg-opacity-50 p-1 rounded-full ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default ImageGallery;

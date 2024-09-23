import Image, { StaticImageData } from "next/image";
import "./banner-style.css";

const image1 = "/images/banner/2.jpg";
const image2 = "/images/banner/3.jpg";
const image3 = "/images/banner/5.jpg";
const image4 = "/images/banner/6.jpg";
const image5 = "/images/banner/7.jpg";
const image6 = "/images/banner/9.jpg";
const image7 = "/images/banner/11.jpg";
const image8 = "/images/banner/12.jpg";
const image9 = "/images/banner/13.jpg";
const image10 = "/images/banner/14.jpg";
const image11 = "/images/banner/15.jpg";

import CollageEffectSection from "./CollageEffectSection";
const imagesData = [
  // {
  //   frontImageUrl: image2,
  //   backImageUrl: image5,
  // },
  // {
  //   frontImageUrl: image3,
  //   backImageUrl: image2,
  // },
  // {
  //   frontImageUrl: image5,
  //   backImageUrl: image3,
  // },
  {
    frontImageUrl: image10,
    backImageUrl: image11,
  },

  {
    frontImageUrl: image2,
    backImageUrl: image4,
  },
  {
    frontImageUrl: image5,
    backImageUrl: image6,
  },

  {
    frontImageUrl: image3,
    backImageUrl: image9,
  },
  {
    frontImageUrl: image8,
    backImageUrl: image7,
  },
  // {
  //   frontImageUrl: image2,
  //   backImageUrl: image5,
  // },
  // {
  //   frontImageUrl: image3,
  //   backImageUrl: image2,
  // },
  // {
  //   frontImageUrl: image5,
  //   backImageUrl: image3,
  // },
  // {
  //   frontImageUrl: image6,
  //   backImageUrl: image5,
  // },
  // {
  //   frontImageUrl: image7,
  //   backImageUrl: image6,
  // },
  // {
  //   frontImageUrl: image8,
  //   backImageUrl: image7,
  // },
  // {
  //   frontImageUrl: image9,
  //   backImageUrl: image8,
  // },
  // {
  //   frontImageUrl: image3,
  //   backImageUrl: image9,
  // },
  // {
  //   frontImageUrl: image8,
  //   backImageUrl: image7,
  // },
  // {
  //   frontImageUrl: image9,
  //   backImageUrl: image8,
  // },
];

const Hero = () => {
  const backgroundImageUrl =
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg";

  return (
    // <div
    //   className=" py-40"
    //   style={{
    //     backgroundImage: `url(${backgroundImageUrl})`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
    // >
    //   <div className="flex flex-col items-center justify-center">
    //     <h1 className="text-white font-bold text-5xl justify-center text-center">
    //       Unleash your creativity with unrivaled images
    //     </h1>
    //     <p className="text-white p-5 justify-center text-center font-medium">
    //       Add wonder to your stories with 425M+ photos, vectors, illustrations,
    //       and editorial images.
    //     </p>
    //       <div className="flex justify-between w-full backdrop-blur-md p-5 rounded-md gap-4 max-w-6xl mx-auto mb-3">
    //             <select className="rounded-md outline-none shadow-black shadow-md p-3 mr-3">
    //                 <option value="all" className="flex">All images</option>
    //                 <option value="editorial">Editorial</option>
    //                 <option value="video">Video</option>
    //             </select>
    //         <div className="flex-1 text-white flex justify-center">
    //           <div className="w-full ">
    //             <input
    //               type="text"
    //               placeholder="Search for images"
    //               className="w-full py-3 rounded-l-md outline-none shadow-md text-black shadow-black px-2 "
    //             />
    //           </div>
    //             <button className="btn bg-red-500 rounded-r-md  px-5 outline-none shadow-md shadow-black">
    //               <FaSearch size={20}/>
    //             </button>
    //         </div>
    //         <div className=" sm:flex hidden">
    //             <button className="btn bg-white rounded-md py-2 px-3 outline-none shadow-black shadow-md flex items-center gap-2 text-lg text-[#444]"><IoMdCamera size={26} color={"#444"}/> Search by image</button>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-3">
    //       <button className="flex text-white items-center gap-2 border border-white rounded-full px-4  py-1 text-sm font-medium">
    //             <FaSearch/>
    //             Winter
    //         </button><button className="flex text-white items-center gap-2 border border-white rounded-full px-4   py-1 text-sm font-medium">
    //             <FaSearch/>
    //              Happy Birthday
    //         </button><button className="flex text-white items-center gap-2 border border-white rounded-full px-4   py-1 text-sm font-medium">
    //             <FaSearch/>
    //              Christmas
    //         </button><button className="flex text-white items-center gap-2 border border-white rounded-full px-4   py-1 text-sm font-medium">
    //             <FaSearch/>
    //              Christmas Tree
    //         </button><button className="flex text-white items-center gap-2 border border-white rounded-full px-4   py-1 text-sm font-medium">
    //             <FaSearch/>
    //              Happy New Year
    //         </button>
    //     </div>
    //   </div>
    // </div>
    <CollageEffectSection
      elementsData={imagesData.map((d) => {
        return {
          front: <Card data={{ url: d.frontImageUrl }} />,
          back: <Card data={{ url: d.backImageUrl }} />,
        };
      })}
    />
  );
};
const Card = ({ data }: { data: { url: string | StaticImageData } }) => {
  return (
    <Image
      fill={true}
      alt=""
      className=" lazyloaded"
      src={data.url}
      data-src={data.url}
    />
  );
};
export default Hero;

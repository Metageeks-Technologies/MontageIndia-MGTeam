"use client"
import Footer from "@/components/Footer";
import Blog from "@/components/Video/blog";
import Category from "@/components/Video/category";
import CollectionVideos from "@/components/Video/collectionVideos";
import Explore from "@/components/Video/explore";
import Trending from "@/components/Video/trendingVideos";
import { IoIosSearch } from "react-icons/io";
import React, { useEffect, useState } from "react";
import FAQ from "@/components/Video/fag";
import instance from "@/utils/axios";
import { Product } from "@/types/order";
import ImageGallery from "@/components/Home/homeImage";
import { Button, Pagination, Spinner } from "@nextui-org/react";

// videos data
type Video = {
  video: string;
};

const videoUrls: Video[] = [
  { video: "/images/dance.webm" },
  { video: "/images/Flower.webm" },
  { video: "/images/sky.webm" },
  { video: "/images/Yellow_Final.webm" },
  { video: "/images/sky.webm" },
  { video: "/images/Flower.webm" },
  { video: "/images/sky.webm" },
  { video: "/images/dance.webm" },
  { video: "/images/Yellow_Final.webm" },
];

// collection data
interface Card
{
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

// Blog Data
export interface BlogPost
{
  imageUrl: string;
  title: string;
  description: string;
}

const posts: BlogPost[] = [
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/6nJaRnp2pkQcIq5qDlnTlL/37e62b10f34ccd1669629045c14312ff/rgbcover.webp",
    title: "Free Colorful Clip Art to Promote Sales and Discounts",
    description:
      "Neon-colored and easy-to-use PNGs are here to assist you with any sale or promotion you’ve planned for 2023.",
  },
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/1PMfxyPFpntWyrKVeScdDD/e59aac83bb3e5b5737d1a60cd08dd8e5/stock_footage_glossary_cover.webp",
    title: "How to Build Brand Trust Through Good Design",
    description:
      "Reach your audience with five shortcuts for building brand trust through good design.",
  },
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/26vH4jX8NikGFE4EgOeIjB/2761c52ebba2de165a2e4dc3507acdeb/5-ProjectsFeature__1_.webp",
    title: "How to Write Better Generative AI Descriptions",
    description:
      "Get tips and tricks on how to adjust your text, so you can create imagery without limits.",
  },
];

// category Data
export interface category
{
  title: string;
  imageUrl: string;
}

const categories: category[] = [
  {
    title: "Abstract",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/29slzVZfucEQwKoKc8QcEA/ed7ceb74525e822dd3eb888f570f0d52/adventure"
  },
  {
    title: "Animals | Wildlife",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/79UGbvGqfj9bQVi66yr9VT/1cae2227203e2c3c7ff3b21befe96a9f/Abstract"
  },
  {
    title: "The arts",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/61MiY3Wj3U6KSSKi2muig2/7e4c77aa598ca4ac93aab5858c3e7627/Autumn"
  },
  {
    title: "Backgrounds | Textures",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/yZsuq5HdBuUmYekaKiuUQ/d73a0e6f5fe939be07a19f22a92f2e09/Wild-Life"
  },
  {
    title: "Beauty | Fashion",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/77nM3vIkxOy0MSIeESAsi6/ef81eb2041ae0b3a240a8241c732b0eb/3D_Footage"
  },
  {
    title: "Beauty | Fashion",
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/2R1nDTrRheK6ae2IWAgGwW/e879fceb983dd133702ecdbfb560d4cd/Aerial"
  },
];

const Page = () => {

  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [productData, setProductData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true); 
  const [loading,setloading]=useState(false)
  const getProduct = async () =>
  {
    setloading(true)
    try
    {
      const response = await instance.get(`/product/customer`,{
        params: { status: 'published',productsPerPage, page: currentPage,category: selectedCategories, searchTerm: SearchTerm   },
      }
       );
       if(response.status===200){
      setloading(false)
      const Products = response.data.products.filter( ( product: any ) => product.mediaType === 'image' );
      console.log(response.data)
      setProductData(Products);
      setTotalPages(response.data.numOfPages);
       }
    } catch ( error )
    {    
    setloading(false)
    console.log( error );
    }
  };
  const handlePageChange = ( page: number ) =>
    {
      setShouldFetch(true);
      setCurrentPage(page);
    };

    useEffect(() => {
        if (shouldFetch) {
            getProduct();
            setShouldFetch(false);
        }
    
      }, [currentPage, productsPerPage,shouldFetch]);
      




  return (
      <div className="main  ">
      <div className="relative h-[550px] w-full overflow-hidden">
        <video
          className="absolute h-full w-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/images/VHP_5-27.webm" type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 md:px-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Unleash your creativity with unrivaled images
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl">
            Add wonder to your stories with 450M+ photos, vectors,
            illustrations, and editorial images.
          </p>
          <div className="w-full max-w-7xl bg-white  rounded-lg shadow-lg">
            <div className="flex lg:flex-wrap flex-row items-center gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for image"
                  onChange={( e ) => setSearchTerm( e.target.value )}
                  value={SearchTerm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevents the default action of the Enter key (like submitting a form)
                      getProduct();
                    }
                  }}
                  className="w-full px-4 outline-none py-2 border border-gray-400 rounded-md text-black"
                />
                <button onClick={getProduct} className="absolute right-2 top-1/2 transform -translate-y-1/2  text-gray-600 p-2 rounded-md  transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center space-x-2 space-y-2 md:space-y-2 sm:space-x-4">
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Happy birthday
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Thank You
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Background
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Congratulations
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Business
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Welcome
            </button>
          </div>
        </div>
      </div>

      {/* <div className="p-10 mx-24 border">
        <h1 className="text-2xl font-bold">Explore Stock Footage Categories</h1>

        <Explore />
      </div> */}

      <div className="bg-[#eeeeee]">
        <div className="py-10 lg:mx-24 md:mx-4 mx-4">
          <h1 className="text-2xl font-bold lg:text-start md:text-center text-center ">Today's Trending Videos</h1>
          <div className="mx-auto mt-4">
            <div className="flex flex-col lg:flex-row md:flex-col md:gap-4 justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:space-y-1 space-y-1  space-x-2 sm:space-x-2">
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Flower
                </button>
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Portrait
                </button>
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Interior
                </button>
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Texture
                </button>
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Animal
                </button>
                <button className="flex items-center text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                  <IoIosSearch className="h-5 w-5 mr-1" />
                  Nature
                </button>
              </div>
              <div className="flex flex-wrap px-5 gap-5 item-end">
              <button className="border-black  border-b-3 px-3 font-bold">
                Handpicked 
              </button>
              <button>Most popular</button>
            </div>
            </div>

            {loading?            
            <div className="h-screen justify-center flex">   
            <Spinner color="success"/>
            </div>:
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
            { productData.map( ( data: any, index: number ) => (
                <ImageGallery key={ index } data={ data } />
              ) ) }  
            </div>}
          </div>
          {/* <div className="mt-8 flex justify-center ">
            <button className="flex items-center text-lg px-6 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
              See more Image
            </button>
          </div> */}
        </div>
      </div>
      {totalPages>0 && <div className="flex justify-center items-center gap-4 my-4">
                <Button
                    size="sm"
                    type="button"
                    disabled={currentPage === 1}
                    variant="flat"
                    className={`${currentPage === 1 ? "opacity-70" : "hover:bg-webgreenHover"} bg-webgreen-light text-white rounded-md font-bold`}
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                    >
                    Prev
                </Button> 
                <Pagination 
                    color="success" 
                    classNames={{
                    item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-md",
                    cursor:"bg-webgreen hover:bg-webgreen text-white rounded-md font-bold",
                    }} 
                    total={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange}  
                    initialPage={1} />

                <Button
                type="button"
                disabled={currentPage === totalPages}
                size="sm"
                variant="flat"
                className={`${currentPage === totalPages ? "opacity-70" : "hover:bg-webgreenHover"} bg-webgreen-light text-white rounded-md font-bold`}
                onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                >
                Next
                </Button>
        </div>
      }
      <Footer />
    </div>

  );
};

export default Page;

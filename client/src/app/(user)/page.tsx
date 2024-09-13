"use client";
import Footer from "@/components/Footer";
import BlogCard from "@/components/Home/blogCard";
import CategoryCard from "@/components/Home/categoryCard";
import CardSlider from "@/components/Home/collectionCard";
import ImageGallery from "@/components/Home/homeImage";
import WeeklyCard from "@/components/Home/weeklyCard";
import instance from "@/utils/axios";
import { Navbar } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import CartPopup from "@/components/cart/cartPage";
import { getCartData, getCurrCustomer } from "../redux/feature/user/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Hero from "@/components/Home/gallary/Hero";
import TopBanner from "@/components/navbar/TopBanner";
import { IoCameraOutline } from "react-icons/io5";
import Banner from "@/components/Banner";
import VideoBanner from "@/components/Home/videoBanner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Collection data
interface Card {
  title: string;
  image: string;
}

const cards: Card[] = [
  {
    title: "Video",
    image: "asset/Mask group.jpg",
  },
  {
    title: "Image",
    image: "asset/Group 13224.jpg",
  },
  {
    title: "Audio",
    image: "asset/Mask group 1.jpg",
  },
];

//Weakly data
type ImageData = {
  imageUrl: string;
};

const ImageData: ImageData[] = [
  {
    imageUrl: "/asset/Group6.jpg",
  },
  {
    imageUrl: "/asset/Mask group2.jpg",
  },
  {
    imageUrl: "/asset/Mask group3.jpg",
  },
  {
    imageUrl: "/asset/Mask group4.jpg",
  },
  {
    imageUrl: "/asset/Group6.jpg",
  },
  {
    imageUrl: "/asset/Mask group5.jpg",
  },
  {
    imageUrl: "/asset/Group6.jpg",
  },

  {
    imageUrl: "/asset/Mask group7.jpg",
  },
  {
    imageUrl:
      "https://www.holidify.com/images/cmsuploads/compressed/5621259188_e74d63cb05_b_20180302140149.jpg",
  },

  {
    imageUrl: "/asset/Mask group10.jpg",
  },
  {
    imageUrl: "/asset/Mask group11.jpg",
  },
  {
    imageUrl: "/asset/Group6.jpg",
  },
];
// Blog Data
export interface BlogPost {
  imageUrl: string;
  title: string;
  description: string;
}

const posts: BlogPost[] = [
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2022/12/seasonal-sales-cover-design.jpg?resize=1250,1120",
    title: "Free Colorful Clip Art to Promote Sales and Discounts",
    description:
      "Neon-colored and easy-to-use PNGs are here to assist you with any sale or promotion you’ve planned for 2023.",
  },
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/Brand-trust-design_featured-3.jpg?resize=1250,1120",
    title: "How to Build Brand Trust Through Good Design",
    description:
      "Reach your audience with five shortcuts for building brand trust through good design.",
  },
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/generative_ai_prompts_2.jpg?resize=1250,1120",
    title: "How to Write Better Generative AI Descriptions",
    description:
      "Get tips and tricks on how to adjust your text, so you can create imagery without limits.",
  },
];

//companey data

type Company = {
  name: string;
  logo: string;
};

const companies: Company[] = [
  {
    name: "epaimages",
    logo: "/asset/Group 13210.jpg",
  },
  {
    name: "epaimages",
    logo: "/asset/Group 13209.jpg",
  },
  {
    name: "LIFE",
    logo: "/asset/Group 13208.jpg",
  },
  {
    name: "BFA",
    logo: "/asset/Group 13207.jpg",
  },
  {
    name: "REX",
    logo: "/asset/Group 13206.jpg",
  },
  {
    name: "STRINGR",
    logo: "/asset/Group 13205.jpg",
  },
];

interface Category {
  name: string;
  image: string;
  description: string;
}

export default function Home() {
  const [imageProducts, setImageProducts] = useState([]);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();
  const productIds = useAppSelector((state: any) => state.user?.user?.cart);
  const user = useAppSelector((state: any) => state.user?.user?._id);
  const initialLoad = useRef(true);

  const getProduct = async () => {
    try {
      const res = await instance.get("/product/get");
      const imageProducts = res.data.products.filter(
        (product: any) => product.mediaType === "image"
      );
      setImageProducts(imageProducts);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategory = async () => {
    console.log("getCategory called: ", page);
    if (Number(categories.length) >= 16) {
      setHasMore(false);
      return;
    }
    try {
      setLoading(true);
      const res = await instance.get("/field/category", {
        params: {
          page: page,
        },
        withCredentials: true,
      });
      console.log("res", res.data);
      if (res.data.categories.length > 0) {
        setCategories((prevCategories) => [
          ...prevCategories,
          ...res.data.categories,
        ]);
      }
      setPage(page + 1);
      setHasMore(res.data.hasMore);
      if (categories.length >= 16 || page >= 2) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCurrCustomer(dispatch);
    if (user) {
      getCartData(dispatch);
      getProduct();
    }
  }, [user]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      getCategory();
    }
  }, []);

  const handleLoadMore = () => {
    setPage(2);
    getCategory();
  };

  return (
    <div className="main  ">
      {/* <TopBanner
        description="Summer Sale! Up to 50% off on selected items."
        buttonText="Shop Now"
        onClick={() => console.log( 'Redirecting to Sale Page' )}
      /> */}

      {/* <Banner /> */}
      <VideoBanner
        isSearch={true}
        videoPath="/images/banner.mp4"
        heading="Montage India"
        description="Discover amazing content and services tailored just for you."
      />
      <div className="lg:mx-24 md:mx-4 mx-4 py-14 ">
        <div className="flex flex-col md:flex-row justify-center items-center mb-4">
          <h2 className="text-2xl text-[#333333] sm:text-3xl lg:text-3xl text-center font-semibold mb-4 md:mb-0">
            Find the right content for your projects, at the right price.
          </h2>
        </div>
        <div className="container mx-auto gap-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:mt-3">
          <div
            className="relative group border cursor-pointer"
            onClick={() => router.push("/video")}
          >
            <img
              src="asset/Mask group.jpg"
              alt="Video image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  rounded flex items-center justify-center">
              <div className="text-white font-semibold text-lg absolute bottom-3 left-5">
                Video
              </div>
            </div>
          </div>

          <div
            className="relative group border cursor-pointer"
            onClick={() => router.push("/image")}
          >
            <img
              src="asset/Group 13224.jpg"
              alt="image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  rounded flex items-center justify-center">
              <div className="text-white font-semibold text-lg absolute bottom-3 left-5">
                Image
              </div>
            </div>
          </div>

          <div
            className="relative group border cursor-pointer"
            onClick={() => router.push("/audio")}
          >
            <img
              src="asset/Mask group 1.jpg"
              alt="Audio image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  rounded flex items-center justify-center">
              <div className="text-white font-semibold text-lg absolute bottom-3 left-5">
                Audio
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-full h-full">
        <Hero />
      </div> */}

      <div className="bg-[#eeeeee]">
        <div className="py-4 md:py-12 lg:mx-24 sm:mx-4 mx-2">
          <h1 className="lg:text-4xl text-2xl md:text-2xl mt-2 md:mt-4 font-semibold text-center text-[#333333]">
            See what’s trending
          </h1>
          <div className="mx-auto mt-6">
            <div className="columns-1  md:columns-3 lg:columns-4 gap-2 mt-5">
              {ImageData.map((data: any, index: number) => (
                <div key={index} className="mb-2 break-inside-avoid">
                  <div className=" rounded overflow-hidden">
                    <img
                      src={data.imageUrl}
                      alt={`Product Image `}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:mx-24 sm:mx-4 mx-2 py-4 md:py-10 text-white mt-4 md:mt-8">
        <h1 className="text-[#333333] text-2xl md:text-3xl text-center font-bold mb-6">
          Browse by category to find your perfect visual
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.map((data: Category, index) => (
            <Link href={`/search/image?searchTerm=${data.name}&mediaType=image`} key={index} >
              {/* Masonry item */}
             <div className="relative">
                {/* Inner div */}
                <img
                  src={data.image}
                  alt={`Product Image `}
                  // loading="lazy"
                  className="w-full h-28 md:h-52 object-cover hover:opacity-90 rounded"
                />
                <div className="absolute bottom-0 py-0.5 md:py-1.5 w-full bg-[#00000089] ">
                  <h1 className="text-white text-sm md:text-md font-bold capitalize text-center">
                    {data.name}
                  </h1>
                </div>
              </div>
              {/* <div className="text-zinc-950 px-2 capitalize font-semibold text-start">
                    {data.name}
                </div> */}
            </Link>
          ))}
        </div>
        {hasMore && !loading && (
          <div className="flex justify-center">
            <button
              onClick={() => handleLoadMore()}
              className="bg-webred hover:bg-red-600 text-white py-1 px-2 md:py-2 md:px-4 mt-8 rounded-md "
            >
              Load More
            </button>
          </div>
        )}
      </div>
      {/* dummy commit */}
      <div className="bg-[#eeeeee] mt-8">
        <div className="container w-full m-auto py-4 md:py-14 flex flex-col bg-[#eeeeee] items-center">
          <h2 className="text-2xl text-[#333333] md:text-3xl lg:text-3xl font-bold mb-5 text-center">
            Trusted by the world's largest companies
          </h2>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-2">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center md:mb-4 p-4 md:gap-5 border border-neutral-200"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-32 md:h-20 md:w-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

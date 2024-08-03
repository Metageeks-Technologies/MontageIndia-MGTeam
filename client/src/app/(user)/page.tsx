"use client";
import Footer from "@/components/Footer";
import BlogCard from "@/components/Home/blogCard";
import CategoryCard from "@/components/Home/categoryCard";
import CardSlider from "@/components/Home/collectionCard";
import ImageGallery from "@/components/Home/homeImage";
import WeeklyCard from "@/components/Home/weeklyCard";
import instance from "@/utils/axios";
import { Navbar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";


// Collection data
interface Card
{
  title: string;
  image: string;
}

const cards: Card[] = [
  {
    title: "Fourth of July",
    image:
      "https://wallpapers.com/images/hd/natural-scenery-pictures-736-x-1308-2yckka60jpvm2q4e.jpg",
  },
  {
    title: "Summer Gardens",
    image:
      "https://i.pinimg.com/736x/79/fd/d1/79fdd17253b569a417e980a99aecd978.jpg",
  },
  {
    title: "Lucid Dreaming",
    image:
      "https://mrwallpaper.com/images/high/single-boy-in-yellow-hoodie-0lwl18k2bha6gwz6.jpg",
  },
  {
    title: "Teamwork",
    image:
      "https://i0.wp.com/thetitansfa.com/wp-content/uploads/2024/01/034www.emmahurleyphotography.com_-scaled.jpg?fit=1708%2C2560&ssl=1",
  },
];

//Weakly data
type ImageData = {
  title: string;
  imageUrl: string;
  author: string;
  authorUrl: string;
  downloadUrl: string;
};

const weekly: ImageData[] = [
  {
    title: "Free stock image of the week",
    imageUrl:
      "https://thumbs.dreamstime.com/b/father-s-day-happy-family-daughter-hugging-dad-laughs-holiday-father-s-day-happy-family-daughter-hugging-dad-laughs-114528530.jpg", // Replace with actual image path
    author: "Oakland Images",
    authorUrl: "#",
    downloadUrl: "#",
  },
  {
    title: "Free stock vector of the week",
    imageUrl:
      "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2020/05/Frame-9.png", // Replace with actual image path
    author: "Net Vector",
    authorUrl: "#",
    downloadUrl: "#",
  },
];

//Category data
export interface Category
{
  title: string;
  imageUrl: string;
}

const categories: Category[] = [
  {
    title: "Abstract",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/4l5bZtkt4f7nH7uyFQi4Vb/812e369976caabe99bb89814953885d6/5_abstract_painting.webp",
  },
  {
    title: "Animals | Wildlife",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/6gsGYFitrk9QqdPcMjKYiM/e58384dbbddc2f74a8dc0e259c8eeccd/3_abstract_backgrounds.webp",
  },
  {
    title: "The arts",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/1zbtYRlwha0ejHWl8SVY5A/1cc4ec2315bb1cc0265707318303d45c/1_abstract_art.webp",
  },
  {
    title: "Backgrounds | Textures",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/6cOybdXpcRTB19N9G5pQ37/dbe37d306fdb3dda2d3d59e18cf28437/7_abstract_architecture.webp",
  },
  {
    title: "Beauty | Fashion",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/7AY0lFMWFYM7pnMvQYU8dG/b535109e3fb2f0209cd0f66ee5e68e39/12_geometric_abstract.webp",
  },
  {
    title: "Buildings | Landmarks",
    imageUrl: "https://wallpapercave.com/wp/wp2665219.jpg",
  },
  {
    title: "Business | Finance",
    imageUrl:
      "https://th.bing.com/th/id/OIP.HFEyPXmLD5Sf_zMpRkMPKAHaEo?rs=1&pid=ImgDetMain",
  },
  {
    title: "Celebrities",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/1XwvE7PgPMss95unrtW7Ca/b4fea6f2e5d563495733b18cb158a75e/11_Royalty.webp",
  },
  {
    title: "Editorial",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/7jI7WkXc39siBLuzcHRSwC/5e131766e000075654bdfd7cb8c66db7/9_abstract_shapes.webp",
  },
  {
    title: "Education",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/42EmxNsqRKZdbrSS5tdpqd/9b076211db1689819a4e39cf5071e8e1/8_abstract_sketches.webp",
  },
  {
    title: "Food and drink",
    imageUrl:
      "https://th.bing.com/th/id/OIP.BJOamtIJl_1eASDCsPF28QHaEo?rs=1&pid=ImgDetMain",
  },
  {
    title: "Healthcare | Medical",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/49ZEwUkFyZ4afTVjUzwrlF/ba0bd80a123a051b0af0c71fb4e2abd6/1_medicine.webp",
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
    logo: "https://www.freepnglogos.com/uploads/company-logo-png/hyundai-motor-company-logo-png-transparent-0.png",
  },
  {
    name: "LIFE",
    logo: "https://www.freepnglogos.com/uploads/company-logo-png/file-mobile-apps-development-company-logo-25.png",
  },
  {
    name: "BFA",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
  },
  {
    name: "REX",
    logo: "https://www.carlogos.org/logo/Mahindra-logo-2560x1440.png",
  },
  {
    name: "STRINGR",
    logo: "https://images.squarespace-cdn.com/content/v1/5f0097caead12b7ccccaac20/dd58c926-7bba-40ef-9f8b-0c8db6f004b0/Add_The_Wonder_Black.png",
  },
  {
    name: "itv",
    logo: "https://static.vecteezy.com/system/resources/previews/020/975/568/original/tvs-logo-tvs-icon-transparent-free-png.png",
  },
];

export default function Home ()
{
  const [ imageProducts, setImageProducts ] = useState( [] );


  const getProduct = async () =>
  {
    try
    {
      const res = await instance.get( '/product' );
      const imageProducts = res.data.products.filter( ( product: any ) => product.mediaType === 'image' );
      setImageProducts( imageProducts );
      console.log( res );

    } catch ( error )
    {
      console.log( error );
    }
  };

  useEffect( () =>
  {
    getProduct();
  }, [] );



  return (
    <div className="main  ">

      {/* Image Routes Banner Section */ }
      <div
        className="relative bg-cover bg-center h-[600px] md:h-[500px] sm:h-[400px]"
        style={ {
          backgroundImage:
            "url(https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=1280&h=720&fm=webp)",
        } }
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Unleash your creativity with unrivaled images
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            Add wonder to your stories with 450M+ photos, vectors,
            illustrations, and editorial images.
          </p>
          <div className="mt-6 flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-y-2 space-y-2">
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Happy birthday
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Thank You
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Background
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Congratulations
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Business
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Welcome
            </button>
          </div>
        </div>
      </div>

      {/* <div className="p-10 px-24">
        <h1 className="text-3xl font-bold">
          Explore images that ignite your creativity
        </h1>
        <div className="flex justify-between">
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/2ppk3Ug2z6oFMZY5z8WXnx/75af41f13939954c93de0ff8c1972612/shutterstock_1922207966.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Photos</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/1qoVFqqABKxtFRMkUh0v6l/6a9bbdc723ac373f4e44400de87997b2/shutterstock_1734177410__1_.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">vector</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/go6z2gBaTMDvTrtoOipOw/3b9d21ff7003ca392a2daeb569d629fc/shutterstock_1802211250.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">IIIustrations</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/ss2daMHu3XewLBroGgbtp/6cf4fbe1fc297c20ee6cd2bb303e12a1/shutterstock_2390735237.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">AI Image Generator</h1>
          </div>
        </div>
      </div> */}

      <div className="bg-[#eeeeee]">
        <div className="py-10 lg:mx-24 sm:mx-4 mx-2">
          <h1 className="lg:text-5xl sm:text-3xl text-2xl font-semibold lg:text-start md:text-center text-center">
            See what’s trending
          </h1>
          <div className="mx-auto mt-4">
            <div className="flex flex-col md:flex-col md:gap-4 lg:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center  md:space-y-1 space-y-1  space-x-2 sm:space-x-2">
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
              <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-center">
                <h2 className="lg:text-lg font-bold">Handpicked content</h2>
                <h2 className="lg:text-lg ">Most popular</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
              { imageProducts.map( ( data: any, index: number ) => (
                <ImageGallery key={ index } { ...data } />
              ) ) }
            </div>
          </div>
          <div className="mt-8 flex justify-center ">
            <button className="flex items-center text-lg px-6 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
              See more Image
            </button>
          </div>
        </div>
      </div>

      <div className="lg:mx-24 md:mx-4 mx-4 py-12 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold mb-4 md:mb-0">
            Explore fresh collections
          </h2>
          <button className="flex mb-2 items-center text-lg sm:text-lg px-4 sm:px-8 font-semibold py-2 border border-gray-700 rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more Images
          </button>
        </div>
        <div className="container mx-auto gap-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:mt-3">
          { cards.map( ( card, index ) => (
            <CardSlider key={ index } { ...card } />
          ) ) }
        </div>
      </div>

      <div className="bg-gray-100 py-10">
        <div className="flex lg:mx-32 md:mx-4 mx-4 items-center lg:flex-row sm:flex-col flex-col">
          <div className="lg:text-left lg:basis-[35%]">
            <h1 className="lg:text-5xl md:text-3xl text-2xl font-bold mb-4">
              A weekly dose of inspiration, just for you
            </h1>
            <p className="text-gray-600 mb-6 text-xl">
              Sign up and get a free image or photo every week
            </p>
            <div className="flex justify-center">
              <button className="bg-red-500 text-white  py-3 px-8 rounded-full">
                Get Started
              </button>
            </div>
          </div>
          <div className="flex lg:basis-[65%] lg:justify-around md:gap-5 md:mt-4 mt-4">
            { weekly.map( ( data, index ) => (
              <WeeklyCard key={ index } { ...data } />
            ) ) }
          </div>
        </div>
      </div>

      <div className="lg:mx-24 md:mx-4 mx-4 py-10">
        <h2 className="text-3xl font-bold mb-6">
          Browse by category to find your perfect visual
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          { categories.map( ( data, index ) => (
            <CategoryCard key={ index } { ...data } />
          ) ) }
        </div>
        <div className="mt-8 flex justify-center ">
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more
          </button>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="lg:mx-24 sm:mx-4 mx-4 py-10">
          <h2 className="text-3xl font-bold mb-6">
            Tips and tricks from our blog
          </h2>
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden">
            <div className="md:w-1/2">
              <img
                src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/negative_space_cover.jpg?resize=1250,1120"
                className="w-full h-[23rem] object-cover"
              />
            </div>
            <div className="p-4 md:w-1/2 flex flex-col justify-center">
              <h3 className="font-semibold mb-2">
                How to Incorporate Negative Space in Design and Photography
              </h3>
              <p className="text-gray-700 text-sm">
                Learn why negative space works in design and photography, and
                pick up a few tips for using it in your own creative content.
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-4 gap-4">
            { posts.map( ( data, index ) => (
              <BlogCard key={ index } { ...data } />
            ) ) }
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col  items-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5 text-center">
          Trusted by the world's largest companies
        </h2>
        <div className="flex flex-wrap justify-center space-x-0 sm:space-x-4 lg:space-x-8 mb-5">
          { companies.map( ( company ) => (
            <div key={ company.name } className="flex items-center mb-4 gap-5 sm:mb-0">
              <img
                src={ company.logo }
                alt={ company.name }
                className="h-16 w-32 sm:h-20 sm:w-40 object-cover"
              />
            </div>
          ) ) }
        </div>
        <p className="text-center mb-5">Need a personalized package for your business?</p>
        <button className="bg-red-500 text-white py-2 px-4 rounded-3xl">
          Request a Quote
        </button>
      </div>


      <Footer />
    </div>
  );
}

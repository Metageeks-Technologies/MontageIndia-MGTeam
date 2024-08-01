import Footer from "@/components/Footer";
import BlogCard from "@/components/Home/blogCard";
import CategoryCard from "@/components/Home/categoryCard";
import CardSlider from "@/components/Home/collectionCard";
import CompaniesCard from "@/components/Home/companyCard";
import ImageGallery from "@/components/Home/homeImage";
import WeeklyCard from "@/components/Home/weeklyCard";
import { IoIosSearch } from "react-icons/io";

export default function Home() {
  return (
    <div className="main  ">
      {/* Image Routes Banner Section */}
      <div
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage:
            "url(https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=1280&h=720&fm=webp)",
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-bold">
            Unleash your creativity with unrivaled images
          </h1>
          <p className="mt-4 text-xl">
            Add wonder to your stories with 450M+ photos, vectors,
            illustrations, and editorial images.
          </p>
          <div className="mt-6 flex space-x-4">
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
        <div className="py-10 mx-24">
          <h1 className="text-5xl font-semibold">See what’s trending</h1>
          <ImageGallery />
        </div>
      </div>

      <div className="px-24 py-12">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-semibold mb-4 ">
            Explore fresh collections
          </h2>
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more Image
          </button>
        </div>
        <CardSlider />
      </div>

      <div>
        <WeeklyCard />
      </div>

      <div className="mx-24 py-10">
        <h2 className="text-3xl font-bold mb-6">
          Browse by category to find your perfect visual
        </h2>
        <CategoryCard />
        <div className="mt-8 flex justify-center ">
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more
          </button>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="mx-24 py-10">
          <h2 className="text-3xl font-bold mb-6">
            Tips and tricks from our blog
          </h2>

          <BlogCard />
        </div>
      </div>

      <CompaniesCard />
      <Footer />
    </div>
  );
}

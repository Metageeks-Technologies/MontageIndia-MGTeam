
import ImageGallery from "@/components/Home/homeImage";
import { IoIosSearch } from "react-icons/io";




export default function Home() {
  return (
    <div className="main ml-20">
      <div
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage:
            "url(https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=1280&h=720&fm=webp)",
        }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-600 opacity-60"></div> */}
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

      <div className="p-10 px-24">
          <h1 className="text-3xl font-bold">Explore images that ignite your creativity</h1>
          <div className="flex justify-between">
            <div className="flex gap-3 mt-5 items-center">
              <img src="https://images.ctfassets.net/hrltx12pl8hq/2ppk3Ug2z6oFMZY5z8WXnx/75af41f13939954c93de0ff8c1972612/shutterstock_1922207966.jpg?fit=fill&w=120&h=120&fm=webp" alt="photo" 
              className="object-cover rounded-md h-28 w-28"
              />
              <h1 className="font-semibold">Photos</h1>
            </div>
            <div className="flex gap-3 mt-5 items-center">
              <img src="https://images.ctfassets.net/hrltx12pl8hq/1qoVFqqABKxtFRMkUh0v6l/6a9bbdc723ac373f4e44400de87997b2/shutterstock_1734177410__1_.jpg?fit=fill&w=120&h=120&fm=webp" alt="photo" 
              className="object-cover rounded-md h-28 w-28"
              />
              <h1 className="font-semibold">vector</h1>
            </div>
            <div className="flex gap-3 mt-5 items-center">
              <img src="https://images.ctfassets.net/hrltx12pl8hq/go6z2gBaTMDvTrtoOipOw/3b9d21ff7003ca392a2daeb569d629fc/shutterstock_1802211250.jpg?fit=fill&w=120&h=120&fm=webp" alt="photo" 
              className="object-cover rounded-md h-28 w-28"
              />
              <h1 className="font-semibold">IIIustrations</h1>
            </div>
            <div className="flex gap-3 mt-5 items-center">
              <img src="https://images.ctfassets.net/hrltx12pl8hq/ss2daMHu3XewLBroGgbtp/6cf4fbe1fc297c20ee6cd2bb303e12a1/shutterstock_2390735237.jpg?fit=fill&w=120&h=120&fm=webp" alt="photo" 
              className="object-cover rounded-md h-28 w-28"
              />
              <h1 className="font-semibold">AI Image Generator</h1>
            </div>
          </div>
      </div>

      <div className="bg-[#eeeeee]">
        <div className="p-10 px-24">
          <h1 className="text-5xl font-semibold">See what’s trending</h1>
          <ImageGallery/>
        </div>
          
      </div>
    </div>
  );
}

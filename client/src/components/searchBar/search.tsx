import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  setAudioData,
  setAudioPage,
  setImagePage,
  setVideoPage,
} from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ImCross } from "react-icons/im";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import Filter from "./filtersidebar";
import { MdClear } from "react-icons/md";
import { CiCamera, CiMusicNote1, CiVideoOn } from "react-icons/ci";
import { FaVideo } from "react-icons/fa";

const Searchbar = () => {
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState("All Image");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRenderTerm = searchParams.get("searchTerm");
  const [searchTerm, setSearchTerm] = useState(searchRenderTerm || "");
  const mediaType = searchParams.get("mediaType") || "image";
  const category = searchParams.get("category");
  const terms = useAppSelector((state) => state.product.relatedKeyword);
  console.log("path", pathname);
  const isVideoPage = pathname.includes("/video");
  const isAudioPage = pathname.includes("/audio");
  const isImagePage = pathname.includes("/image");

  useEffect(() => {
    if (pathname.includes("/search/video")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "Editorial Video"
          : "Video"
      );
    } else if (pathname.includes("/search/audio")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "Editorial Audio"
          : "Audio"
      );
    } else if (pathname.includes("/search/image")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "Editorial Image"
          : "All Image"
      );
    } else if (pathname.includes("/video")) {
      setSelectedOption("Video");
    } else if (pathname.includes("/audio")) {
      setSelectedOption("Audio");
    } else if (pathname.includes("/image")) {
      setSelectedOption("Image");
    }
  }, [pathname, category, searchRenderTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getData();
    }
  };

  const getData = () => {
    // Redirect based on the selected option
    let pathname = "/search/image";

    let query: { searchTerm: string; mediaType: string; category?: string } = {
      searchTerm,
      mediaType: "image",
    };

    if (selectedOption.includes("Video")) {
      pathname = "/search/video";
      query.mediaType = "video";
    } else if (selectedOption.includes("Audio")) {
      pathname = "/search/audio";
      query.mediaType = "audio";
    }

    if (selectedOption.includes("Editorial")) {
      query = { ...query, category: "editor choice" };
    }
    console.log(pathname, "query");
    router.push(`${pathname}?${new URLSearchParams(query).toString()}`);
    // fetchData(1);
    dispatch(setVideoPage(1));
    dispatch(setAudioPage(1));
    dispatch(setImagePage(1));
  };
  const handleClear = () => {
    setSearchTerm("");
    const params = new URLSearchParams(window.location.search);

    params.delete("searchTerm");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    // console.log(newUrl, "newUrl");
    router.replace(newUrl);
  };
  const handleCategoryClick = (category: string) => {
    setSearchTerm(category);

    const currentCategories = searchParams.get("searchTerm");


    const categoriesArray = currentCategories
      ? currentCategories.split(",").map((cat) => cat.trim())
      : [];

    let updatedCategory;
    if (categoriesArray.includes(category)) {
      updatedCategory = categoriesArray.filter((cat) => cat !== category);
    } else {
      updatedCategory = [...categoriesArray, category];
    }

    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    if (updatedCategory.length > 0) {
      updatedSearchParams.set("searchTerm", updatedCategory.join(","));
    } else {
      updatedSearchParams.delete("searchTerm");
    }

    const newUrl = `${
      window.location.pathname
    }?${updatedSearchParams.toString()}`;

    window.history.pushState({}, "", newUrl);
  };

  const isSearchPage = pathname.includes("/search") || false;

  console.log(isSearchPage, "isSearchpage");

  return (
    <div className="sticky top-0 z-40">
      <div className="transition-all duration-300 bg-white shadow-md py-4 border-t-1">
        <div className="flex relative justify-between items-center gap-4 bg-gray-100 border border-gray-300 rounded-md mx-4 px-4 lg:mx-4 xl:mx-16 md:mx-4">
          <div className="flex flex-row w-full gap-2">
            {/* Desktop view */}
            <div className="hidden md:flex w-full items-center ">
              <select
                className="bg-gray-100 lg:w-36 md:w-24 w-32 outline-none cursor-pointer text-gray-600 lg:text-sm md:text-xs text-xs  rounded-lg p-2.5"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {isImagePage && (
                  <option className="cursor-pointer" value="image">
                    Image
                  </option>
                )}
                {isVideoPage && (
                  <option className="cursor-pointer" value="video">
                    Video
                  </option>
                )}
                {isAudioPage && (
                  <option className="cursor-pointer" value="audio">
                    Audio
                  </option>
                )}
                {!isImagePage && (
                  <option className="cursor-pointer" value="image">
                    Image
                  </option>
                )}
                {!isVideoPage && (
                  <option className="cursor-pointer" value="video">
                    Video
                  </option>
                )}
                {!isAudioPage && (
                  <option className="cursor-pointer" value="audio">
                    Audio
                  </option>
                )}
                <option className="cursor-pointer lg:text-medium sm:text-" value="editorialImage">
                  Editorial Image
                </option>
                <option className="cursor-pointer" value="editorialAudio">
                  Editorial Audio
                </option>
                <option className="cursor-pointer" value="editorialVideo">
                  Editorial Video
                </option>
              </select>

              <img src="/asset/Rectangle 15.png" className="mx-2" alt="" />

              <div className="relative sm:w-full w-[60%] ">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-2 px-4 outline-none bg-gray-100 rounded-md"
                />
                {searchTerm && (
                  <span
                    onClick={handleClear}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    <ImCross />
                  </span>
                )}
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden flex items-center w-full">
              <select
                className="bg-gray-100 w-24 outline-none cursor-pointer text-gray-600 text-xs rounded-l-md"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="Image">
                  Image
                  <CiCamera />
                </option>
                <option value="Audio">
                  <CiMusicNote1 />
                  Video
                </option>
                <option value="Video">
                  <FaVideo />
                  Audio
                </option>
              </select>

              <input
                type="text"
                placeholder="Search for Image"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-2 px-4 outline-none bg-gray-100"
              />
              {searchTerm && (
                <span
                  onClick={handleClear}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer "
                >
                  <ImCross />
                </span>
              )}
            </div>
          </div>

          <div
            onClick={getData}
            className="cursor-pointer absolute top-0 bottom-0 right-0 flex justify-center items-center w-12 bg-[#8D529C] rounded-r-md"
          >
            <IoSearchOutline className="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      {isSearchPage && (
        <div className="border-t bg-[#FAFAFA] flex flex-wrap items-center gap-5 justify-between border-gray-300 w-full">
          <div className="flex py-1 gap-4 items-center justify-between w-[92%] flex-col md:flex-row mx-auto">
            <div className="flex flex-row gap-3 justify-between md:w-fit">
              {/* <Filter /> */}
              <div className="sm:block hidden">
              <div className="md:hidden">
                <button
                  onClick={handleClear}
                  disabled={!searchRenderTerm}
                  className={`${
                    searchRenderTerm
                      ? "bg-red-500 cursor-pointer"
                      : "bg-red-500 cursor-not-allowed bg-opacity-50"
                  } py-[6px] text-sm text-white border flex flex-row ml-4 items-center gap-2 border-gray-300 px-3 rounded-md`}
                >
                  Clear <MdClear />
                </button>
              </div>
            </div>
            {terms && terms.length > 0 && (
              <div  className="font-bold w-44 sm:block hidden whitespace-nowrap text-md text-start">
                Related Searches :
              </div>
            )}
            </div>
            <div className="rounded-md flex lg:w-full sm:w-full w-full flex-row scrollbar-hide overflow-x-scroll items-center text-center justify-start">
              {terms.map((category) => {
                return (
                  <button 
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex text-sm items-center whitespace-nowrap m-2  hover:bg-slate-400 px-3 py-[6px] sm:px-4 sm:py-2 border border-gray-300 rounded-md capitalize backdrop-blur-sm hover:bg-opacity-30 transition duration-300 ${
                      searchRenderTerm === category
                        ? "bg-red-500 text-white"
                        : "bg-transparent"
                    }`}
                  >
                    <IoIosSearch className="h-5 w-5 mr-2" />
                    {category}
                  </button>
                );
              })}
            </div>
            {searchRenderTerm && (
              <div className=" hidden md:block">
                <button
                  onClick={handleClear}
                  className={`${
                    searchRenderTerm
                      ? "bg-red-500 cursor-pointer"
                      : "bg-red-500 cursor-not-allowed bg-opacity-50"
                  } py-2 text-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md`}
                >
                  Clear <MdClear />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;

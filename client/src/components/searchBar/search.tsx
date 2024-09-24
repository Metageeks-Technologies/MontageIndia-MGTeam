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
  const [selectedOption, setSelectedOption] = useState("image");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRenderTerm = searchParams.get("searchTerm");
  const [searchTerm, setSearchTerm] = useState(searchRenderTerm || "");
  const mediaType = searchParams.get("mediaType") || "image";
  const category = searchParams.get("category");
  const terms = useAppSelector((state) => state.product.relatedKeyword);
  console.log("path", pathname);

  useEffect(() => {
    if ( searchRenderTerm ) {
      setSearchTerm( searchRenderTerm );
    }
    if (pathname.includes("/search/video")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "editorialVideo"
          : "video"
      );
    } else if (pathname.includes("/search/audio")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "editorialAudio"
          : "audio"
      );
    } else if (pathname.includes("/search/image")) {
      setSelectedOption(
        category && category.includes("editor choice")
          ? "editorialImage"
          : "image"
      );
    } else if (pathname.includes("/video")) {
      setSelectedOption("video");
    } else if (pathname.includes("/audio")) {
      setSelectedOption("audio");
    } else if (pathname.includes("/image")) {
      setSelectedOption("image");
    }

    console.log("selectedOption", selectedOption);
  }, [pathname, category, searchRenderTerm] );
  
 

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getData();
    }
  };

  const getData = () => {
    // Redirect based on the selected option
    let pathname = "/search/image";
    console.log("selectedOption", selectedOption);

    let query: { searchTerm: string; mediaType: string; category?: string } = {
      searchTerm,
      mediaType: "image",
    };
    
    if (selectedOption.includes("video")) {
      pathname = "/search/video";
      query.mediaType = "video";
    } else if (selectedOption.includes("audio")) {
      pathname = "/search/audio";
      query.mediaType = "audio";
    }
    if(selectedOption.includes("editorialVideo")){
      pathname = "/search/video";
      query.mediaType = "video";
      query.category = "editor choice";
    }
    if(selectedOption.includes("editorialAudio")){
      pathname = "/search/audio";
      query.mediaType = "audio";
      query.category = "editor choice";
    }
    if(selectedOption.includes("editorialImage")){
      pathname = "/search/image";
      query.mediaType = "image";
      query.category = "editor choice";
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

  const handleCategoryClick = ( category: string ) => {
    setSearchTerm( category );

    const updatedSearchParams = new URLSearchParams( searchParams.toString() );
    updatedSearchParams.set( "searchTerm", category );

    const newUrl = `${window.location.pathname}?${updatedSearchParams.toString()}`;

    window.history.pushState( {}, "", newUrl );
  };

  const isSearchPage = pathname.includes("/search") || false;

  // console.log(isSearchPage, "isSearchpage");

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
                {selectedOption==="image" && (
                  <option className="cursor-pointer bg-gray-500" value="image">
                    Image
                  </option>
                )}
                {selectedOption==="video" && (
                  <option className="cursor-pointer bg-gray-500" value="video">
                    Video
                  </option>
                )}
                {selectedOption==="audio" && (
                  <option className="cursor-pointer bg-gray-500" value="audio">
                    Audio
                  </option>
                )}
                {
                  selectedOption==="editorialImage" && (
                    <option className="cursor-pointer bg-gray-500" value="editorialImage">
                      Editorial Image
                    </option>
                  )
                }
                {

                  selectedOption==="editorialVideo" && (
                  <option className="cursor bg-gray-500" value="editorialVideo">
                    Editorial Video
                  </option>
                )}
                 {
                  selectedOption==="editorialAudio" && (
                  <option className="cursor bg-gray-500" value="editorialAudio">
                    Editorial Audio
                  </option>
                )
                 }
                {selectedOption!="image" && (
                  <option className="cursor-pointer" value="image">
                    Image
                  </option>
                )}
                {selectedOption!="video" && (
                  <option className="cursor-pointer" value="video">
                    Video
                  </option>
                )}
                {selectedOption!="audio" && (
                  <option className="cursor-pointer" value="audio">
                    Audio
                  </option>
                )}
                {
                  selectedOption!="editorialImage" && (
                  <option className="cursor-pointer" value="editorialImage">
                    Editorial Image
                  </option>
                )
                }
                {
                  selectedOption!="editorialVideo" && (
                  <option className="cursor-pointer" value="editorialVideo">
                    Editorial Video
                  </option>
                )
                }
                {
                  selectedOption!="editorialAudio" && (
                  <option className="cursor-pointer" value="editorialAudio">
                    Editorial Audio
                  </option>
                )
                }
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
                {
                  selectedOption==="image" && (
                    <option value="Image">
                      Image
                      <CiCamera />
                    </option>
                  )
                }
                {
                  selectedOption==="video" && (
                    <option value="Video">
                      Video
                      <FaVideo />
                    </option>
                  )
                }
                {
                  selectedOption==="audio" && (
                    <option value="Audio">
                      Audio
                      <CiMusicNote1 />
                    </option>
                  )
                }
               {
                selectedOption!="image" && (
                  <option value="Image">
                    Image
                    <CiCamera />
                  </option>
                )
               } 
               {
                selectedOption!="video" && (
                  <option value="Video">
                    Video
                    <FaVideo />
                  </option>
                )
               }
               {
                selectedOption!="audio" && (
                  <option value="Audio">
                    Audio
                    <CiMusicNote1 />
                  </option>
                )
               }
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
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer "
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

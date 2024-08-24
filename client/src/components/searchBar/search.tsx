import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { setVideoPage } from '@/app/redux/feature/product/slice';
import { getVideo } from '@/app/redux/feature/product/video/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ImCross } from 'react-icons/im';
import { IoSearchOutline } from 'react-icons/io5';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname(); 
  const [selectedOption, setSelectedOption] = useState("All Image");
  const dispatch = useAppDispatch();
  const router=useRouter()
  const searchParams = useSearchParams();
  const mediaType = searchParams.get('mediaType') || 'image'; 
  const category = searchParams.get('category');

  useEffect(() => {
    if (pathname.includes('/video')) {
      setSelectedOption(category === 'editorchoice' ? 'Editorial Video' : 'Video');
    } else if (pathname.includes('/audio')) {
      setSelectedOption(category === 'editorchoice' ? 'Editorial Audio' : 'Audio');
    } else if (pathname.includes('/image')) {
      setSelectedOption(category === 'editorchoice' ? 'Editorial Image' : 'All Image');
    }
  }, [pathname, category]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getData();
    }
  };

  const getData = () => {

    // Redirect based on the selected option
    let pathname = '/image';
    let query: { searchTerm: string; mediaType: string; category?: string } = { searchTerm, mediaType: 'image' };

    if (selectedOption.includes('Video')) {
      pathname = '/video';
      query.mediaType = 'video';
    } else if (selectedOption.includes('Audio')) {
      pathname = '/audio';
      query.mediaType = 'audio';
    }

    if (selectedOption.includes('Editorial')) {
      query = { ...query, category: 'editorchoice' };
    }
    router.push(`${pathname}?${new URLSearchParams(query).toString()}`);
    fetchData(1);

  };
  const handleClear = () => {
    setSearchTerm(''); // Clear the search term
    dispatch(setVideoPage(1));
    getVideo(dispatch, {
      page: 1,
      mediaType: [mediaType],
      productsPerPage: "6",
      category: category ? ["editor choice"] : "",
    });
  };

  const fetchData = (page: number) => {
    if (!searchTerm.trim()) {
        console.log("dsd",searchTerm)
      getVideo(dispatch, {
        page,
        mediaType: [mediaType],
        category: category ? ["editor choice"] : "",
        productsPerPage: "6",
      });
    } else {
      console.log("casa",searchTerm)

      getVideo(dispatch, {
        page,
        mediaType: [mediaType],
        searchTerm,
        category: category ? ["editor choice"] : "",
        productsPerPage: "6",
      });
    }
  };

  return (
    <div className="flex relative my-6 justify-between items-center flex-row gap-4 bg-gray-100 border border-gray-300 rounded-md w-[90%] m-auto">
      <div className="flex flex-row px-3 w-full gap-5"> 
          <select
                className=" bg-gray-100  outline-none cursor-pointer   text-gray-600 text-sm rounded-lg    space-y-3 p-2.5  "
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option>All Image</option>
                <option>Audio</option>
                <option>Video</option>
                <option>Editorial Image</option>
                <option>Editorial Audio</option>
                <option>Editorial Video</option>
              </select>
        <img src="/asset/Rectangle 15.png" className="hidden py-2 md:block" alt="" />
        <div className="lg:w-[80%] sm:w-[90%] w-[90%] md:w-[65%] py-1 gap-2 md:gap-0 items-center justify-center flex">
          <input
            type="text"
            placeholder="Search for Videos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow py-1 md:px-4 outline-none bg-gray-100 rounded-md"
          />
          <span
            onClick={handleClear}
            className={searchTerm ? "block text-gray-400 cursor-pointer" : "hidden"}
          >
            <ImCross />
          </span>
        </div>
      </div>
      <div onClick={getData} className="cursor-pointer absolute -top-[1px] -bottom-[1px] -right-[1px] flex justify-center m-auto w-12 rounded-r-md bg-[#8D529C]">
        <IoSearchOutline className="h-full text-white w-6" />
      </div>
    </div>
  );
};

export default Searchbar;

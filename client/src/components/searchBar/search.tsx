import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/redux/hooks';
import {setAudioData, setAudioPage, setImagePage, setVideoPage} from '@/app/redux/feature/product/slice';
import {getVideo} from '@/app/redux/feature/product/video/api';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ImCross} from 'react-icons/im';
import {IoSearchOutline} from 'react-icons/io5';
import {IoIosSearch} from 'react-icons/io';
import Filter from './filtersidebar';
import {MdClear} from 'react-icons/md';
import {CiCamera, CiMusicNote1, CiVideoOn} from 'react-icons/ci';
import {FaVideo} from 'react-icons/fa';

const Searchbar = () => {
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState( "All Image" );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRenderTerm = searchParams.get( 'searchTerm' );
  const [searchTerm, setSearchTerm] = useState( searchRenderTerm || "" );
  const mediaType = searchParams.get( 'mediaType' ) || 'image';
  const category = searchParams.get( 'category' );
  const terms = useAppSelector( ( state ) => state.product.relatedKeyword );

  useEffect( () => {
    if ( pathname.includes( '/video' ) ) {
      setSelectedOption( category && category.includes( 'editor choice' ) ? 'Editorial Video' : 'Video' );
    } else if ( pathname.includes( '/audio' ) ) {
      setSelectedOption( category && category.includes( 'editor choice' ) ? 'Editorial Audio' : 'Audio' );
    } else if ( pathname.includes( '/image' ) ) {
      setSelectedOption( category && category.includes( 'editor choice' ) ? 'Editorial Image' : 'All Image' );
    }
  }, [pathname, category, searchRenderTerm] );

  const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
    if ( e.key === 'Enter' ) {
      getData();
    }
  };

  const getData = () => {
    // Redirect based on the selected option
    let pathname = '/image';
    let query: {searchTerm: string; mediaType: string; category?: string;} = {searchTerm, mediaType: 'image'};

    if ( selectedOption.includes( 'Video' ) ) {
      pathname = '/video';
      query.mediaType = 'video';
    } else if ( selectedOption.includes( 'Audio' ) ) {
      pathname = '/audio';
      query.mediaType = 'audio';
    }

    if ( selectedOption.includes( 'Editorial' ) ) {
      query = {...query, category: 'editor choice'};
    }
    router.push( `${pathname}?${new URLSearchParams( query ).toString()}` );
    // fetchData(1);
    dispatch( setVideoPage( 1 ) );
    dispatch( setAudioPage( 1 ) );
    dispatch( setImagePage( 1 ) );

  };
  const handleClear = () => {
    setSearchTerm( '' );
    const params = new URLSearchParams( window.location.search );

    params.delete( 'searchTerm' );
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace( newUrl );
  };
  const handleCategoryClick = ( category: string ) => {
    setSearchTerm( category );

    const currentCategories = searchParams.get( 'searchTerm' );

    const categoriesArray = currentCategories
      ? currentCategories.split( ',' ).map( cat => cat.trim() )
      : [];

    let updatedCategory;
    if ( categoriesArray.includes( category ) ) {
      updatedCategory = categoriesArray.filter( cat => cat !== category );
    } else {
      updatedCategory = [...categoriesArray, category];
    }

    const updatedSearchParams = new URLSearchParams( searchParams.toString() );
    if ( updatedCategory.length > 0 ) {
      updatedSearchParams.set( 'searchTerm', updatedCategory.join( ',' ) );
    } else {
      updatedSearchParams.delete( 'searchTerm' );
    }

    const newUrl = `${window.location.pathname}?${updatedSearchParams.toString()}`;

    window.history.pushState( {}, '', newUrl );
  };


  return (
    <div className='sticky top-0 z-10'>
      <div className='transition-all duration-300 bg-white shadow-md py-4 border-t-1'>
        <div className="flex relative justify-between items-center gap-4 bg-gray-100 border border-gray-300 rounded-md mx-6 px-4 lg:mx-4 xl:mx-24 md:mx-4">
          <div className="flex flex-row w-full gap-2">
            {/* Desktop view */}
            <div className="hidden md:flex w-full items-center">
              <select
                className="bg-gray-100 w-40 outline-none cursor-pointer text-gray-600 text-sm rounded-lg p-2.5"
                value={selectedOption}
                onChange={( e ) => setSelectedOption( e.target.value )}
              >
                <option>All Image</option>
                <option>Audio</option>
                <option>Video</option>
                <option>Editorial Image</option>
                <option>Editorial Audio</option>
                <option>Editorial Video</option>
              </select>

              <img src="/asset/Rectangle 15.png" className="mx-2" alt="" />

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={( e ) => setSearchTerm( e.target.value )}
                  onKeyDown={handleKeyDown}
                  className="w-full py-2 px-4 outline-none bg-gray-100 rounded-md"
                />
                {searchTerm && (
                  <span onClick={handleClear} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                    <ImCross />
                  </span>
                )}
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden flex items-center w-full">
              <select
                className="bg-gray-100 w-12 outline-none cursor-pointer text-gray-600 text-sm rounded-l-md"
                value={selectedOption}
                onChange={( e ) => setSelectedOption( e.target.value )}
              >
                <option value="All Image"><CiCamera /></option>
                <option value="Audio"><CiMusicNote1 /></option>
                <option value="Video"><FaVideo /></option>
              </select>

              <input
                type="text"
                placeholder="Search for Image"
                value={searchTerm}
                onChange={( e ) => setSearchTerm( e.target.value )}
                onKeyDown={handleKeyDown}
                className="w-full py-2 px-4 outline-none bg-gray-100"
              />
            </div>
          </div>

          <div onClick={getData} className="cursor-pointer absolute top-0 bottom-0 right-0 flex justify-center items-center w-12 bg-[#8D529C] rounded-r-md">
            <IoSearchOutline className="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      {( pathname.match( /^\/(video|audio|image)\/[^/]+$/ ) ? null : (
        <div className="bg-gray80 border-t flex flex-wrap items-center gap-5 justify-between border-gray-300 w-full">
          <div className="flex py-3 items-center flex-col md:flex-row w-[90%] justify-between lg:mx-4 xl:mx-24 md:mx-4">
            <div className="flex flex-row gap-3 justify-between w-full md:w-fit">
              {/* <Filter /> */}
              <div className="md:hidden">
                <button
                  onClick={handleClear}
                  disabled={!searchRenderTerm}
                  className={`${searchRenderTerm
                    ? "bg-red-500 cursor-pointer"
                    : "bg-red-500 cursor-not-allowed bg-opacity-50"
                    } py-2 text-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md`}
                >
                  Clear <MdClear />
                </button>
              </div>
            </div>
            <div className=" rounded-md flex flex-row scrollbar-hide overflow-x-scroll items-center text-center w-[90%] bg-gray80 justify-start">
              {terms.map( ( category ) => {
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick( category )}
                    className={`flex items-center whitespace-nowrap m-3 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md capitalize backdrop-blur-sm hover:bg-opacity-30 transition duration-300 ${searchRenderTerm === category
                      ? "bg-red-500 text-white"
                      : "bg-transparent"
                      }`}
                  >
                    <IoIosSearch className="h-5 w-5 mr-2" />
                    {category}
                  </button>
                );
              } )}
            </div>
            <div className=' hidden md:block lg:-mr-16 xl:mr-8 md:-mr-10'>
              <button
                onClick={handleClear}
                disabled={!searchRenderTerm}
                className={`${searchRenderTerm
                  ? "bg-red-500 cursor-pointer"
                  : "bg-red-500 cursor-not-allowed bg-opacity-50"
                  } py-2 text-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md`}
              >
                Clear <MdClear />
              </button>
            </div>
          </div>
        </div>
      ) )}
    </div>

  );
};

export default Searchbar;

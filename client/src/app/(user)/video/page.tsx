"use client";
import {setVideoPage} from "@/app/redux/feature/product/slice";
import {getVideo} from "@/app/redux/feature/product/video/api";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import Searchbar from "@/components/searchBar/search";
import FAQ from "@/components/Video/fag";
import Trending from "@/components/Video/trendingVideos";
import {Button, Pagination, Spinner} from "@nextui-org/react";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {IoIosSearch} from "react-icons/io";
import {clearKeywords} from "@/app/redux/feature/product/api";
import Filter from "@/components/searchBar/filtersidebar";
import {BsFilterLeft} from "react-icons/bs";
import Banner from "@/components/Banner";

const filterOptions = {
  sortBy: ['Most Popular', 'Newest', 'Oldest'], 
  orientation: ['Landscape', 'Portrait'], 
  more: [
    {label: 'Resolution', options: ['FHD', 'HD']},
  ],
  videoLength: 0 , // input
  frameRate : ["30Hz","24Hz"]
}; 

const Page = () => {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get( "searchTerm" ) || "";
  const category = searchParams.get( "category" );
  const categoryParam = category ? ["editor choice"] : "";
  const [loading, setloading] = useState( false );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    videoData: product,
    videoPage,
    totalVideoData,
    totalVideoNumOfPage,
  } = useAppSelector( ( state ) => state.product );

  const toggleFilter = () => {
    setIsFilterOpen( !isFilterOpen );
  };

  const handlePageChange = ( page: number ) => {
    dispatch( setVideoPage( page ) );
  };

  const handleNextPage = () => {
    handlePageChange( videoPage === totalVideoNumOfPage ? 1 : videoPage + 1 );
  };

  const handlePrevPage = () => {
    handlePageChange( videoPage === 1 ? totalVideoNumOfPage : videoPage - 1 );
  };

  const fetchData = async ( page: number ) => {
    setloading( true );

    // setLoading(true);
    const response = await getVideo( dispatch, {
      page,
      mediaType: ["video"],
      searchTerm,
      category: categoryParam,
      productsPerPage: "9",
    } );
    setloading( false );
  };

  useEffect( () => {
    fetchData( videoPage );
    return () => {
      clearKeywords( dispatch );
    };
  }, [videoPage, searchParams] );

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const handleFilterChange = ( filterType: string, value: string | number ) => {
    console.log( `Filter changed: ${filterType} = ${value}` );
    // Here you can update your application state or make API calls with the new filter params
    
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <Banner/>
      <div className="flex flex-1">
        <Filter isOpen={isFilterOpen} onToggle={toggleFilter} filterOptions={filterOptions} onFilterChange={handleFilterChange} />
        <div className={`flex-1 transition-all duration-300 ease-in-out `}>
          <div className="p-4">
            <button
              className="py-2 text-gray-800 bg-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md mb-4"
              onClick={toggleFilter}
            >
              Filters <BsFilterLeft />
            </button>
            <div className="main items-center">
              {/* Trending Videos */}
              <div className="bg-[#eeeeee]">
                <div className={`py-10 lg:mx-4 ${!isFilterOpen ? 'xl:mx-24 md:mx-4' : 'ml-0'} `}>
                  <h1 className="text-2xl font-bold text-start">
                    Today's Trending Videos
                  </h1>
                  <h4 className="text-lg text-neutral-700">
                    {totalVideoData} Product stock Photos and High-res Pictures
                  </h4>
                  <div className="mx-auto mt-4">
                    {loading ? (
                      <div className="justify-center text-center m-auto">
                        <Spinner label="Loading..." color="danger" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5 lg:border">
                        {product.length > 0 ? (
                          product.map( ( data ) => (
                            <Trending key={data._id} data={data} />
                          ) )
                        ) : (
                          <p>No videos found.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalVideoNumOfPage > 1 && (
                <div className="flex justify-center items-center gap-4 my-4">
                  <Button
                    size="sm"
                    type="button"
                    disabled={videoPage === 1}
                    variant="flat"
                    className={`${videoPage === 1
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-webred"
                      } bg-webred text-white rounded-full font-bold`}
                    onPress={handlePrevPage}
                  >
                    Prev
                  </Button>
                  <Pagination
                    color="success"
                    classNames={{
                      item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
                      cursor:
                        "bg-webred hover:bg-red text-white rounded-full font-bold",
                    }}
                    total={totalVideoNumOfPage}
                    page={videoPage}
                    onChange={handlePageChange}
                    initialPage={1}
                  />
                  <p className="text-cart">of {totalVideoNumOfPage}</p>
                  <Button
                    type="button"
                    size="sm"
                    disabled={videoPage === totalVideoNumOfPage}
                    variant="flat"
                    className={`${videoPage === totalVideoNumOfPage
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-webred"
                      } bg-webred text-white rounded-full font-bold`}
                    onPress={handleNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;

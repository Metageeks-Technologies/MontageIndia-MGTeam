"use client";
import React, {useEffect, useState} from "react";
import {Button, Pagination, Spinner} from "@nextui-org/react";
import Waveform from "@/components/Home/AudioWaveForm";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {getAudio} from "@/app/redux/feature/product/audio/api";
import {setAudioPage} from "@/app/redux/feature/product/slice";
import {clearKeywords} from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";
import {useSearchParams} from "next/navigation";
import Filter from "@/components/searchBar/filtersidebar";
import Footer from "@/components/Footer";
import {BsFilterLeft} from "react-icons/bs";
import Banner from "@/components/Banner";

const Page = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get( "searchTerm" ) || "";
  const category = searchParams.get( "category" );
  const categoryParam = category ? ["editor choice"] : "";
  const [loading, setLoading] = useState( false );
  const [isFilterOpen, setIsFilterOpen] = useState( false );

  const filterOptions = {
    sortBy: ['Most Popular', 'Newest', 'Oldest'],
    audioLength: 0,
    bitRate: 0
  };

  const {audioData, page, totalNumOfPage, totalAudioData} = useAppSelector(
    ( state ) => state.product
  );

  const fetchData = async ( page: number ) => {
    setLoading( true );
    await getAudio( dispatch, {
      page: page,
      productsPerPage: 8,
      mediaType: ["audio"],
      searchTerm,
      category: categoryParam,
    } );
    setLoading( false );
  };

  useEffect( () => {
    fetchData( page );
    return () => {
      clearKeywords( dispatch );
    };
  }, [page, searchParams] );

  const handlePageChange = ( page: number ) => {
    dispatch( setAudioPage( page ) );
  };

  const handleNextPage = () => {
    handlePageChange( page === totalNumOfPage ? 1 : page + 1 );
  };

  const handlePrevPage = () => {
    handlePageChange( page === 1 ? totalNumOfPage : page - 1 );
  };

  const toggleFilter = () => {
    setIsFilterOpen( !isFilterOpen );
  };

  const handleFilterChange = ( filterType: string, value: string | number ) => {
    console.log( `Filter changed: ${filterType} = ${value}` );
    // Here you can update your application state or make API calls with the new filter params
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <Banner/>
      <div className="flex flex-1 bg-pageBg-light">
        <Filter isOpen={isFilterOpen} onToggle={toggleFilter} filterOptions={filterOptions} onFilterChange={handleFilterChange} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <div className="p-4">
            <button
              className=" py-2 text-gray-800 bg-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md mb-4"
              onClick={toggleFilter}
            >
              Filters <BsFilterLeft />
            </button>
            <div className="main">
              <div className="py-10 px-4 md:px-8 lg:px-12">
                {totalAudioData > 0 && (
                  <h4 className="text-lg text-neutral-700 mb-4">
                    {totalAudioData} Audio Files
                  </h4>
                )}

                <div className="overflow-y-auto mt-2">
                  {loading ? (
                    <div className="h-64 flex justify-center items-center">
                      <Spinner label="Loading..." color="danger" />
                    </div>
                  ) : (
                    <>
                      {audioData.length > 0 ? (
                        audioData.map( ( product, index ) => (
                          <Waveform key={index} product={product} />
                        ) )
                      ) : (
                        <p>No Audio found.</p>
                      )}
                    </>
                  )}
                </div>

                {totalNumOfPage > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-4 my-10">
                    <Button
                      size="sm"
                      type="button"
                      disabled={page === 1}
                      variant="flat"
                      className={`${page === 1 ? "opacity-70 cursor-not-allowed" : "hover:bg-webred"
                        } bg-webred text-white rounded-full font-bold`}
                      onPress={handlePrevPage}
                    >
                      Prev
                    </Button>
                    <Pagination
                      color="success"
                      classNames={{
                        item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
                        cursor: "bg-webred hover:bg-red text-white rounded-full font-bold",
                      }}
                      total={totalNumOfPage}
                      page={page}
                      onChange={handlePageChange}
                      initialPage={1}
                    />
                    <p className="text-cart">of {totalNumOfPage}</p>
                    <Button
                      type="button"
                      size="sm"
                      disabled={page === totalNumOfPage}
                      variant="flat"
                      className={`${page === totalNumOfPage
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
      </div>
      <Footer />
    </div>
  );
};

export default Page;
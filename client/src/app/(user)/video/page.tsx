"use client"
import React, {useState} from 'react';
import {Button, Pagination, Spinner} from '@nextui-org/react'; // Assuming you're using NextUI
import {BsFilterLeft} from 'react-icons/bs';
import Searchbar from '@/components/searchBar/search';
import Filter from '@/components/searchBar/filtersidebar';
import Trending from '@/components/Video/trendingVideos';
import Footer from '@/components/Footer';


const filterOptions = {
  sortBy: ['Popular', 'Most relevant'],
  premiumImages: [
    {label: 'License', options: ['Standard', 'Extended']},
    {label: 'Usage', options: ['Commercial', 'Editorial']},
  ],
  orientation: ['Horizontal', 'Vertical'],
  color: [
    {label: 'Color', options: ['Red', 'Blue', 'Green', 'Yellow']},
    {label: 'Tone', options: ['Vibrant', 'Muted', 'Pastel']},
  ],
  people: [
    {label: 'Age', options: ['Children', 'Teenagers', 'Adults', 'Seniors']},
    {label: 'Ethnicity', options: ['Asian', 'Black', 'Caucasian', 'Hispanic']},
  ],
  artists: [
    {label: 'Popular', options: ['John Doe', 'Jane Smith', 'Alex Johnson']},
    {label: 'Style', options: ['Realism', 'Abstract', 'Pop Art']},
  ],
  more: [
    {label: 'Category', options: ['Nature', 'Technology', 'Food', 'Travel']},
    {label: 'Resolution', options: ['4K', '1080p', '720p']},
  ],
};

const MainPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState( false );
  const [videoPage, setVideoPage] = useState( 1 );
  const [loading, setLoading] = useState( false );
  const [product, setProduct] = useState( [] );
  const [totalVideoData, setTotalVideoData] = useState( 0 );
  const [totalVideoNumOfPage, setTotalVideoNumOfPage] = useState( 0 );

  const toggleFilter = () => {
    setIsFilterOpen( !isFilterOpen );
  };

  const handlePageChange = ( page: number ) => {
    setVideoPage( page );
    // Add your page change logic here
  };

  const handlePrevPage = () => {
    if ( videoPage > 1 ) {
      setVideoPage( videoPage - 1 );
    }
  };

  const handleNextPage = () => {
    if ( videoPage < totalVideoNumOfPage ) {
      setVideoPage( videoPage + 1 );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <div className="flex flex-col md:flex-row flex-1">
        <Filter isOpen={isFilterOpen} onToggle={toggleFilter} filterOptions={filterOptions} />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${isFilterOpen ? 'md:ml-80' : 'ml-0'}`}>
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
                <div className="py-10 lg:mx-4 xl:mx-24 md:mx-4 mx-4">
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
                          product.map( ( data:any ) => (
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

export default MainPage;
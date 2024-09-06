"use client";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/Home/homeImage";
import instance from "@/utils/axios";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setAudioPage, setImagePage } from "@/app/redux/feature/product/slice";
import { useRouter, useSearchParams } from "next/navigation";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";
import Filter from "@/components/searchBar/filtersidebar";
import { BsFilterLeft } from "react-icons/bs";
import { getImage } from "@/app/redux/feature/product/image/api";
import { getAudio } from "@/app/redux/feature/product/audio/api";
import Waveform from "@/components/Home/AudioWaveForm";

const filterOptions = {
  sortBy: ["Most Popular", "Newest", "Oldest"],
  audioLength: 0,
  bitRate: 0,
};

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = searchParams.get("searchTerm") || "";
  const categoryParam = category ? ["editor choice"] : "";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const { audioData, page, totalNumOfPage, totalAudioData } = useAppSelector(
    (state) => state.product
  );
  const { user } = useAppSelector((state) => state.user);

  const handlePageChange = (page: number) => {
    dispatch(setAudioPage(page));
  };

  const handleNextPage = () => {
    handlePageChange(page === totalNumOfPage ? 1 : page + 1);
  };

  const handlePrevPage = () => {
    handlePageChange(page === 1 ? totalNumOfPage : page - 1);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    const response = await getAudio(dispatch, !!user, {
      page: page,
      productsPerPage: 8,
      mediaType: ["audio"],
      searchTerm,
      category: categoryParam,
    });

    setLoading(false);
  };

  const fetchFilterData = async (
    page: number,
    filters: Record<string, string>
  ) => {
    setLoading(true);
    try {
      const response = await instance.get("/product/filter", {
        params: {
          page,
          productsPerPage: 10,
          mediaType: ["audio"],
          ...filters,
        },
      });
      console.log("response in filtered data:-", response);
      setFilteredData(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(filterType, value.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
    const filters = Object.fromEntries(currentParams);
    fetchFilterData(page, filters);
  };

  const handleClearFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("sortBy");
    currentParams.delete("audioBitrate");
    currentParams.delete("audioLength");
    router.push(`?${currentParams.toString()}`, { scroll: false });
    fetchData(page);
  };

  const hasFilterParams = () => {
    return Array.from(searchParams.keys()).some((key) =>
      ["sortBy", "audioBitrate", "audioLength"].includes(key)
    );
  };

  useEffect(() => {
    const filterParamsExist = hasFilterParams();
    setIsFilterOpen(filterParamsExist);
    if (hasFilterParams()) {
      const filters = Object.fromEntries(searchParams);
      fetchFilterData(page, filters);
    } else {
      fetchData(page);
    }
    return () => {
      clearKeywords(dispatch);
    };
  }, [page, searchParams]);

  const displayData = hasFilterParams() ? filteredData : audioData;

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <div className="flex flex-1 bg-pageBg-light">
        <Filter
          isOpen={isFilterOpen}
          onToggle={toggleFilter}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onclearFilter={handleClearFilters}
        />
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
                      {displayData.length > 0 ? (
                        displayData.map((product, index) => (
                          <Waveform key={index} product={product} />
                        ))
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
                      className={`${
                        page === 1
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
                      className={`${
                        page === totalNumOfPage
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

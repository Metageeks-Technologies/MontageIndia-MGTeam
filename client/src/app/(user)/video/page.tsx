"use client";
import { setVideoPage } from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import Searchbar from "@/components/searchBar/search";
import FAQ from "@/components/Video/fag";
import Trending from "@/components/Video/trendingVideos";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Filter from "@/components/searchBar/filtersidebar";
import { BsFilterLeft } from "react-icons/bs";
import instance from "@/utils/axios";
import Banner from "@/components/Banner";
import Masonry from "react-masonry-css";
import VideoBanner from "@/components/Home/videoBanner";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const filterOptions = {
  sortBy: ["Most Popular", "Newest", "Oldest"],
  orientation: ["Landscape", "Portrait"],
  resolution: ["FHD", "HD"],
  videoLength: 0, // input
  frameRate: ["30Hz", "24Hz"],
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const searchTerm = searchParams.get("searchTerm") || "";
  const category = searchParams.get("category");
  const categoryParam = category ? ["editor choice"] : "";
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    videoData: product,
    videoPage,
    totalVideoData,
    totalVideoNumOfPage,
  } = useAppSelector((state) => state.product);
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const { user } = useAppSelector((state) => state.user);

  const handlePageChange = (page: number) => {
    dispatch(setVideoPage(page));
  };

  const handleNextPage = () => {
    handlePageChange(videoPage === totalVideoNumOfPage ? 1 : videoPage + 1);
  };

  const handlePrevPage = () => {
    handlePageChange(videoPage === 1 ? totalVideoNumOfPage : videoPage - 1);
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    const response = await getVideo(dispatch, !!user, {
      page,
      mediaType: ["video"],
      searchTerm,
      category: categoryParam,
      productsPerPage: "9",
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
          productsPerPage: 9,
          mediaType: ["video"],
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
    fetchFilterData(videoPage, filters);
  };

  const handleClearFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Array.from(searchParams.keys()).forEach((key) => {
      currentParams.delete(key);
    });
    router.push(`?${currentParams.toString()}`, { scroll: false });
    setFilteredData([]);

    fetchData(videoPage);
  };

  const hasFilterParams = () => {
    // return Array.from( searchParams.keys() ).some( key =>
    //   ['sortBy', 'orientation', 'minHeight', 'minWidth', 'fileType', 'minDensity'].includes( key )
    // );
    return Array.from(searchParams.keys()).some((key) =>
      [
        "sortBy",
        "orientation",
        "videoResolution",
        "videoLength",
        "videoFrameRate",
      ].includes(key)
    );
  };

  useEffect(() => {
    const filterParamsExist = hasFilterParams();
    setIsFilterOpen(filterParamsExist);
    if (hasFilterParams()) {
      const filters = Object.fromEntries(searchParams);
      fetchFilterData(videoPage, filters);
    } else {
      fetchData(videoPage);
    }
    return () => {
      clearKeywords(dispatch);
    };
  }, [videoPage, searchParams]);

  const displayData = hasFilterParams() ? filteredData : product;

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <VideoBanner
        isSearch={false}
        videoPath="/images/video_banner.webm"
        heading="Explore Stock Videos and Footage"
        description="stock videos in FHD & HD from the world's leading stock footage collection."
      />
      <div className="flex flex-1">
        <div className={`flex-1 transition-all duration-300 ease-in-out `}>
          <div className="">
            <div className="main items-center">
              {/* Trending Videos */}
              <div className="">
                <div
                  className={`py-10 lg:mx-4 ${
                    !isFilterOpen ? "xl:mx-16 md:mx-4 mx-4" : "ml-0"
                  } `}
                >
                  <h1 className="text-2xl font-bold  text-start">
                    Today's Trending Video
                  </h1>
                  <h4 className="text-lg text-neutral-700">
                    {totalVideoData} Product stock Photos and High-res Pictures
                  </h4>
                  <div className="mx-auto min-h-screen mt-4">
                    {loading ? (
                      <div className="flex items-center justify-center text-center m-auto">
                        <Spinner label="Loading..." color="danger" />
                      </div>
                    ) : (
                      <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {displayData.length > 0 ? (
                          displayData.map((data: any) => (
                            <Trending key={data._id} data={data} />
                          ))
                        ) : (
                          <p>No Video found.</p>
                        )}
                      </Masonry>
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
                    className={`${
                      videoPage === 1
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
                    className={`${
                      videoPage === totalVideoNumOfPage
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

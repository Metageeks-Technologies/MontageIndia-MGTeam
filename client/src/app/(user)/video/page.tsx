"use client";
import { setVideoPage } from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import Searchbar from "@/components/searchBar/search";
import Trending from "@/components/Video/trendingVideos";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearKeywords } from "@/app/redux/feature/product/api";
import instance from "@/utils/axios";
import Banner from "@/components/Banner";
import Masonry from "react-masonry-css";
import VideoBanner from "@/components/Home/videoBanner";
import { SpinnerLoader } from "@/components/loader/loaders";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const Page = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const searchTerm = searchParams.get("searchTerm") || "";
  const category = searchParams.get("category");
  const categoryParam = category ? ["editor choice"] : "";
  const dispatch = useAppDispatch();
  const {
    videoData: product,
    videoPage,
    totalVideoData,
    totalVideoNumOfPage,
  } = useAppSelector((state) => state.product);
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

  useEffect(() => {
    fetchData(videoPage);
    return () => {
      clearKeywords(dispatch);
    };
  }, [videoPage, searchParams]);

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
                <div className="py-6 lg:mx-4 xl:mx-16 md:mx-4 mx-4">
                  <div className="sm:py-6 py-0">
                    <h1 className="text-4xl sm:block hidden font-semibold  text-center">
                      Today's Trending Video
                    </h1>
                    <h4 className="sm:text-lg sm:font-normal font-semibold text-sm mt-1 text-neutral-700 sm:text-center text-start">
                      {totalVideoData} Product stock Photos and High-res
                      Pictures
                    </h4>
                  </div>
                  <div className="mx-auto min-h-screen mt-2">
                    {loading ? (
                      <SpinnerLoader />
                    ) : (
                      <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {product.length > 0 ? (
                          product.map((data: any) => (
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

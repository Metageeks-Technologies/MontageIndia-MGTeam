"use client";
import { setVideoPage } from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import Searchbar from "@/components/searchBar/search";
import FAQ from "@/components/Video/fag";
import Trending from "@/components/Video/trendingVideos";
import { Button, Pagination } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { clearKeywords } from "@/app/redux/feature/product/api";

const Page = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";

  const category = searchParams.get("category");
  const categoryArray = category ? category.split(',').map(cat => cat.trim()) : [];

  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const {
    videoData: product,
    videoPage,
    totalVideoNumOfPage,
  } = useAppSelector((state) => state.product);

  const handlePageChange = (page: number) => {
    dispatch(setVideoPage(page));
  };

  const handleNextPage = () => {
    handlePageChange(videoPage === totalVideoNumOfPage ? 1 : videoPage + 1);
  };

  const handlePrevPage = () => {
    handlePageChange(videoPage === 1 ? totalVideoNumOfPage : videoPage - 1);
  };
 

  const fetchData = (page: number) => {
    // setLoading(true);
    getVideo(dispatch, {
      page,
      mediaType: ["video"],
      searchTerm,
      category: categoryArray,
      productsPerPage: "2",
    });
  };

  useEffect(() => {
    fetchData(videoPage);
    return () => {
      clearKeywords(dispatch);
    };
  }, [videoPage, searchParams]);

  return (
    <>
      <Searchbar />

      <div className="main items-center ">
        {/* Category Buttons */}
        {/* <hr className="mt-5" /> */}


        {/* Trending Videos */}
        <div className="bg-[#eeeeee]">
          <div className="py-10 lg:mx-24 md:mx-4 mx-4">
            <h1 className="text-2xl font-bold lg:text-start md:text-center text-center">
              Today's Trending Videos
            </h1>
            <div className="mx-auto mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
                {product.length > 0 ? (
                  product.map((data) => <Trending key={data._id} data={data} />)
                ) : (
                  <p>No videos found.</p>
                )}
              </div>
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

        <Footer />
      </div>
    </>
  );
};

export default Page;

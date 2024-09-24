"use client";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/Home/homeImage";
import { Button, Pagination } from "@nextui-org/react";
import { SpinnerLoader } from "@/components/loader/loaders";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setImagePage, requestStart } from "@/app/redux/feature/product/slice";
import { useRouter, useSearchParams } from "next/navigation";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";
import Filter from "@/components/searchBar/filtersidebar";
import { BsFilterLeft } from "react-icons/bs";
import { getImage } from "@/app/redux/feature/product/image/api";
import Category from "@/components/Category";
import Masonry from "react-masonry-css";

const filterOptions = {
  sortBy: ["newest", "oldest", "popular"],
  imageOrientation: ["vertical", "horizontal"],
  imageFileType: ["jpeg", "png"],
  imageWidth: 0,
  imageHeight: 0,
  imageDensity: 0,
};

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchTerm = searchParams.get("searchTerm") || "";
  const categoryParam = category ? ["editor choice"] : "";

  const {
    imageData: product,
    imagePage,
    totalImageData,
    totalImageNumOfPage,
    loading,
  } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page: number) => {
    dispatch(setImagePage(page));
  };

  const fetchData = async (page: number) => {
    // dispatch( setLoading( true ) );
    dispatch(requestStart());

    const filters = Object.fromEntries(searchParams);
    await getImage(dispatch, !!user, {
      page,
      mediaType: ["image"],
      searchTerm,
      category: categoryParam,
      productsPerPage: "20",
      sortBy: filters.sortBy || "newest",
      imageOrientation: filters.imageOrientation,
      imageFileType: filters.imageFileType,
      imageWidth: filters.imageWidth,
      imageHeight: filters.imageHeight,
      imageDensity: filters.imageDensity,
    });
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(filterType, value.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.keys(filterOptions).forEach((key) => {
      currentParams.delete(key);
    });
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const hasFilterParams = () => {
    return Array.from(searchParams.keys()).some((key) =>
      Object.keys(filterOptions).includes(key)
    );
  };

  useEffect(() => {
    const filterParamsExist = hasFilterParams();
    setIsFilterOpen(filterParamsExist);
    fetchData(imagePage);
    return () => {
      clearKeywords(dispatch);
    };
  }, [imagePage, searchParams]);

  return (
    <div className="flex flex-col">
      <Searchbar />
      <div className="flex flex-1">
        <Filter
          isOpen={isFilterOpen}
          onToggle={toggleFilter}
          mediaType="image"
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilters}
        />
        <div className={`flex-1 transition-all duration-300 ease-in-out`}>
          <div className="lg:p-4 md:p-0 p-0">
            <button
              className="py-2 lg:ml-12 md:ml-4 ml-4 text-gray-800 bg-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md mb-4"
              onClick={toggleFilter}
            >
              Filters <BsFilterLeft />
            </button>
            <div className="main items-center">
              <div className="">
                <div
                  className={`py-10 lg:mx-4 ${
                    !isFilterOpen ? "xl:mx-12 md:mx-4 mx-4" : "ml-0"
                  }`}
                >
                  {loading ? (
                    <SpinnerLoader />
                  ) : product.length > 0 ? (
                    <>
                      <h1 className="text-2xl font-bold text-start">
                        {" "}
                        {searchTerm
                          ? "Trending Images"
                          : "Today's Trending Images"}
                      </h1>
                      <h4 className="text-lg text-neutral-700">
                        {totalImageData} Product stock Photos and High-res
                        Pictures
                      </h4>
                      <div className="mx-auto mt-4">
                        <Masonry
                          breakpointCols={{
                            default: 4,
                            1100: 3,
                            700: 2,
                            500: 1,
                          }} // Define breakpoints
                          className="my-masonry-grid-img" // Custom class for styling
                          columnClassName="my-masonry-grid_column-img" // Custom column class
                        >
                          {product.map((data: any, index) => (
                            <div
                              className="flex flex-col justify-between "
                              key={index}
                            >
                              <ImageGallery data={data} />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-12">
                        <h1 className="text-xl font-semibold text-gray-700">
                          Sorry, we couldn't find any matches for "{searchTerm}"
                        </h1>
                        <p className="text-gray-500 mt-2">
                          Try making your search simpler and double-check your
                          spelling
                        </p>
                      </div>
                      <Category mediaType="image" />
                    </>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalImageNumOfPage > 1 && (
                <div className="flex justify-center items-center gap-4 my-4">
                  <Button
                    size="sm"
                    type="button"
                    disabled={imagePage === 1}
                    variant="flat"
                    className={`${
                      imagePage === 1
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-webred"
                    } bg-webred text-white rounded-full font-bold`}
                    onPress={() => handlePageChange(imagePage - 1)}
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
                    total={totalImageNumOfPage}
                    page={imagePage}
                    onChange={handlePageChange}
                    initialPage={1}
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={imagePage === totalImageNumOfPage}
                    variant="flat"
                    className={`${
                      imagePage === totalImageNumOfPage
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-webred"
                    } bg-webred text-white rounded-full font-bold`}
                    onPress={() => handlePageChange(imagePage + 1)}
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

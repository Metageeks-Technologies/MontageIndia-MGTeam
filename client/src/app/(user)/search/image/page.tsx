"use client";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/Home/homeImage";
import instance from "@/utils/axios";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setImagePage } from "@/app/redux/feature/product/slice";
import { useRouter, useSearchParams } from "next/navigation";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";
import Filter from "@/components/searchBar/filtersidebar";
import { BsFilterLeft } from "react-icons/bs";
import { getImage } from "@/app/redux/feature/product/image/api";
import Hero from "@/components/Home/gallary/Hero";

const filterOptions = {
  sortBy: ["newest", "oldest", "popular"],
  orientation: ["vertical", "horizontal"],
  size: { imageHeight: 0, imageWidth: 0 },
  density: 0,
  fileType: ["jpeg", "png"],
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
  const {
    imageData: product,
    imagePage,
    totalImageData,
    totalImageNumOfPage,
  } = useAppSelector((state) => state.product);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page: number) => {
    dispatch(setImagePage(page));
  };

  const handleNextPage = () => {
    handlePageChange(imagePage === totalImageNumOfPage ? 1 : imagePage + 1);
  };
  const { user } = useAppSelector((state) => state.user);
  const handlePrevPage = () => {
    handlePageChange(imagePage === 1 ? totalImageNumOfPage : imagePage - 1);
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    const response = await getImage(dispatch, !!user, {
      page: imagePage,
      productsPerPage: 10,
      mediaType: ["image"],
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
          mediaType: ["image"],
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
    fetchFilterData(imagePage, filters);
  };

  const handleClearFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("sortBy");
    currentParams.delete("orientation");
    currentParams.delete("minHeight");
    currentParams.delete("minWidth");
    currentParams.delete("maxHeight");
    currentParams.delete("maxWidth");
    currentParams.delete("fileType");
    currentParams.delete("minDensity");
    currentParams.delete("maxDensity");
    router.push(`?${currentParams.toString()}`, { scroll: false });
    fetchData(imagePage);
  };

  const hasFilterParams = () => {
    return Array.from(searchParams.keys()).some((key) =>
      [
        "sortBy",
        "orientation",
        "minHeight",
        "minWidth",
        "maxHeight",
        "maxWidth",
        "fileType",
        "minDensity",
        "maxDensity",
      ].includes(key)
    );
  };

  useEffect(() => {
    const filterParamsExist = hasFilterParams();
    setIsFilterOpen(filterParamsExist);
    if (hasFilterParams()) {
      const filters = Object.fromEntries(searchParams);
      fetchFilterData(imagePage, filters);
    } else {
      fetchData(imagePage);
    }
    return () => {
      clearKeywords(dispatch);
    };
  }, [imagePage, searchParams]);

  const displayData = hasFilterParams() ? filteredData : product;

  return (
    <div className="flex flex-col min-h-screen">
      <Searchbar />
      <div className="flex flex-1">
        <Filter
          isOpen={isFilterOpen}
          onToggle={toggleFilter}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onclearFilter={handleClearFilters}
        />
        <div className={`flex-1 transition-all duration-300 ease-in-out `}>
          <div className="lg:p-4 md:p-0 p-0">
            <button
              className="py-2 lg:ml-12 md:ml-4 ml-4  text-gray-800 bg-white border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md mb-4"
              onClick={toggleFilter}
            >
              Filters <BsFilterLeft />
            </button>
            <div className="main items-center">
              <div className="">
                <div
                  className={`py-10 lg:mx-4 ${
                    !isFilterOpen ? "xl:mx-12 md:mx-4 mx-4" : "ml-0"
                  } `}
                >
                  <h1 className="text-2xl font-bold  text-start">
                    Today's Trending Images
                  </h1>
                  <h4 className="text-lg text-neutral-700">
                    {totalImageData} Product stock Photos and High-res Pictures
                  </h4>
                  <div className="mx-auto mt-4">
                    {loading ? (
                      <div className="flex items-center justify-center min-h-screen text-center m-auto">
                        <Spinner label="Loading..." color="danger" />
                      </div>
                    ) : (
                      <div className="columns-1 min-h-screen sm:columns-2 md:columns-3 lg:columns-4 gap-2 mt-2 relative">
                        {displayData.length > 0 ? (
                          displayData.map((data: any) => (
                            <ImageGallery key={data._id} data={data} />
                          ))
                        ) : (
                          <p>No Images found.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalImageNumOfPage > 1 && (
                <div className="flex justify-center items-center gap-4 my-4">
                  <Button
                    size="sm"
                    type="button"
                    disabled={currentPage === 1}
                    variant="flat"
                    className={`${
                      currentPage === 1
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
                    total={totalImageNumOfPage}
                    page={imagePage}
                    onChange={handlePageChange}
                    initialPage={1}
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={currentPage === totalPages}
                    variant="flat"
                    className={`${
                      currentPage === totalPages
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

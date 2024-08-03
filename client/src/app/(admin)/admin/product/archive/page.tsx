"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import instance from "@/utils/axios";
import { Spinner, Pagination, Button } from "@nextui-org/react";
import Multiselect from 'multiselect-react-dropdown';
import { categoriesOptions, mediaTypesOptions } from "@/utils/tempData";
import { LuDot } from "react-icons/lu";

// Define the interfaces for the product and variant types
interface Variant
{
  label: string;
  price: number;
  key: string;
}

interface Product
{
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  publicKey: string;
  category: string[];
  thumbnailKey: string;
  id: string;
  uuid: string;
}

const Home: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [SearchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [shouldFetch, setShouldFetch] = useState(true);

  const onSelectCategory = ( selectedList: string[] ) =>
  {
    setSelectedCategories( selectedList );
  };

  const onRemoveCategory = ( selectedList: string[] ) =>
  {
    setSelectedCategories( selectedList );
  };

  const onSelectMediaType = ( selectedList: string[] ) =>
  {
    setSelectedMediaTypes( selectedList );
  };

  const onRemoveMediaType = ( selectedList: string[] ) =>
  {
    setSelectedMediaTypes( selectedList );
  };
   const showAllProducts = async () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedMediaTypes([]);
    setCurrentPage(1);
    setShouldFetch(true);
  }
  const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
  // fetch data from Server
  const fetchProduct = async () =>
  {
    setLoading( true );
    try
    {
      const response = await instance.get( `/product`, {
        params: { status: 'archived', productsPerPage, page: currentPage, category: selectedCategories, mediaType: selectedMediaTypes, searchTerm: SearchTerm },
        withCredentials: true,
      });
      setProductData(response.data.products);
      setTotalPages(response.data.numOfPages);
      
      console.log(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (shouldFetch) {
      fetchProduct();
      setShouldFetch(false);
    }

  }, [currentPage, productsPerPage,shouldFetch]);

  // display words function
  function truncateText ( text: string, wordLimit: number ): string
  {
    const words = text.split( " " );
    if ( words.length > wordLimit )
    {
      return words.slice( 0, wordLimit ).join( " " ) + "...";
    }
    return text;
  }
  
   const handleproductPerPage=(e:any)=>{
    e.preventDefault();
    setShouldFetch(true);
    setCurrentPage(1);
    setProductsPerPage(parseInt(e.target.value));
  }
  // Handler to change page
  const handlePageChange = (page: number) => {
    setShouldFetch(true);
    setCurrentPage(page);
  };

  return (
    <div className="container p-4  ">
      <div className="flex justify-between items-center my-6">
        <input
          type="text"
          placeholder="Search products"
          value={ SearchTerm }
          onChange={ ( e ) => setSearchTerm( e.target.value ) }
          className="border rounded px-4 py-2 w-full max-w-sm"
        />
        <h1 className="bg-webgreen text-white px-4 py-2 rounded ml-2">
          Archive Product
        </h1>
      </div>
      <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
        <div className="flex justify-start items-center flex-wrap gap-4">
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="category"
            style={ {
              chips: {
                background: '#BEF264'
              },
              searchBox: {
                background: 'white',
                border: '1px solid #e5e7eb',
              },
            }}
            options={categoriesOptions.map((option) => ({ name: option.name ,value: option.value }))} 
            selectedValues={selectedCategories.map((category) => ({ name: category }))}
            onSelect={(selectedList) => onSelectCategory(selectedList.map((item:any) => item.name))} 
            onRemove={(selectedList) => onRemoveCategory(selectedList.map((item:any) => item.name))} 
            showCheckbox
            displayValue="name"
          />
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="media type"
            options={mediaTypesOptions.map((option) => ({ name: option.name, value: option.value }))} 
            selectedValues={selectedMediaTypes.map((type) => ({ name: type }))}
            onSelect={(selectedList) => onSelectMediaType(selectedList.map((item:any) => item.name))} 
            onRemove={(selectedList) => onRemoveMediaType(selectedList.map((item:any) => item.name))} 
            showCheckbox
            displayValue="name"
            style={ {
              chips: {
                background: '#BEF264'
              },
              searchBox: {
                background: 'white',
                border: '1px solid #e5e7eb',
              }
            } }
          />
          <button className="bg-webgreen text-white px-4 py-2 rounded" onClick={ fetchProduct }>
            Search
          </button>
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={showAllProducts}>
            Show All
          </button>
        </div>
        <div>
          <select className="border rounded px-4 py-2" value={productsPerPage} onChange={(e)=>handleproductPerPage(e)}>
            <option value="6" >6 Data per page</option>
            <option value="12">12 Data per page</option>
            <option value="24">24 Data per page</option>
          </select>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Product
              </th>
               <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Product Title
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Media Type
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                category
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Description
              </th>
              <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            { loading ? (
              <tr>
                <td colSpan={ 6 } className="text-center py-4">
                  <Spinner label="Loading..." color="success" />
                </td>
              </tr>
            ) : (
               (productData===null || productData.length === 0) ? (
                    <tr>
                    <td colSpan={ 7 } className="text-center py-4">
                      <p className="text-gray-400 text-sm ">No Data Found</p>
                    </td>
                  </tr>
                  ):
                  productData && productData.length>0 &&
             productData.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-300">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex justify-center items-center">
                      
                        { prod.mediaType === "image" && (
                           <div className="w-40 h-20">
                          <img
                            className="w-full h-full rounded object-contain"
                            src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }` }
                            alt={ prod.title }
                          />
                          </div>
                        ) }
                        { prod.mediaType === "audio" && (
                          <audio className="w-60 h-20 object-contain" controls>
                            <source
                              src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }` }
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) }
                        { prod.mediaType === "video" && (
                          <video className="w-40 h-20 object-contain" controls>
                            <source
                              src={ ` https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ prod.thumbnailKey }` }
                              type="video/mp4"
                            />
                            Your browser does not support the video element.
                          </video>
                        ) }
                    </div>
                  </td>
                   <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {capitalizeFirstLetter(prod.title)}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-50 bg-green-200 rounded-full"
                      ></span>
                      <span className="relative">{ prod.mediaType }</span>
                    </span>
                  </td>
                   
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {
                       (prod.category && prod.category.length>0)?
                          prod.category.map((category, index) => (
                              <span key={index}>
                                  {capitalizeFirstLetter(category)}
                                              {index < prod.category.length - 1 ? ', ' : ''}
                              </span>
                          ))
                          : ''
                    }
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 ">
                      { truncateText( prod.description, 3 ) }
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Link
                        href={ `/admin/product/update/${ prod.uuid }` }
                        className="bg-slate-200 px-6 py-0.5 flex items-center rounded-lg"
                      >
                        Details
                      </Link>
                    </button>
                  </td>
                </tr>
              ) )
            ) }
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages>0 && <div className="flex justify-center items-center gap-4 my-4">
                <Button
                    size="sm"
                    type="button"
                    disabled={currentPage === 1}
                    variant="flat"
                    className={`${currentPage === 1 ? "opacity-70" : "hover:bg-webgreenHover"} bg-webgreen-light text-white rounded-md font-bold`}
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                    >
                    Prev
                </Button> 
                <Pagination 
                    color="success" 
                    classNames={{
                    item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-md",
                    cursor:"bg-webgreen hover:bg-webgreen text-white rounded-md font-bold",
                    }} 
                    total={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange}  
                    initialPage={1} />

                <Button
                type="button"
                disabled={currentPage === totalPages}
                size="sm"
                variant="flat"
                className={`${currentPage === totalPages ? "opacity-70" : "hover:bg-webgreenHover"} bg-webgreen-light text-white rounded-md font-bold`}
                onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                >
                Next
                </Button>
        </div>
      }
    </div>
  );
};

export default Home;

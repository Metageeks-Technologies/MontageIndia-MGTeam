"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import instance from "@/utils/axios";
import {Spinner, Pagination, Button} from "@nextui-org/react";
import Multiselect from "multiselect-react-dropdown";
import {categoriesOptions, mediaTypesOptions} from "@/utils/tempData";
import {BsThreeDots} from "react-icons/bs";
import {GoDotFill} from "react-icons/go";
import {LuDot} from "react-icons/lu";
import {FaStarOfLife} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {SpinnerLoader} from "@/components/loader/loaders";
interface Variant {
  label: string;
  price: number;
  key: string;
}

interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  uuid: string;
  status: string;
  mediaType: string;
  publicKey: string;
  category: string[];
  thumbnailKey: string;
  id: string;
}

const Home: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>( [] );
  const [loading, setLoading] = useState( false );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [totalPages, setTotalPages] = useState( 1 );
  const [productsPerPage, setProductsPerPage] = useState( 5 );
  const [SearchTerm, setSearchTerm] = useState( "" );
  const [selectedCategories, setSelectedCategories] = useState<string[]>( [] );
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>( [] );
  const [shouldFetch, setShouldFetch] = useState( true );
  const [availableCategories, setAvailableCategories] = useState<any[]>( [] );

  const router = useRouter();
  const onSelectCategory = ( selectedList: string[] ) => {
    setSelectedCategories( selectedList );
  };

  const onRemoveCategory = ( selectedList: string[] ) => {
    setSelectedCategories( selectedList );
  };

  const onSelectMediaType = ( selectedList: string[] ) => {
    setSelectedMediaTypes( selectedList );
  };

  const onRemoveMediaType = ( selectedList: string[] ) => {
    setSelectedMediaTypes( selectedList );
  };
  const capitalizeFirstLetter = ( str: string ): string => {
    if ( !str ) return "";
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
  };
  const showAllProducts = async () => {
    setSearchTerm( "" );
    setSelectedCategories( [] );
    setSelectedMediaTypes( [] );
    setCurrentPage( 1 );
    setShouldFetch( true );
  };
  // fetch data from Server
  const fetchProduct = async () => {
    setLoading( true );
    try {
      const response = await instance.get( `/product`, {
        params: {
          status: "draft",
          productsPerPage,
          page: currentPage,
          category: selectedCategories,
          mediaType: selectedMediaTypes,
          searchTerm: SearchTerm,
        },
        withCredentials: true,
      } );
      console.log( response );
      setProductData( response.data.products );
      setTotalPages( response.data.numOfPages );
    } catch ( error ) {
      console.error( "Error fetching products:", error );
    } finally {
      setLoading( false );
    }
  };

  const getCategories = async () => {
    try {
      const response = await instance.get( "/field/category" );
      const formattedCategories = response.data.categories.map(
        ( category: any ) => ( {
          name: category.name ? category.name : "Unknown", // Handle undefined names
        } )
      );
      setAvailableCategories( formattedCategories );
      console.log( "sdsd", response );
    } catch ( error ) {
      console.log( "error in getting the category:-", error );
    }
  };

  useEffect( () => {
    getCategories();
    if ( shouldFetch ) {
      fetchProduct();
      setShouldFetch( false );
    }
  }, [currentPage, productsPerPage, shouldFetch] );

  const handleproductPerPage = ( e: any ) => {
    e.preventDefault();
    setShouldFetch( true );
    setCurrentPage( 1 );
    setProductsPerPage( parseInt( e.target.value ) );
  };
  // Handler to change page
  const handlePageChange = ( page: number ) => {
    setShouldFetch( true );
    setCurrentPage( page );
  };

  function truncateText ( text: string, wordLimit: number ): string {
    const words = text.split( " " );
    if ( words.length > wordLimit ) {
      return words.slice( 0, wordLimit ).join( " " ) + "...";
    }
    return text;
  }

  return (
    <div className="container p-4 bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Draft</h1>
      </div>

      {/* one horixonal line */}
      <hr className="border-t border-gray-300 mb-4" />

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search Products"
          value={SearchTerm}
          onChange={( e ) => setSearchTerm( e.target.value )}
          className="border rounded px-4 py-2 flex-grow"
        />
        <div className="w-48 p-1">
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="category"
            style={{
              chips: {
                background: "red",
              },
              searchBox: {
                background: "white",
                border: "1px solid #e5e7eb",
              },
            }}
            options={availableCategories}
            selectedValues={selectedCategories.map( ( category ) => ( {
              name: category,
            } ) )}
            onSelect={( selectedList ) =>
              onSelectCategory( selectedList.map( ( item: any ) => item.name ) )
            }
            onRemove={( selectedList ) =>
              onRemoveCategory( selectedList.map( ( item: any ) => item.name ) )
            }
            showCheckbox
            displayValue="name"
          />
        </div>
        <div className="w-48 p-2">
          <Multiselect
            avoidHighlightFirstOption
            showArrow
            placeholder="media type"
            options={mediaTypesOptions.map( ( option ) => ( {
              name: option.name,
              value: option.value,
            } ) )}
            selectedValues={selectedMediaTypes.map( ( type ) => ( {name: type} ) )}
            onSelect={( selectedList ) =>
              onSelectMediaType( selectedList.map( ( item: any ) => item.name ) )
            }
            onRemove={( selectedList ) =>
              onRemoveMediaType( selectedList.map( ( item: any ) => item.name ) )
            }
            showCheckbox
            displayValue="name"
            style={{
              chips: {
                background: "red",
              },
              searchBox: {
                background: "white",
                border: "1px solid #e5e7eb",
              },
            }}
          />
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={fetchProduct}
        >
          Search
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          onClick={showAllProducts}
        >
          Clear
        </button>
      </div>

      <div className="mb-4">
        <div>
          <select
            className="border rounded px-4 py-2"
            value={productsPerPage}
            onChange={( e ) => handleproductPerPage( e )}
          >
            <option value={5}>5 Data per page</option>
            <option value={10}>10 Data per page</option>
            <option value={20}>20 Data per page</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Media Type
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Title
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3 text-center bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <SpinnerLoader />
                </td>
              </tr>
            ) : productData && productData.length > 0 ? (
              productData.map( ( prod ) => (
                <tr key={prod._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200 bg-pureWhite-light text-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute top-0 left-0 ">
                        {prod.mediaType === "image" && (
                          <img
                            src="/images/imageIcon.png"
                            alt="Image"
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        {prod.mediaType === "audio" && (
                          <img
                            src="/images/speakerIcon.png"
                            alt="Audio"
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        {prod.mediaType === "video" && (
                          <img
                            src="/images/videoIcon.png"
                            alt="Video"
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                      </div>
                      <div className="flex items-center w-full p-3">
                        {prod?.mediaType === "video" && (
                          <div>
                            {" "}
                            {prod?.thumbnailKey ?
                              <video
                                controls
                                className="w-full h-28 object-cover rounded"
                              >
                                <source
                                  src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${prod?.thumbnailKey}`}
                                />
                              </video>
                              :
                              <img src='/images/images.png' className='h-16' alt='product image unavailable' />
                            }
                          </div>
                        )}
                        {prod.mediaType === "image" && (
                          prod?.thumbnailKey ? (
                            <img
                              src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${prod.thumbnailKey}`}
                              alt={prod.title}
                              className="w-3/4 h-16 object-cover rounded"
                            />
                          ) : (
                            <img src='/images/images.png' className='h-16' alt='product image unavailable' />
                          )
                        )}
                        {prod.mediaType === "audio" && (
                          <img
                            src="/images/audioImage.png"
                            alt={prod.title}
                            className="w-3/4 h-16 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm font-medium text-gray-900">
                      {capitalizeFirstLetter( prod.title )}
                    </div>
                  </td>

                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {prod.category.join( ", " )}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">
                      {truncateText( prod.description, 3 )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 border-b text-center border-gray-200 bg-white">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Link
                        href={`details/${prod.uuid}`}
                        className="bg-slate-200 px-6 py-0.5 flex items-center rounded-lg"
                      >
                        Details
                      </Link>
                    </button>
                  </td>
                </tr>
              ) )
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <p className="text-gray-500">No Data Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p>
              Showing 1 to {productsPerPage} of {totalPages * productsPerPage}{" "}
              Entries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange( currentPage - 1 )}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array( totalPages )].map( ( _, index ) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${currentPage === index + 1
                  ? "bg-red-500 text-white"
                  : "bg-white"
                  }`}
                onClick={() => handlePageChange( index + 1 )}
              >
                {index + 1}
              </button>
            ) )}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange( currentPage + 1 )}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

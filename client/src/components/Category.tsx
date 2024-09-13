"use client"
import instance from '@/utils/axios';
import Link from 'next/link';
import React from 'react'
import {useState,useEffect,useRef} from 'react'

interface Category {
    name: string;
    image: string;
    description: string;
  }
  interface CategoryProps{
    mediaType:string;
  }
  
const Category:React.FC<CategoryProps> = ({mediaType}) =>  {

  const [categories, setCategories] = useState<Category[]>( [] );
  const [page, setPage] = useState( 1 );
  const [loading, setLoading] = useState( false );
  const [hasMore, setHasMore] = useState( true );
  const initialLoad = useRef( true );



  const getCategory = async () => {
    console.log( "getCategory called: ", page );
    if ( Number( categories.length ) >= 16 ) {
      setHasMore( false );
      return;
    }
    try {
      setLoading( true );
      const res = await instance.get( "/field/category", {
        params: {
          page: page,
        },
        withCredentials: true,
      } );
      console.log( "res", res.data );
      if ( res.data.categories.length > 0 ) {
        setCategories( ( prevCategories ) => [
          ...prevCategories,
          ...res.data.categories,
        ] );
      }
      setPage( page + 1 );
      setHasMore( res.data.hasMore );
      if ( categories.length >= 16 || page >= 2 ) {
        setHasMore( false );
      }
    } catch ( error ) {
      console.log( error );
    }
    setLoading( false );
  };

  const handleLoadMore = () => {
    setPage( 2 );
    getCategory();
  };

  useEffect( () => {
    if ( initialLoad.current ) {
      initialLoad.current = false;
      getCategory();
    }
  }, [] );


  return (
    <div className='  bg-[#F4F6F6] '>
    <div className="w-full py-5">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-5">Browse all categories</h2>

      <div className="lg:mx-16 sm:mx-4 mx-2 py-4 md:py-5 text-white mt-4 ">
     
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {categories.map( ( data: Category, index ) => (
          <Link href={`/search/${mediaType}?searchTerm=${data.name}&mediaType=${mediaType}`} key={index} >
            {/* Masonry item */}
            <div className="relative">
              {/* Inner div */}
              <img
                src={data.image}
                alt={`Product Image `}
                // loading="lazy"
                className="w-full h-28 md:h-52 object-cover rounded"
              />
              <div className="absolute bottom-0 py-0.5 md:py-1.5 w-full bg-[#00000089] ">
                <h1 className="text-white text-sm md:text-md font-bold capitalize text-center">
                  {data.name}
                </h1>
              </div>
            </div>
            {/* <div className="text-zinc-950 px-2 capitalize font-semibold text-start">
                  {data.name}
              </div> */}
          </Link>
        ) )}
      </div>
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => handleLoadMore()}
            className="bg-red-500 text-white py-1 px-2 md:py-2 md:px-4 mt-8 rounded "
          >
            Load More
          </button>
        </div>
      )}
    </div>
      

    </div>
    </div>
  )
}

export default Category

"use client";
import instance from "@/utils/axios";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";

interface UserActivity
{
  _id: string;
  name: string;
  productId: string;
  username: string;
  email: string;
  category: string;
  action: string;
  timestamp: string;
}

const Page = () =>
{
  const [ data, setData ] = useState<UserActivity[]>( [] );
  const [ loading, setLoading ] = useState( false );
  const [ currentPage, setCurrentPage ] = useState( 1 );
  const dataperPage = 10;

  const fetchUsers = async () =>
  {
    setLoading( true );
    try
    {
      const response = await instance.get( `auth/admin/Activity/getAllActivity`, { withCredentials: true } );
      setData( response.data.activities );
      console.log( response );
    } catch ( error )
    {
      console.error( "Error fetching users:", error );
    } finally
    {
      setLoading( false );
    }
  };
   const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

  useEffect( () =>
  {
    fetchUsers();
  }, [] );

  const paginatedUsers = useMemo( () =>
  {
    const startIndex = ( currentPage - 1 ) * dataperPage;
    return data.slice( startIndex, startIndex + dataperPage );
  }, [ data, currentPage ] );

  const totalPages = useMemo( () => Math.ceil( data.length / dataperPage ), [ data.length, dataperPage ] );

  const handlePageChange = ( newPage: number ) =>
  {
    setCurrentPage( newPage );
  };

  const formatDate = ( timestamp: any ) => new Intl.DateTimeFormat( 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  } ).format( new Date( timestamp ) );

  const renderPaginationNumbers = () =>
  {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Adjust this number to show more or fewer page numbers

    let startPage = Math.max( 1, currentPage - Math.floor( maxPagesToShow / 2 ) );
    let endPage = Math.min( totalPages, startPage + maxPagesToShow - 1 );

    if ( endPage - startPage + 1 < maxPagesToShow )
    {
      startPage = Math.max( 1, endPage - maxPagesToShow + 1 );
    }

    for ( let i = startPage; i <= endPage; i++ )
    {
      pageNumbers.push(
        <button
          key={ i }
          onClick={ () => handlePageChange( i ) }
          className={ `px-3 py-1 mx-1 rounded ${ currentPage === i
            ? 'text-white bg-[#BEF264] hover:bg-[#cbff70] rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BEF264]'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }` }
        >
          { i }
        </button>
      );
    }

    return pageNumbers;
  };


  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">User Activity</h1>
      <div className="flex-grow overflow-auto">
        <div className="relative shadow-md sm:rounded-lg mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400">
              <thead className="text-xs text-black uppercase bg-gray-200">
                <tr className="border">
                  <th scope="col" className="px-4 py-3 sm:px-6">Username</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Name</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Email</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Category</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Product ID</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Timestamp</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                { loading ? (
                  <tr>
                    <td colSpan={ 7 } className="text-center py-4">
                      <Spinner label="Loading..." color="success" />
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map( ( user ) => (
                    <tr key={ user._id } className="border-b hover:bg-gray-100 text-black">
                      <td className="px-4 py-4 sm:px-6">{ user.username }</td>
                      <th scope="row" className="px-4 py-4 sm:px-6 font-medium whitespace-nowrap">{ user.name }</th>
                      <td className="px-4 py-4 sm:px-6">{ user.email }</td>
                      <td className="px-4 py-4 sm:px-6">{ user.category }</td>
                      <td className="px-4 py-4 sm:px-6">{ user.productId }</td>
                      <td className="px-4 py-4 sm:px-6">{ formatDate( user.timestamp ) }</td>
                      <td className="px-4 py-4 sm:px-6 text-center">{ user.action }</td>
                    </tr>
                  ) )
                ) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 pb-4 bg-white shadow-md">
        <div className="flex justify-center items-center">
          <button
            onClick={ () => handlePageChange( 1 ) }
            disabled={ currentPage === 1 }
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            First
          </button>
          <button
            onClick={ () => handlePageChange( currentPage - 1 ) }
            disabled={ currentPage === 1 }
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            &lt;
          </button>
          { renderPaginationNumbers() }
          <button
            onClick={ () => handlePageChange( currentPage + 1 ) }
            disabled={ currentPage === totalPages }
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            &gt;
          </button>
          <button
            onClick={ () => handlePageChange( totalPages ) }
            disabled={ currentPage === totalPages }
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};


export default Page;

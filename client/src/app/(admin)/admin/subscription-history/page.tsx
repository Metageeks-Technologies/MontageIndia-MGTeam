"use client";
import instance from "@/utils/axios";
import { Pagination, Button, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

interface Subscription
{
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  planId: {
    _id?:string;
    item:{
      name: string;
    }
  };
  startDate: string;
  endDate: string;
  status: string;
}

const Page = () =>
{
  const [ subscription, setSubscription ] = useState<Subscription[]>( [] );
  const [ currentPage, setCurrentPage ] = useState<number>( 1 );
  const [ dataPerPage, setDataPerPage ] = useState<number>( 6 );
  const [ searchTerm, setSearchTerm ] = useState<string>( "" );
  const [ totalPages, setTotalPages ] = useState<number>( 1 );
  const [ isLoading, setIsLoading ] = useState( false );

  const fetchSubscription = async () =>
  {
    setIsLoading( true );
    try
    {
      const response = await instance.get( `/subscription/history`, {
        params: {
          searchTerm,
          currentPage,
          dataPerPage,
        },
      } );
      setSubscription( response.data.subscriptionHistory );
      setTotalPages( response.data.totalPages );
      setIsLoading( false );
      console.log( "subscription", response );
    } catch ( error )
    {
      console.error( "Error fetching subscriptions:", error );
      setIsLoading( false );
    }

  };

  const handleSearch = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    setSearchTerm( e.target.value );
    setCurrentPage( 1 );
  };

  const handlePageChange = ( newPage: number ) =>
  {
    setCurrentPage( newPage );
  };

  const handleDataPerPageChange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    setDataPerPage( Number( e.target.value ) );
    setCurrentPage( 1 );
  };

  useEffect( () =>
  {
    fetchSubscription();
  }, [ currentPage, dataPerPage, searchTerm ] );

  return (
    <div className="container p-4 min-h-screen bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subscription History</h1>
      </div>

      {/* one horixonal line */ }
      <hr className="border-t border-gray-300 mb-4" />


      <div className="flex items-center justify-between space-x-2 mb-4">
        <div>

          <input
            type="text"
            placeholder="Search "
            value={ searchTerm }
            onChange={ handleSearch }
            className="border rounded px-4 py-2 flex-grow"
          />

        </div>



        <div className="mb-4">

          <select className="border rounded px-4 py-2" onChange={ handleDataPerPageChange } value={ dataPerPage }>
            <option value={ 6 }>6 Data per page</option>
            <option value={ 12 }>12 Data per page</option>
            <option value={ 24 }>24 Data per page</option>
          </select>
        </div>

      </div>

      <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Date
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            { isLoading ? (
              <tr>
                <td colSpan={ 7 } className="text-center py-4">
                  <Spinner label="Loading..." color="danger" />
                </td>
              </tr>
            ) : (
              subscription && subscription.length > 0 ? (
                subscription.map( ( item, index ) => (
                  <tr key={ index } className="hover:bg-gray-50">

                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <div className="text-sm font-medium text-gray-900">
                        { item.userId.name }
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <div className="text-sm text-gray-900">{ item.userId.email }</div>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <div className="text-sm text-gray-900">{ item.planId.item.name }</div>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <div className="text-sm text-gray-900">{ new Date( item.startDate ).toLocaleDateString() } </div>
                    </td>                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <div className="text-sm text-gray-900">{ item.endDate
                        ? new Date( item.endDate ).toLocaleDateString()
                        : "N/A" }</div>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-200 bg-white">
                      <span className={ `inline-flex items-center px-3  py-2.5 rounded-lg text-s font-bold ${ item.status === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-100 text-red-800'
                        }` }>
                        { item.status == "active" ? "Active" : "Inactive" }
                      </span>
                    </td>

                  </tr>
                ) )
              ) : (
                <tr>
                  <td colSpan={ 8 } className="text-center py-4">
                    <p className="text-gray-500">No Subscription History Found</p>
                  </td>
                </tr>
              )
            ) }
          </tbody>
        </table>
      </div>

      { totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p>Showing { ( dataPerPage * ( currentPage - 1 ) ) + 1 } to { dataPerPage * ( currentPage ) } of { totalPages * dataPerPage } Entries</p>

          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={ () => handlePageChange( currentPage - 1 ) }
              disabled={ currentPage === 1 }
            >
              &lt;
            </button>
            { [ ...Array( totalPages ) ].map( ( _, index ) => (
              <button
                key={ index }
                className={ `px-3 py-1 border rounded ${ currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-white'
                  }` }
                onClick={ () => handlePageChange( index + 1 ) }
              >
                { index + 1 }
              </button>
            ) ) }
            <button
              className="px-3 py-1 border rounded"
              onClick={ () => handlePageChange( currentPage + 1 ) }
              disabled={ currentPage === totalPages }
            >
              &gt;
            </button>
          </div>
        </div>
      ) }
    </div>
  );
};

export default Page;

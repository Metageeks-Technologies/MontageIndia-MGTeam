"use client"
import React, { useEffect, useMemo, useState } from "react";
import instance from "@/utils/axios";
import { Spinner, Button } from "@nextui-org/react";

interface UserActivity
{
  _id: string;
  name: string;
  productId: string;
  username: string;
  email: string;
  category: string[];
  action: string;
  timestamp: string;
}

const UserActivityPage = () =>
{
  const [ data, setData ] = useState<UserActivity[] | null>( null );
  const [ loading, setLoading ] = useState<boolean>( false );
  const [ currentPage, setCurrentPage ] = useState<number>( 1 );
  const [ totalPages, setTotalPages ] = useState<number>( 1 );
  const [ searchTerm, setSearchTerm ] = useState<string>( "" );
  const [ dataPerPage, setDataPerPage ] = useState<number>( 10 );
  const [ timeRange, setTimeRange ] = useState<string>( "all" );

  const fetchUsers = async () =>
  {
    setLoading( true );
    try
    {
      const response = await instance.get( `auth/admin/Activity/getAllActivity`, {
        params: { timeRange, dataPerPage, currentPage, searchTerm },
        withCredentials: true,
      } );
      setData( response.data.activities );
      setTotalPages( response.data.totalPages );
      setCurrentPage( response.data.currentPage );
    } catch ( error )
    {
      console.error( "Error fetching users:", error );
    } finally
    {
      setLoading( false );
    }
  };

  const capitalizeFirstLetter = ( str: string ): string =>
  {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
  };

  const formatDate = ( timestamp: any ) =>
    new Intl.DateTimeFormat( "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } ).format( new Date( timestamp ) );

  useEffect( () =>
  {
    fetchUsers();
  }, [ timeRange, dataPerPage, currentPage, searchTerm ] );

  const handlePageChange = ( newPage: number ) =>
  {
    setCurrentPage( newPage );
  };

  const handleTimeRange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    setTimeRange( e.target.value );
    setCurrentPage( 1 );
  };

  const handleDataPerPage = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    setDataPerPage( Number( e.target.value ) );
    setCurrentPage( 1 );
  };

  const totalCount = data?.length || 0;

  const renderPageButtons = () =>
  {
    const maxVisiblePages = 6;
    const halfVisiblePages = Math.floor( maxVisiblePages / 2 );

    let startPage = Math.max( currentPage - halfVisiblePages, 1 );
    let endPage = Math.min( startPage + maxVisiblePages - 1, totalPages );

    if ( endPage - startPage + 1 < maxVisiblePages )
    {
      startPage = Math.max( totalPages - maxVisiblePages + 1, 1 );
      endPage = totalPages;
    }

    const pageButtons = [];

    if ( startPage > 1 )
    {
      pageButtons.unshift(
        <button
          key="prev-pages"
          className="px-3 py-1 border rounded"
          onClick={ () => handlePageChange( 1 ) }
        >
          1
        </button>,
        <span key="prev-ellipsis" className="px-3 py-1">
          ...
        </span>
      );
    }

    for ( let page = startPage; page <= endPage; page++ )
    {
      pageButtons.push(
        <button
          key={ page }
          className={ `px-3 py-1 border rounded ${ currentPage === page ? "bg-red-500 text-white" : "bg-white"
            }` }
          onClick={ () => handlePageChange( page ) }
        >
          { page }
        </button>
      );
    }

    if ( endPage < totalPages )
    {
      pageButtons.push(
        <span key="next-ellipsis" className="px-3 py-1">
          ...
        </span>,
        <button
          key="next-pages"
          className="px-3 py-1 border rounded"
          onClick={ () => handlePageChange( totalPages ) }
        >
          { totalPages }
        </button>
      );
    }

    return pageButtons;
  };

  const totalCount_ = useMemo( () => totalCount, [ totalCount ] );
  const totalPages_ = useMemo( () => Math.ceil( totalCount_ / dataPerPage ), [
    totalCount_,
    dataPerPage,
  ] );

  return (
    <div className="container p-4 m-4 bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Activity</h1>
      </div>
      <hr className="border-t border-gray-300 mb-4" />
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search"
            value={ searchTerm }
            onChange={ ( e ) => setSearchTerm( e.target.value ) }
            onKeyDown={ ( e ) => e.key === "Enter" && fetchUsers() }
            className="border rounded px-4 py-2 flex-grow"
          />
          <div className="flex items-center flex-wrap gap-4">
            <div>
              <select
                className="border rounded px-4 py-2"
                onChange={ handleTimeRange }
                value={ timeRange }
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div>
              <select
                className="border rounded px-4 py-2"
                onChange={ handleDataPerPage }
                value={ dataPerPage }
              >
                <option value={ 10 }>10 Data per page</option>
                <option value={ 30 }>30 Data per page</option>
                <option value={ 50 }>50 Data per page</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-900">
              <thead className="text-xs text-gray-700 uppercase bg-pageBg">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    UserName
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                { loading ? (
                  <tr>
                    <td colSpan={ 7 } className="text-center py-4">
                      <Spinner label="Loading..." color="success" />
                    </td>
                  </tr>
                ) : data === null || data.length === 0 ? (
                  <tr>
                    <td colSpan={ 7 } className="text-center py-4">
                      <p>No Data Found</p>
                    </td>
                  </tr>
                ) : (
                  data.map( ( item ) => (
                    <tr
                      key={ item._id }
                      className="border-b hover:bg-gray-100 text-black"
                    >
                      <td className="px-4 py-4 sm:px-6">{ item.username }</td>
                      <th
                        scope="row"
                        className="px-4 py-4 sm:px-6 font-medium whitespace-nowrap"
                      >
                        { capitalizeFirstLetter( item.name ) }
                      </th>
                      <td className="px-4 py-4 sm:px-6">{ item.email }</td>
                      <td className="px-4 py-4 sm:px-6">
                        { item.category && item.category.length > 0
                          ? item.category.map( ( category, index ) => (
                            <span key={ index }>
                              { capitalizeFirstLetter( category ) }
                              { index < item.category.length - 1 ? ", " : "" }
                            </span>
                          ) )
                          : "" }
                      </td>
                      <td className="px-4 py-4 sm:px-6">{ item.productId }</td>
                      <td className="px-4 py-4 sm:px-6">
                        { formatDate( item.timestamp ) }
                      </td>
                      <td
                        className={ `px-4 py-4 sm:px-6 text-center ${ (item.action === 'create' || item.action == "created" )
                          ? 'text-[#8D529C]'
                          : item.action === 'Deleted'
                              ? 'text-red-700'
                              : item.action === 'update'
                              ? 'text-[#42A5D0]'
                                : ''
                          }` }
                      >
                        { capitalizeFirstLetter( item.action ) }
                      </td>

                    </tr>
                  ) )
                ) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      { totalPages_ > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p>
              Showing{ " " }
              { ( dataPerPage * ( currentPage - 1 ) ) + 1 } to { dataPerPage * ( currentPage ) } of { totalPages * dataPerPage } Entries
            </p>
          </div>
          <div className="flex items-center space-x-2">{ renderPageButtons() }</div>
        </div>
      ) }
    </div>
  );
};

export default UserActivityPage;
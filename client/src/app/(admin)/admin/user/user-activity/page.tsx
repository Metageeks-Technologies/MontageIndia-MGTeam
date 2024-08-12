"use client";
import instance from "@/utils/axios";
import { Spinner,Pagination,Button } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";

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
  const [ dataPerPage, setDataperPage] = useState<number>(6);
  const [ timeRange, setTimeRange] = useState<string>("all");

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
   const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

  useEffect( () =>
  {
    fetchUsers();
  }, [ timeRange, dataPerPage, currentPage] );

  const handlePageChange = ( newPage: number ) =>
  {
    setCurrentPage( newPage );
  };
  const handletimeRange=(e:any)=>{
    setTimeRange(e.target.value);
    setCurrentPage(1);
  }
  const handleDataperPage=(e:any)=>{
    setDataperPage(e.target.value);
    setCurrentPage(1);
  }

  const formatDate = ( timestamp: any ) => new Intl.DateTimeFormat( 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  } ).format( new Date( timestamp ) );

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Activity</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap my-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={( e ) => setSearchTerm( e.target.value )}
          onKeyDown={( e ) => e.key === "Enter" && fetchUsers()}
          className="border rounded px-4 py-2 w-full max-w-sm"
        />
         <div className="flex items-center flex-wrap gap-4 ">
        <div>
          <select className="border rounded px-4 py-2" onChange={( e ) => handletimeRange( e )} value={timeRange} >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
        <div>
          <select className="border rounded px-4 py-2" onChange={( e ) => handleDataperPage( e )} value={dataPerPage} >
            <option value={6} >6 Data per page</option>
            <option value={12}>12 Data per page</option>
            <option value={24}>24 Data per page</option>
          </select>
        </div>
      </div>
      </div>
  
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
                  (data===null || data.length === 0) ? (
                    <tr>
                    <td colSpan={ 7 } className="text-center py-4">
                      <p>No Data Found</p>
                    </td>
                  </tr>
                  ):
                  data && data.length>0 && data.map( ( item ) => (
                    <tr key={ item._id } className="border-b hover:bg-gray-100 text-black">
                      <td className="px-4 py-4 sm:px-6">{ item.username }</td>
                      <th scope="row" className="px-4 py-4 sm:px-6 font-medium whitespace-nowrap">{ capitalizeFirstLetter(item.name) }</th>
                      <td className="px-4 py-4 sm:px-6">{ item.email }</td>
                      <td className="px-4 py-4 sm:px-6"> 
                      { 
                          (item.category && item.category.length>0)?
                          item.category.map((category, index) => (
                              <span key={index}>
                                  {capitalizeFirstLetter(category)}
                                              {index < item.category.length - 1 ? ', ' : ''}
                              </span>
                          ))
                          : ''
                      } </td>
                      <td className="px-4 py-4 sm:px-6">{ item.productId }</td>
                      <td className="px-4 py-4 sm:px-6">{ formatDate( item.timestamp ) }</td>
                      <td className="px-4 py-4 sm:px-6 text-center">{ capitalizeFirstLetter(item.action) }</td>
                    </tr>
                  ) )
                ) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
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


export default UserActivityPage;

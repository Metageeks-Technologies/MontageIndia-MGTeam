'use client';
import { useState, useEffect, useMemo } from 'react';
import instance from '@/utils/axios';
import { Spinner, Pagination,Button } from '@nextui-org/react';
import Link from 'next/link';

interface User
{
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    mediaType: string[] ;
    category: string[] ;
}

export default function UserList ()
{
    const [ allAdmins, setAllAdmins ] = useState<User[]>( [] );
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ totalPages, setTotalPages] = useState(1);
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ dataPerPage, setDataPerPage] = useState(6);
    const [ roleSearch, setRoleSearch] = useState('all');
    const [ loading, setLoading ] = useState( false );

    useEffect( () =>
    {
        fetchUsers();
    }, [currentPage, dataPerPage,roleSearch] );

    const fetchUsers = async () =>
    {
        setLoading( true );
        try
        {
            const response = await instance.get( `auth/admin/getAllAdmin`, {
            params: {searchTerm,currentPage,dataPerPage,roleSearch},withCredentials: true } );
            setAllAdmins( response.data.admins );
            setTotalPages( response.data.totalPages );
        } catch ( error )
        {
            console.error( 'Error fetching users:', error );
        } finally
        {
            setLoading( false );
        }
    };
    const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleRoleSearch = ( e: React.ChangeEvent<HTMLSelectElement> ) =>{
        setRoleSearch(e.target.value);
        setCurrentPage(1);
    }
    const handlePageChange = ( newPage: number ) =>
    {
        setCurrentPage( newPage );
    };
    const handleDataperPage=(e:any)=>{
        setDataPerPage(e.target.value);
        setCurrentPage(1);
    }

    return (
        <div className="flex flex-col min-h-screen min-w-md">
            <div className="flex-grow p-6 md:p-0">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff List</h1>
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
                    <select className="border rounded px-4 py-2" onChange={( e ) => handleRoleSearch( e )} value={roleSearch} >
                        <option value="all">All Staff</option>
                        <option value="admin" >Admin / Staff</option>
                        <option value="superadmin">SuperAdmin</option>
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
                <div className="bg-white shadow-md rounded-lg ">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-900">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">UserName</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Media Type</th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell">Category</th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody >
                                { loading ? (
                                    <tr>
                                        <td colSpan={ 6 } className="text-center py-4">
                                            <Spinner label="Loading..." color="success" />
                                        </td>
                                    </tr>
                                ) : (
                                    (allAdmins===null || allAdmins.length === 0) ? (
                                            <tr>
                                            <td colSpan={ 7 } className="text-center py-4">
                                            <p>No Data Found</p>
                                            </td>
                                        </tr>
                                        ):
                                    allAdmins && allAdmins.length>0 && 
                                   allAdmins.map( ( user ) => (
                                        <tr key={ user._id } className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                { capitalizeFirstLetter( user.name ) }
                                            </th>
                                            <td className="px-6 py-4">{ capitalizeFirstLetter( user.username ) }</td>
                                            <td className="px-6 py-4">{ capitalizeFirstLetter( user.email ) }</td>
                                            <td className="px-6 py-4">{ capitalizeFirstLetter(user.role) }</td>
                                            <td className="px-6 py-4 hidden md:table-cell">{(user.mediaType && user.mediaType.length>0)
                                                ? user.mediaType.map((mediaType, index) => (
                                                    <span key={index}>
                                                        {capitalizeFirstLetter(mediaType)}
                                                                    {index < user.mediaType.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                                : ''}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">{ 
                                                (user.category && user.category.length>0)?
                                                user.category.map((category, index) => (
                                                    <span key={index}>
                                                        {capitalizeFirstLetter(category)}
                                                                    {index < user.category.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                                : ''
                                            }</td>
                                           <td className="px-6 py-4 text-center">
                                                <Link href={ `/admin/user/userList/${ user._id }` } className="bg-slate-200 text-gray-600 hover:bg-slate-300 px-6 py-0.5 text-center rounded-lg">
                                                    Edit
                                                </Link>
                                            </td>
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
}
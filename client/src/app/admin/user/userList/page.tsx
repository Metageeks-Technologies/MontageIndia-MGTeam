'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';

interface User
{
    _id: string;
    name: string;
    email: string;
    role: string;
    mediaType: string;
    category: string;
}

export default function UserList ()
{
    const [ allUsers, setAllUsers ] = useState<User[]>( [] );
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ loading, setLoading ] = useState( false );
    const router = useRouter();
    const usersPerPage = 10;

    useEffect( () =>
    {
        fetchUsers();
    }, [] );

    const fetchUsers = async () =>
    {
        setLoading( true );
        try
        {
            const response = await instance.get( `auth/admin/getAllAdmin`,{withCredentials: true } );
            setAllUsers( response.data.users );
        } catch ( error )
        {
            console.error( 'Error fetching users:', error );
        } finally
        {
            setLoading( false );
        }
    };

    const paginatedUsers = useMemo( () =>
    {
        const startIndex = ( currentPage - 1 ) * usersPerPage;
        return allUsers.slice( startIndex, startIndex + usersPerPage );
    }, [ allUsers, currentPage ] );

    const totalPages = useMemo( () => Math.ceil( allUsers.length / usersPerPage ), [ allUsers ] );

    const handleEditClick = ( userId: string ) =>
    {
        router.push( `/admin/user/userList/${ userId }` );
    };

    const handlePageChange = ( newPage: number ) =>
    {
        setCurrentPage( newPage );
    };

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
        <div className="container mx-auto p-4 sm:pl-64 h-full">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="overflow-x-scroll lg:overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className='border'>
                                <th scope="col" className="px-4 py-3 sm:px-6">Name</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">Email</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">Role</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">Media Type</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">Category</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { loading ? (
                                <tr>
                                    <td colSpan={ 6 } className="text-center py-4">Loading...</td>
                                </tr>
                            ) : (
                                paginatedUsers.map( ( user ) => (
                                    <tr key={ user._id } className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-4 py-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { user.name }
                                        </th>
                                        <td className="px-4 py-4 sm:px-6">{ user.email }</td>
                                        <td className="px-4 py-4 sm:px-6">{ user.role }</td>
                                        <td className="px-4 py-4 sm:px-6">{ user.mediaType }</td>
                                        <td className="px-4 py-4 sm:px-6">{ user.category }</td>
                                        <td className="px-4 py-4 sm:px-6 text-right">
                                            <button
                                                onClick={ ( e ) =>
                                                {
                                                    e.preventDefault();
                                                    handleEditClick( user._id );
                                                } }
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ) )
                            ) }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Numbered Pagination controls */ }
            <div className="fixed bottom-4 pb-4 left-0 right-0 bg-white shadow-md">

                <div className="flex justify-center items-center mt-4">
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
}
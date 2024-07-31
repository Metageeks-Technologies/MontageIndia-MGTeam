'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';

interface User
{
    _id: string;
    name: string;
    email: string;
    role: string;
    mediaType: string[] ;
    category: string[] ;
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
            const response = await instance.get( `auth/admin/getAllAdmin`, { withCredentials: true } );
            setAllUsers( response.data.users );
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
        <div className="flex flex-col h-full bg-gray-100 min-w-md">
            <div className="flex-grow p-6 md:p-0">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">User List</h1>
                <div className="bg-white shadow-md rounded-lg ">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-900">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Media Type</th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell">Category</th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
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
                                    paginatedUsers.map( ( user ) => (
                                        <tr key={ user._id } className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                { capitalizeFirstLetter( user.name ) }
                                            </th>
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
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={ ( e ) =>
                                                    {
                                                        e.preventDefault();
                                                        handleEditClick( user._id );
                                                    } }
                                                    className="font-medium text-blue-600 hover:underline"
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
            </div>

            {/* Pagination controls */ }
            <div className="bg-white shadow-md py-4">
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
}
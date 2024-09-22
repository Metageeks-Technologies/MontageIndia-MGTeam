'use client';
import { useState, useEffect, useMemo } from 'react';
import instance from '@/utils/axios';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { FaTrashRestoreAlt } from 'react-icons/fa';
import { SpinnerLoader } from '@/components/loader/loaders';
import * as XLSX from 'xlsx';

interface User
{
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    mediaType: string[];
    category: string[];
    isDeleted:boolean;  
}

export default function UserList ()
{
    const [ allAdmins, setAllAdmins ] = useState<User[]>( [] );
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ totalPages, setTotalPages ] = useState( 1 );
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ dataPerPage, setDataPerPage ] = useState( 6 );
    const [ roleSearch, setRoleSearch ] = useState( 'all' );
    const [loading, setLoading] = useState( false );
    const [isExporting, setIsExporting] = useState( false );

    useEffect( () =>
    {
        fetchUsers();
    }, [ currentPage, dataPerPage, roleSearch ] );

    const fetchUsers = async () =>
    {
        setLoading( true );
        try
        {
            const response = await instance.get( `auth/admin/getAllAdmin`, {
                params: { searchTerm, currentPage, dataPerPage, roleSearch }, withCredentials: true
            } );
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
    const capitalizeFirstLetter = ( str: string ): string =>
    {
        return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
    };

    const handleRoleSearch = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
    {
        setRoleSearch( e.target.value );
        setCurrentPage( 1 );
    };
    const handlePageChange = ( newPage: number ) =>
    {
        setCurrentPage( newPage );
    };
    const handleDataperPage = ( e: any ) =>
    {
        setDataPerPage( e.target.value );
        setCurrentPage( 1 );
    };

    const handleDelete = async ( id: string ) =>
    {
        const result = await Swal.fire( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        } );

        if ( result.isConfirmed )
        {
            try
            {
                const response = await instance.delete( `/auth/admin/${ id }` );
                if ( response.data )
                {
                    console.log("response :-",response.data)
                    Swal.fire( {
                        icon: 'success',
                        title: `${response?.data?.title} !!`,
                        text: `${response?.data?.message}`,
                        confirmButtonColor: '#3085d6',
                    } );
                    fetchUsers();
                }
            } catch ( error: any )
            {
                Swal.fire( {
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'An error occurred while deleting the user.',
                    confirmButtonColor: '#3085d6',
                } );
                console.error( 'Error deleting user:', error );
            }
        }
    }; 

    const ExportUsersList = async () => {
        setIsExporting( true );
        // get all data from the database
        const response = await instance.get( `auth/admin/getAllAdmin`, {
            params: { searchTerm:"", currentPage:1, dataPerPage:1000, roleSearch:"" }, withCredentials: true
        } );
        const ws = XLSX.utils.json_to_sheet( response.data.admins ); 
        const wb = XLSX.utils.book_new(); 
        XLSX.utils.book_append_sheet( wb, ws, "UsersList" ); 

        // Generate Excel file and trigger download
        XLSX.writeFile( wb, "UsersList.xlsx" );
        setIsExporting( false );
    };
    

    return (
        <div className="container p-4 min-h-screen bg-pureWhite-light rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Staff List</h1>
                <button
                    className={`px-4 py-2 bg-red-500 text-white rounded ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                        }`}
                    onClick={ExportUsersList}
                    disabled={isExporting}
                >
                    {isExporting ? "Exporting user list..." : "Export User List"}
                </button>
            </div>
            {/* one horixonal line */ }
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
                    <div className="flex items-center flex-wrap gap-4 ">
                        <div>
                            <select className="border rounded px-4 py-2" onChange={ ( e ) => handleRoleSearch( e ) } value={ roleSearch } >
                                <option value="all">All Staff</option>
                                <option value="admin" >Admin / Staff</option>
                                <option value="superadmin">SuperAdmin</option>
                            </select>
                        </div>
                        <div>
                            <select className="border rounded px-4 py-2" onChange={ ( e ) => handleDataperPage( e ) } value={ dataPerPage } >
                                <option value={ 6 } >6 Data per page</option>
                                <option value={ 12 }>12 Data per page</option>
                                <option value={ 24 }>24 Data per page</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg ">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-900">
                            <thead className="text-xs text-gray-700 uppercase bg-pageBg">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">UserName</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Media Type</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell"> Action</th>

                                </tr>
                            </thead>
                            <tbody >
                                { loading ? (
                                    <tr>
                                        <td colSpan={ 6 } className="text-center py-4">
                                            <SpinnerLoader />
                                        </td>
                                    </tr>
                                ) : (
                                    ( allAdmins === null || allAdmins.length === 0 ) ? (
                                        <tr>
                                            <td colSpan={ 7 } className="text-center py-4">
                                                <p>No Data Found</p>
                                            </td>
                                        </tr>
                                    ) :
                                        allAdmins && allAdmins.length > 0 &&
                                        allAdmins.map( ( user ) => (
                                            <tr key={ user._id } className="bg-white border-b hover:bg-gray-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    { capitalizeFirstLetter( user.name ) }
                                                </th>
                                                <td className="px-6 py-4">{ user.username }</td>
                                                <td className="px-6 py-4">{ user.email }</td>
                                                <td className="px-6 py-4">{ capitalizeFirstLetter( user.role ) }</td>
                                                <td className="px-6 py-4 hidden md:table-cell">{ ( user.mediaType && user.mediaType.length > 0 )
                                                    ? user.mediaType.map( ( mediaType, index ) => (
                                                        <span key={ index }>
                                                            { capitalizeFirstLetter( mediaType ) }
                                                            { index < user.mediaType.length - 1 ? ', ' : '' }
                                                        </span>
                                                    ) )
                                                    : '' }</td>


                                                <td className="px-4 py-4 border-b border-gray-200 bg-white">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <Link href={ `/admin/user/userList/${ user._id }` } className="text-blue-600 hover:text-blue-900">
                                                            <img src="/images/editIcon.png" alt="Edit" className="w-6 h-6" />
                                                        </Link>

                                                        <button className="text-red-600 hover:text-red-900"
                                                            onClick={ () => handleDelete( user._id ) }
                                                            
                                                            >
                                                            { user?.isDeleted ?
                                                                <FaTrashRestoreAlt className="w-6 h-6" title='Restore the User' />
                                                                :
                                                                <img title='Delete the User' src="/images/deleteIcon.png" alt="Delete" className="w-6 h-6" />

                                                            }
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) )
                                ) }
                            </tbody>
                        </table>
                    </div>
                </div>
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
} 

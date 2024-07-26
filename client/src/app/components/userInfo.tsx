'use client';
// components/UserList.tsx
import { useState, useEffect } from 'react';
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
    const [ users, setUsers ] = useState<User[]>( [] );
    const router = useRouter();

    useEffect( () =>
    {
        const fetchUsers = async () =>
        {
            try
            {
                const response = await instance( `auth/admin/getAllAdmin` )
                console.log( "all users:", response.data );
                setUsers( response.data.users );
            } catch ( error )
            {
                console.error( 'Error fetching users:', error );
            }
        };

        fetchUsers();
    }, [] );

    const handleEditClick = ( userId: string ) =>
    {
        router.push( `/admin/dashboard/${ userId }` );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Media Type</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { users?.map( ( user ) => (
                            <tr key={ user._id } className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    { user.name }
                                </th>
                                <td className="px-6 py-4">{ user.email }</td>
                                <td className="px-6 py-4">{ user.role }</td>
                                <td className="px-6 py-4">{ user.mediaType }</td>
                                <td className="px-6 py-4">{ user.category }</td>
                                <td className="px-6 py-4 text-right">
                                    <td

                                        onClick={ ( e ) =>
                                        {
                                            e.preventDefault();
                                            handleEditClick( user._id );
                                        } }
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </td>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </div>
        </div >
    );
}
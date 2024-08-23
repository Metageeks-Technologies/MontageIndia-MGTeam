'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';
import { Spinner } from '@nextui-org/react';
import { FiUser, FiMail, FiTag, FiFilm, FiEdit2, FiLock } from 'react-icons/fi';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Swal from 'sweetalert2';

interface User
{
    id: string;
    name: string;
    email: string;
    role: string;
    username: string;
    mediaType: string[];
    category: string[];
    _id: string;
}

export default function UserDetails ( { params }: { params: { id: string; }; } )
{
    const [ user, setUser ] = useState<User | null>( null );
    const [ isEditing, setIsEditing ] = useState( false );
    const router = useRouter();

    useEffect( () =>
    {
        fetchUser();
    }, [] );

    const capitalizeFirstLetter = ( str: string ): string =>
    {
        return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
    };

    const fetchUser = async () =>
    {
        try
        {
            const response = await instance.get( `/auth/admin/getCurrAdmin`, { withCredentials: true } );
            if ( response.data && response.data.user )
            {
                setUser( response.data.user );
            }
        } catch ( error )
        {
            console.error( 'Error fetching user:', error );
            notifyError( "Failed to fetch user data" );
        }
    };

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        if ( user )
        {
            setUser( { ...user, [ e.target.name ]: e.target.value } );
        }
    };

    const handleUpdate = async () =>
    {
        if ( !user ) return;
        try
        {
            const updatedUser = { ...user, id: user._id };
            const response = await instance.patch( `/auth/admin/updateAdminDetails/`, updatedUser, { withCredentials: true } );
            if ( response.data.success && response.data.admin )
            {
                setUser( response.data.user );
                setIsEditing( false );
                // notifySuccess( response.data.message );
                Swal.fire( {
                    icon: 'success',
                    title: 'User updated successfully',
                    text: response.data.message,
                    confirmButtonText: 'OK',

                } );
            }
        } catch ( error: any )
        {
            // notifyError( error.response?.data?.message || "There was an error updating the profile" );
            Swal.fire( {
                icon: 'error',
                title: 'Error updating user',
                text: error.response?.data?.message || "There was an error updating the profile",
                confirmButtonText: 'OK', 
            } );
            console.error( 'Error updating user:', error );
        }
    };

    if ( !user ) return (
        <div className="flex justify-center items-center h-screen">
            <Spinner label="Loading..." color="success" />
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-webgreen to-webgreenHover-light px-6 py-4">
                        <h1 className="text-3xl font-bold text-white text-center">Your Profile</h1>
                    </div>
                    <div className="p-6">
                        <div className="mb-8 text-center">
                            <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                                { user.name.charAt( 0 ) }
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold">{ user.name }</h2>
                            <p className="text-gray-600 text-md italic">@{ user.username }</p>
                            <p className="text-gray-600 text-md">{ user.email }</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            { [ 'name', 'email', 'role', 'mediaType', 'category' ].map( ( key ) => (
                                <div key={ key } className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1 capitalize flex items-center">
                                        { key === 'name' && <FiUser className="mr-2" /> }
                                        { key === 'email' && <FiMail className="mr-2" /> }
                                        { key === 'role' && <MdOutlineAdminPanelSettings className="mr-2" /> }
                                        { key === 'mediaType' && <FiFilm className="mr-2" /> }
                                        { key === 'category' && <FiTag className="mr-2" /> }
                                        { key.replace( /([A-Z])/g, ' $1' ).trim() }
                                    </label>
                                    { isEditing && ( key === 'name' || key === 'email' ) ? (
                                        <input
                                            name={ key }
                                            value={ user[ key as keyof User ] }
                                            onChange={ handleInputChange }
                                            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                        />
                                    ) : (
                                        <p className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md">
                                            { Array.isArray( user[ key as keyof User ] )
                                                ? ( user[ key as keyof User ] as string[] ).map( capitalizeFirstLetter ).join( ', ' )
                                                : capitalizeFirstLetter( user[ key as keyof User ] as string ) }
                                        </p>
                                    ) }
                                </div>
                            ) ) }
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={ () => router.push( `/admin/profile/${ user._id }` ) }
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                            >
                                <FiLock className="mr-2" /> Change Password
                            </button>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                        { isEditing ? (
                            <>
                                <button
                                    onClick={ handleUpdate }
                                    className="px-4 py-2 bg-webgreen text-white rounded-md hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-webgreen transition-colors duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={ () => { setIsEditing( false ); fetchUser(); } }
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={ () => setIsEditing( true ) }
                                className="flex items-center px-4 py-2 bg-webgreen text-white rounded-md hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-webgreen transition-colors duration-300"
                            >
                                <FiEdit2 className="mr-2" /> Edit Profile
                            </button>
                        ) }
                    </div>
                </div>
            </div>
        </div>
    );
}
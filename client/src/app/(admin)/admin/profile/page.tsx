'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';
import { Spinner } from '@nextui-org/react';
import { FiUser, FiMail, FiTag, FiFilm, FiEdit2, FiLock } from 'react-icons/fi';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {SpinnerLoader} from '@/components/loader/loaders';

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

interface PasswordChangeFormProps
{
    onCancel: () => void;
    id:string
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ( { onCancel, id } ) =>
{
    const [ oldPassword, setOldPassword ] = useState( '' );
    const [ newPassword, setNewPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ showOldPassword, setShowOldPassword ] = useState( false );
    const [ showNewPassword, setShowNewPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );
    const [ error, setError ] = useState( '' );

    const togglePasswordVisibility = ( field: 'oldPassword' | 'newPassword' | 'confirmPassword' ) =>
    {
        switch ( field )
        {
            case 'oldPassword':
                setShowOldPassword( !showOldPassword );
                break;
            case 'newPassword':
                setShowNewPassword( !showNewPassword );
                break;
            case 'confirmPassword':
                setShowConfirmPassword( !showConfirmPassword );
                break;
        }
    };

    const handleChangePassword = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setError( '' );

        if ( newPassword !== confirmPassword )
        {
            setError( 'New passwords do not match' );
            return;
        }

        if ( newPassword.length < 8 )
        {
            setError( 'New password must be at least 8 characters long' );
            return;
        }

        try
        {
            const response = await instance.patch(
                '/auth/admin/changePassword',
                {
                    id,
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log( "Password change success:", response );
            // setSuccess( 'Password changed successfully. You will be redirected to the profile page soon.' );

            Swal.fire( {
                icon: 'success',
                title: 'Password changed successfully',
                text: 'You will be redirected to the profile page soon.',
                timer: 2000,
                showConfirmButton: false
            } );

            onCancel(); // Close the password change form
        } catch ( error: any )
        {
            console.error( 'Password change error:', error );
            setError( error?.response?.data?.message || 'An error occurred while changing the password. Please try again.' );
        }
    };

    return (
        <form onSubmit={ handleChangePassword } className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            { [
                { field: 'oldPassword', state: oldPassword, setState: setOldPassword, show: showOldPassword },
                { field: 'newPassword', state: newPassword, setState: setNewPassword, show: showNewPassword },
                { field: 'confirmPassword', state: confirmPassword, setState: setConfirmPassword, show: showConfirmPassword }
            ].map( ( { field, state, setState, show } ) => (
                <div key={ field } className="relative col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{ field.replace( /([A-Z])/g, ' $1' ).replace( /^./, ( str ) => str.toUpperCase() ) }</label>
                    <input
                        type={ show ? "text" : "password" }
                        value={ state }
                        onChange={ ( e ) => setState( e.target.value ) }
                        placeholder={ field.replace( /([A-Z])/g, ' $1' ).replace( /^./, ( str ) => str.toUpperCase() ) }
                        className="w-full p-2 border rounded-md bg-pageBg-light"
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center"
                        onClick={ () => togglePasswordVisibility( field as 'oldPassword' | 'newPassword' | 'confirmPassword' ) }
                    >
                        { show ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" /> }
                    </button>
                </div>
            ) ) }

            { error && <div className="text-red-500 text-sm col-span-2">{ error }</div> }

            <div className="col-span-2 flex justify-end space-x-2">
                <button type="submit" className="px-4 py-2 bg-webgreen text-white rounded-md hover:bg-webgreenHover">
                    Change Password
                </button>
                <button type="button" onClick={ onCancel } className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>

    );
};

export default function UserDetails ( { params }: { params: { id: string; }; } )
{
    const [ user, setUser ] = useState<User | null>( null );
    const [ isEditing, setIsEditing ] = useState( false );
    const [ passChange, setPassChange ] = useState( false );
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
                Swal.fire( {
                    icon: 'success',
                    title: 'User updated successfully',
                    text: response.data.message,
                    confirmButtonText: 'OK',
                } );
            }
        } catch ( error: any )
        {
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
            <SpinnerLoader />
        </div>
    );

    return (
        <div className="container p-4 m-4 bg-pureWhite-light rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Profile</h1>
            </div>
            <hr className="border-t border-gray-300 mb-4" />
            <div>
                <div className="p-6">
                    <div className="flex mb-8  justify-start bg-pageBg-light rounded-lg">
                        <div className=" bg-gray-300 rounded-full  text-4xl font-bold text-white m-4 ">
                            <p className='flex items-center justify-center h-32 w-32'>
                                { user.name.charAt( 0 ) }
                            </p>
                        </div>
                        <div className=' text-start p-5'>
                            <h2 className="mt-4 text-2xl font-semibold">{ user.name }</h2>
                            <p className="text-gray-600 text-md italic">@{ user.username }</p>
                            <p className="text-gray-600 text-md">{ user.email }</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        { [ 'name', 'email', 'role', 'mediaType' ].map( ( key ) => (
                            <div key={ key } className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1 capitalize flex items-center">
                                    { key === 'name' && <FiUser className="mr-2" /> }
                                    { key === 'email' && <FiMail className="mr-2" /> }
                                    { key === 'role' && <MdOutlineAdminPanelSettings className="mr-2" /> }
                                    { key === 'mediaType' && <FiFilm className="mr-2" /> }
                                    {/* { key === 'category' && <FiTag className="mr-2" /> } */}
                                    { key.replace( /([A-Z])/g, ' $1' ).trim() }
                                </label>
                                { isEditing && ( key === 'name' || key === 'email' ) ? (
                                    <input
                                        name={ key }
                                        value={ user[ key as keyof User ] as string }
                                        onChange={ handleInputChange }
                                        className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 bg-pageBg-light"
                                    />
                                ) : (
                                    <p className="mt-1 block w-full py-2 px-3  rounded-md bg-pageBg-light">
                                        { Array.isArray( user[ key as keyof User ] )
                                            ? ( user[ key as keyof User ] as string[] ).map( capitalizeFirstLetter ).join( ', ' )
                                            : capitalizeFirstLetter( user[ key as keyof User ] as string ) }
                                    </p>
                                ) }
                            </div>
                        ) ) }
                    </div>

                    { passChange ? (
                        <PasswordChangeForm onCancel={ () => setPassChange( false ) } id={user._id} />
                    ) : (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={ () => setPassChange( true ) }
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                            >
                                <FiLock className="mr-2" /> Change Password
                            </button>
                        </div>
                    ) }
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
    );
}
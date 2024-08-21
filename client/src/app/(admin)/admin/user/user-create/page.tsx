'use client';

import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { adminRolesOptions, categoriesOptions, mediaTypesOptions } from "@/utils/tempData";
interface User
{
    name: string;
    email: string;
    password: string;
    role: string;
    username: string;
    mediaType: string[];
    category: string[];
}

const UserCreate: React.FC = () =>
{
    const router = useRouter();
    const [ user, setUser ] = useState<User>( {
        name: '',
        email: '',
        role: '',
        password: '',
        username: '',
        mediaType: [],
        category: [],
    } );
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [ selectedMediaTypes, setSelectedMediaTypes ] = useState<string[]>( [] );
    const [ error, setError ] = useState<string | null>( null );

    useEffect( () =>
    {
        setError( null );
    }, [ user ] );

    //     const onSelectCategory = (selectedList: string[]) => {
    //     setSelectedCategories(selectedList);
    //     const lowerCaseList = selectedList.map(item => item.toLowerCase());
    //     setUser(prevUser => ({
    //             ...prevUser,
    //             category: lowerCaseList,
    //         }));

    //   };

    //   const onRemoveCategory = (selectedList: string[]) => {
    //     setSelectedCategories(selectedList);
    //     const lowerCaseList = selectedList.map(item => item.toLowerCase());
    //     setUser(prevUser => ({
    //             ...prevUser,
    //             category: lowerCaseList,
    //         }));
    //   };

    const onSelectMediaType = ( selectedList: string[] ) =>
    {
        setSelectedMediaTypes( selectedList );
        const lowerCaseList = selectedList.map( item => item.toLowerCase() );
        setUser( prevUser => ( {
            ...prevUser,
            mediaType: lowerCaseList,
        } ) );
    };

    const onRemoveMediaType = ( selectedList: string[] ) =>
    {
        setSelectedMediaTypes( selectedList );
        const lowerCaseList = selectedList.map( item => item.toLowerCase() );
        setUser( prevUser => ( {
            ...prevUser,
            mediaType: lowerCaseList,
        } ) );
    };

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) =>
    {
        setUser( { ...user, [ e.target.name ]: e.target.value } );
    };

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        if ( !user.name || !user.email || !user.role || !user.password || !user.username || user.mediaType.length === 0 )
        {
            setError( "Please fill all the required fields" );
            return;
        }
        try
        {
            const response = await instance.post( '/auth/admin/createAdmin', user, { withCredentials: true } );
            setUser( {
                name: '',
                email: '',
                role: '',
                password: '',
                username: '',
                mediaType: [],
                category: [],
            } );
            // setSelectedCategories([]);
            setSelectedMediaTypes( [] );
            notifySuccess( "New user created successfully" );
            router.push( "/admin/dashboard" );
        } catch ( error: any )
        {
            console.log( "error in creating the user :-", error );
            setError( error.response.data.message );

        }
    };

    return (
        <div className="container p-4 m-4 bg-pureWhite-light rounded-md">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Create User</h1>
            </div>
            {/* one horixonal line */ }
            <hr className="border-t border-gray-300 mb-4" />
            <div >

                <form onSubmit={ handleSubmit } className="bg-pureWhite-light  rounded-lg p-8 w-full mx-auto ">
                    <div className='flex justify-start items-center'>
                        { error && <p className="text-red-500 font-bold">{ error }</p> }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name  <span className="text-red-500">*</span> </label>
                            <input required
                                type="text"
                                id="name"
                                name="name"
                                value={ user.name }
                                onChange={ handleChange }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email  <span className="text-red-500">*</span></label>
                            <input required
                                type="email"
                                id="email"
                                name="email"
                                value={ user.email }
                                onChange={ handleChange }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username  <span className="text-red-500">*</span></label>
                            <input
                                type="text" required
                                id="username"
                                name="username"
                                value={ user.username }
                                onChange={ handleChange }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password  <span className="text-red-500">*</span></label>
                            <input required
                                type="password"
                                id="password"
                                name="password"
                                value={ user.password }
                                onChange={ handleChange }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role  <span className="text-red-500">*</span></label>
                            <select required
                                id="role"
                                name="role"
                                value={ user.role }
                                onChange={ handleChange }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            >
                                <option value="">Select Role</option>
                                { adminRolesOptions.map( ( adminRole, index ) => (
                                    <option value={ adminRole.value } key={ index }>{ adminRole.name }</option>
                                ) ) }
                            </select>
                        </div>
                        <div>
                            <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">Media Type  <span className="text-red-500">*</span></label>
                            <Multiselect
                                avoidHighlightFirstOption
                                showArrow
                                id="mediaType"
                                options={ mediaTypesOptions.map( ( option ) => ( { name: option.name, value: option.value } ) ) }
                                selectedValues={ selectedMediaTypes.map( ( type ) => ( { name: type } ) ) }
                                onSelect={ ( selectedList ) => onSelectMediaType( selectedList.map( ( item: any ) => item.name ) ) }
                                onRemove={ ( selectedList ) => onRemoveMediaType( selectedList.map( ( item: any ) => item.name ) ) }
                                showCheckbox
                                displayValue="name"
                                style={ {
                                    chips: {
                                        background: '#EFEBE9'
                                    },
                                    searchBox: {
                                        background: '#EFEBE9',
                                        border: '1px solid #e5e7eb',
                                    }
                                } }
                            />
                        </div>
                       
                    </div>
                    <div className="mt-8 text-right">
                        <button
                            type="submit"
                            className=" px-4 py-2 text-white bg-safRed hover:bg-safRed rounded-md transition duration-300 ease-in-out focus:outline-none  focus:ring-offset-2 "
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreate;
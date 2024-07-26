'use client';

import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface User
{
    name: string;
    email: string;
    password: string;
    role: string;
    username: string;
    mediaType: string;
    category: string;
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
        mediaType: '',
        category: '',
    } );

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        setUser( { ...user, [ e.target.name ]: e.target.value } );
    };

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();

        console.log( user );
        try
        {
            const response = await instance.post( '/auth/admin/createAdmin', user );
            console.log( response );
            setUser( {
                name: '',
                email: '',
                role: '',
                password: '',
                username: '',
                mediaType: '',
                category: '',
            } );
            notifySuccess( "New user created succesfull" );
            router.push( "/admin/dashboard" );
        } catch ( error )
        {
            console.log( "error in creating the user :-", error );
        }

        // You can add further logic to submit the data to an API
    };

    return (
        <form onSubmit={ handleSubmit } className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create User</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={ user.name }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={ user.email }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={ user.username }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="id" className="block text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={ user.password }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700">Role</label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={ user.role }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="mediaType" className="block text-gray-700">Media Type</label>
                <input
                    type="text"
                    id="mediaType"
                    name="mediaType"
                    value={ user.mediaType }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700">Category</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={ user.category }
                    onChange={ handleChange }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Create User
            </button>
        </form>
    );
};

export default UserCreate;

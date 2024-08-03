'use client';

import React, { useState, useEffect } from 'react';
import instance from '@/utils/axios';
import Image from 'next/image';
import { notifySuccess } from '@/utils/toast';

interface Category
{
    id: number;
    name: string;
    description: string;
    logo?: string;
}

const CategoriesPage: React.FC = () =>
{
    const [ categories, setCategories ] = useState<Category[]>( [] );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ name, setName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ logo, setLogo ] = useState<File | null>( null );
    const [ editingCategory, setEditingCategory ] = useState<Category | null>( null );
    useEffect( () =>
    {
        fetchCategories();
    }, [] );

    const fetchCategories = async () =>
    {
        try
        {
            const response = await instance.get( '/field/category' );
            setCategories( response.data.categories );
        } catch ( error )
        {
            console.error( 'Error fetching categories:', error );
        }
    };

    const handleSubmit = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        try
        {
            if ( editingCategory )
            {
                await instance.put( `/field/category/${ editingCategory.id }`, { name, description } );
            } else
            {
                await instance.post( '/field/category', { category: name, description } );
            }
            setIsModalOpen( false );
            notifySuccess("category added successfully")
            setEditingCategory( null );
            setName( '' );
            setDescription( '' );
            fetchCategories();
        } catch ( error )
        {
            console.error( 'Error saving category:', error );
        }
    };

    const handleEdit = ( category: Category ) =>
    {
        setEditingCategory( category );
        setName( category.name );
        setDescription( category.description );
        setLogo( null ); // Reset logo when editing
        setIsModalOpen( true );
    };

    const handleDelete = async ( id: number ) =>
    {
        if ( window.confirm( 'Are you sure you want to delete this category?' ) )
        {
            try
            {
                await instance.delete( `/field/category/${ id }` );
                fetchCategories();
            } catch ( error )
            {
                console.error( 'Error deleting category:', error );
            }
        }
    };

    const openModal = () =>
    {
        setEditingCategory( null );
        setName( '' );
        setLogo( null );
        setDescription( '' );
        setIsModalOpen( true );
    };

    const handleLogoChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        if ( e.target.files && e.target.files[ 0 ] )
        {
            setLogo( e.target.files[ 0 ] );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Categories</h1>
                <button
                    onClick={ openModal }
                    className="bg-webgreen text-white py-2 px-6 rounded-full hover:bg-webgreenHover transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-webgreen-dark focus:ring-opacity-50"
                >
                    Add New Category
                </button>
            </div>

            { isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{ editingCategory ? 'Edit' : 'Add' } Category</h3>
                            <button
                                onClick={ () => setIsModalOpen( false ) }
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <form onSubmit={ handleSubmit } className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={ name }
                                        onChange={ ( e ) => setName( e.target.value ) }
                                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Image</label>
                                    <input
                                        type="file"
                                        id="logo"
                                        onChange={ handleLogoChange }
                                        className="mt-1 p-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
                                        accept="image/*"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        value={ description }
                                        onChange={ ( e ) => setDescription( e.target.value ) }
                                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        rows={ 3 }
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-webgreen text-white font-medium rounded-md hover:bg-webgreenHover-light focus:outline-none focus:ring-2 focus:ring-webgreen focus:ring-opacity-50 transition duration-300 ease-in-out"
                                >
                                    { editingCategory ? 'Update' : 'Create' } Category
                                </button>
                            </form>
                            { editingCategory && (
                                <button
                                    className="mt-3 w-full px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                                    onClick={ () => setIsModalOpen( false ) }
                                >
                                    Delete
                                </button>
                            ) }
                        </div>
                    </div>
                </div>
            ) }

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Category name</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { categories.map( ( category ) => (
                                <tr key={ category.id } className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <Image
                                            src={ category?.logo || '/placeholder-image.jpg' }
                                            alt={ `${ category.name } logo` }
                                            width={ 50 }
                                            height={ 50 }
                                            className="rounded-full"
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        { category.name }
                                    </th>
                                    <td className="px-6 py-4">{ category.description }</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={ () => handleEdit( category ) } className="font-medium text-blue-600 hover:underline">
                                            Edit
                                        </button>
                                        <button
                                            onClick={ () => handleDelete( category.id ) }
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
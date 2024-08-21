'use client';

import React, { useState, useEffect, useRef } from 'react';
import instance from '@/utils/axios';
import Image from 'next/image';
import { notifyError, notifySuccess } from '@/utils/toast';

interface Category
{
    _id: string;
    name: string;
    description: string;
    image?: string;
}

const CategoriesPage: React.FC = () =>
{
    const [ categories, setCategories ] = useState<Category[]>( [] );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ name, setName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ image, setImage ] = useState<File | null>( null );
    const [ editingCategory, setEditingCategory ] = useState<Category | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );

    useEffect( () =>
    {
        fetchCategories();
    }, [] );

    const fetchCategories = async () =>
    {
        setIsLoading( true );
        setError( null );
        try
        {
            const response = await instance.get( '/field/category' );
            setCategories( response.data.categories );
        } catch ( error )
        {
            console.error( 'Error fetching categories:', error );
            setError( 'Failed to fetch categories. Please try again later.' );
            notifyError( 'Failed to fetch categories' );
        } finally
        {
            setIsLoading( false );
        }
    };

    const getUploadUrl = async ( fileName: string ): Promise<string> =>
    {

        try
        {
            const response = await instance.post<{ url: string; }>( '/field/upload', { filename: fileName } );
            console.log( 'Response from getting URL:', response );
            if ( !response.data || !response.data.url )
            {
                throw new Error( 'Invalid response from server' );
            }
            return response.data.url;
        } catch ( error )
        {
            console.error( 'Error getting upload URL:', error );
            notifyError( 'Failed to get upload URL: ' + ( error instanceof Error ? error.message : String( error ) ) );
            throw error;
        }
    };

    const uploadImage = async ( file: File ): Promise<string | null> =>
    {
        setIsLoading( true );
        try
        {
            const uploadUrl = await getUploadUrl( file.name );
            console.log( 'Upload URL:', uploadUrl );

            const response = await fetch( uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            } );

            if ( !response.ok )
            {
                throw new Error( `HTTP error! status: ${ response.status }` );
            }

            console.log( 'Upload response:', response );
            return `https://${ process.env.NEXT_PUBLIC_AWS_BUCKET }.s3.amazonaws.com/category-images/${ file.name }`;
        } catch ( error )
        {
            console.error( 'Error uploading file:', error );
            notifyError( 'Failed to upload image. Please try again.' );
            return null;
        } finally
        {
            setIsLoading( false );
        }
    };

    const handleSubmit = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setIsLoading( true );
        setError( null );
        try
        {
            let imageUrl = null;
            if ( image )
            {
                imageUrl = await uploadImage( image );
                console.log( "image url:-", imageUrl );
                if ( !imageUrl )
                {
                    notifyError( 'Failed to upload image' );
                    return;
                }
            }

            const categoryData = {
                category: name,
                description,
                image: imageUrl
            };
            if ( editingCategory )
            {
                await instance.patch( `/field/category/${ editingCategory._id }`, categoryData );
            } else
            {
                await instance.post( '/field/category', categoryData );
            }
            setIsModalOpen( false );
            notifySuccess( editingCategory ? "Category updated successfully" : "Category added successfully" );
            setEditingCategory( null );
            setName( '' );
            setDescription( '' );
            setImage( null );
            if ( fileInputRef.current )
            {
                fileInputRef.current.value = '';
            }
            fetchCategories();
        } catch ( error )
        {
            console.error( 'Error saving category:', error );
            setError( 'Failed to save category. Please try again.' );
            notifyError( 'Failed to save category' );
        } finally
        {
            setIsLoading( false );
        }
    };

    const handleEdit = ( category: Category ) =>
    {
        setEditingCategory( category );
        setName( category.name );
        setDescription( category.description );
        setImage( null );
        setIsModalOpen( true );
    };

    const handleDelete = async ( id: string ) =>
    {
        if ( window.confirm( 'Are you sure you want to delete this category?' ) )
        {
            setIsLoading( true );
            setError( null );
            try
            {
                await instance.delete( `/field/category/${ id }` );
                fetchCategories();
                notifySuccess( "Category deleted successfully" );
            } catch ( error )
            {
                console.error( 'Error deleting category:', error );
                setError( 'Failed to delete category. Please try again.' );
                notifyError( 'Failed to delete category' );
            } finally
            {
                setIsLoading( false );
            }
        }
    };

    const openModal = () =>
    {
        setEditingCategory( null );
        setName( '' );
        setImage( null );
        setDescription( '' );
        setIsModalOpen( true );
    };

    const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        if ( e.target.files && e.target.files[ 0 ] )
        {
            setImage( e.target.files[ 0 ] );
        }
    };

    console.log( "categoies:-", categories );

    return (
        <div className="container p-4 m-4 bg-pureWhite-light rounded-md">


            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={ openModal }>+  Add New Category</button>
            </div>

            {/* one horixonal line */ }
            <hr className="border-t border-gray-300 mb-4" />


            { isLoading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-lg font-semibold">Loading...</p>
                    </div>
                </div>
            ) }

            { error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{ error }</span>
                </div>
            ) }

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
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        ref={ fileInputRef }
                                        onChange={ handleImageChange }
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
                { categories.length === 0 && !isLoading ? (
                    <p className="text-center py-4 text-gray-500">No categories found. Add a new category to get started.</p>
                ) :

                    <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
                        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Image
                                    </th>

                                    <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Description
                                    </th>


                                    <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories?.map( ( category ) => (
                                        <tr key={ category._id } className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b border-gray-200 bg-pureWhite-light text-center">
                                                <Image src={ category?.image || '/placeholder-image.jpg' }
                                                    alt={ `${ category.name } image` }
                                                    width={ 100 }
                                                    height={ 100 }
                                                    
                                                />
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white">
                                                { category.name }
                                            </td>

                                            <td className="px-4 py-4 border-b border-gray-200 bg-white">
                                                { category.description }
                                            </td>

                                            <td className="px-4 py-4 border-b border-gray-200 bg-white">
                                                <div className="flex justify-center items-center space-x-2">

                                                    <button className="text-green-600 hover:text-green-900" onClick={ () => handleEdit( category ) }>
                                                        <img src="/images/viewIcon.png" alt="View" className="w-6 h-6" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( category?._id ) }>
                                                        <img src="/images/deleteIcon.png" alt="Delete" className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) )

                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    );
};

export default CategoriesPage;
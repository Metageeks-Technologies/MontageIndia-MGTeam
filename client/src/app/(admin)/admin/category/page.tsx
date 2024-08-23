'use client';

import React, { useState, useEffect, useRef } from 'react';
import instance from '@/utils/axios';
import Image from 'next/image';
import { notifyError, notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface Category
{
    _id: string;
    name: string;
    description: string;
    image?: string;
}

const CategoriesPage: React.FC = () =>
{
    const [ isEditModalOpen, setIsEditModalOpen ] = useState( false );
    const [ editingCategory, setEditingCategory ] = useState<Category | null>( null );
    const [ categories, setCategories ] = useState<Category[]>( [] );
    const [ name, setName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ image, setImage ] = useState<File | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );
    const [ imagePreview, setImagePreview ] = useState<string | null>( null );
    const router = useRouter();
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
            // notifyError( 'Failed to fetch categories' );
            Swal.fire( {
                icon: 'error',
                title: 'Error fetching categories',
                text: 'Please try again later.',

            } );
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
        setImagePreview( category.image || null );
        setImage( null );
        setIsEditModalOpen( true );
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
            // notifyError( 'Failed to get upload URL: ' + ( error instanceof Error ? error.message : String( error ) ) );
            Swal.fire( {
                icon: 'error',
                title: 'Error getting upload URL',
                text: 'Please try again later.',
                // footer: '<a href>Why do I have this issue?</a>',
            } );
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
            // notifyError( 'Failed to upload image. Please try again.' );
            Swal.fire( {
                icon: 'error',
                title: 'Error uploading image',
                text: 'Please try again later.',
                // footer: '<a href>Why do I have this issue?</a>',
            } );

            return null;
        } finally
        {
            setIsLoading( false );
        }
    };
    const handleUpdate = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setIsLoading( true );
        setError( null );
        try
        {
            let imageUrl: any = editingCategory?.image;
            if ( image )
            {
                imageUrl = await uploadImage( image );
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

            await instance.patch( `/field/category/${ editingCategory?._id }`, categoryData );
            setIsEditModalOpen( false );
            // notifySuccess( "Category updated successfully" );
            Swal.fire( {
                icon: 'success',
                title: 'Published',
                text: 'Category updated successfully.',
            } );
            fetchCategories();
            setEditingCategory( null );
            setName( '' );
            setDescription( '' );
            setImage( null );
            setImagePreview( null );
            if ( fileInputRef.current )
            {
                fileInputRef.current.value = '';
            }
        } catch ( error )
        {
            console.error( 'Error updating category:', error );
            setError( 'Failed to update category. Please try again.' );
            notifyError( 'Failed to update category' );
        } finally
        {
            setIsLoading( false );
        }
    };
    const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        if ( e.target.files && e.target.files[ 0 ] )
        {
            const file = e.target.files[ 0 ];
            setImage( file );
            const reader = new FileReader();
            reader.onloadend = () =>
            {
                setImagePreview( reader.result as string );
            };
            reader.readAsDataURL( file );
        }
    };
    // const handleDelete = async ( id: string ) =>
    // {
    //     if ( window.confirm( 'Are you sure you want to delete this category?' ) )
    //     {
    //         setIsLoading( true );
    //         setError( null );
    //         try
    //         {
    //             await instance.delete( `/field/category/${ id }` );
    //             fetchCategories();
    //             // notifySuccess( "Category deleted successfully" );
    //             Swal.fire( {
    //                 icon: 'success',
    //                 title: 'Deleted',
    //                 text: 'Category deleted successfully.',
    //             } );
    //         } catch ( error )
    //         {
    //             console.error( 'Error deleting category:', error );
    //             setError( 'Failed to delete category. Please try again.' );
    //             // notifyError( 'Failed to delete category' );
    //             Swal.fire( {
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'Failed to delete category. Please try again.',
    //             } );
    //         } finally
    //         {
    //             setIsLoading( false );
    //         }
    //     }
    // };


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
            setIsLoading( true );
            setError( null );
            try
            {
                await instance.delete( `/field/category/${ id }` );
                await fetchCategories();
                Swal.fire( {
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Category has been deleted successfully.',
                } );
            } catch ( error )
            {
                console.error( 'Error deleting category:', error );
                setError( 'Failed to delete category. Please try again.' );
                Swal.fire( {
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete category. Please try again.',
                } );
            } finally
            {
                setIsLoading( false );
            }
        }
    };

    console.log( "categoies:-", categories );

    return (
        <div className="container p-4 m-4 bg-pureWhite-light rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={ () => router.push( '/admin/category/create' ) }>+  Add New Category</button>
            </div>

            {/* one horixonal line */ }
            <hr className="border-t border-gray-300 mb-4" />


            {/* { isLoading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-lg font-semibold">Loading...</p>
                    </div>
                </div>
            ) } */}

            { error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{ error }</span>
                </div>
            ) }
            { isEditModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="edit-modal">
                    <div className="relative top-20 mx-auto p-5 border  sm:w-96 shadow-lg rounded-md bg-pureWhite-light">
                        <div className="mt-3 justify-center ">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Category</h3>
                            <button
                                onClick={ () => setIsEditModalOpen( false ) }
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <hr className="border-t border-gray-300 mb-4" />

                            <form onSubmit={ handleUpdate }>
                                <div className="mb-4">
                                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        id="edit-name"
                                        value={ name }
                                        onChange={ ( e ) => setName( e.target.value ) }
                                        className="w-full px-3 py-2 bg-pageBg-light border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="edit-description"
                                        value={ description }
                                        onChange={ ( e ) => setDescription( e.target.value ) }
                                        className="w-full px-3 py-2 border bg-pageBg-light border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        rows={ 4 }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    { imagePreview && (
                                        <div className="mb-2">
                                            <img src={ imagePreview } alt="Category preview" className="w-full h-40 object-cover rounded-md" />
                                        </div>
                                    ) }
                                    <input
                                        type="file"
                                        id="edit-image"
                                        ref={ fileInputRef }
                                        onChange={ handleImageChange }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={ () => setIsEditModalOpen( false ) }
                                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 "
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-webred text-white rounded-md hover:bg-webred-light focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) }


            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                { categories.length === 0 && !isLoading ? (
                    <p className="text-center py-4 text-gray-500">No categories found. Add a new category to get started.</p>
                ) : <div className="bg-white shadow-md rounded-lg relative overflow-x-auto ">
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


                                <th className="px-5 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { categories?.map( ( category ) => (
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
                                                <img src="/images/editIcon.png" title='Edit the Category' alt="View" className="w-6 h-6" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900" title='Delete the Category' onClick={ () => handleDelete( category?._id ) }>
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
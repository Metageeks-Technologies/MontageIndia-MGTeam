'use client';

import instance from '@/utils/axios';
import {notifyError, notifySuccess} from '@/utils/toast';
import {useRouter} from 'next/navigation';
import React, {useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {adminRolesOptions, categoriesOptions, mediaTypesOptions} from "@/utils/tempData";
import Swal from 'sweetalert2';

interface Category {
    _id: string;
    name: string;
    description: string;
    image?: string;
}

const CreateCategory: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState( '' );
    const [description, setDescription] = useState( '' );
    const [image, setImage] = useState<File | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );
    const [isLoading, setIsLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const getUploadUrl = async ( fileName: string ): Promise<string> => {

        try {
            const response = await instance.post<{url: string;}>( '/field/upload', {filename: fileName} );
            console.log( 'Response from getting URL:', response );
            if ( !response.data || !response.data.url ) {
                throw new Error( 'Invalid response from server' );
            }
            return response.data.url;
        } catch ( error ) {
            console.error( 'Error getting upload URL:', error );
            notifyError( 'Failed to get upload URL: ' + ( error instanceof Error ? error.message : String( error ) ) );
            throw error;
        }
    };

    const uploadImage = async ( file: File ): Promise<string | null> => {
        // setIsLoading( true );
        try {
            const uploadUrl = await getUploadUrl( file.name );
            console.log( 'Upload URL:', uploadUrl );

            const response = await fetch( uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {'Content-Type': file.type},
            } );

            if ( !response.ok ) {
                throw new Error( `HTTP error! status: ${response.status}` );
            }

            console.log( 'Upload response:', response );
            return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/category-images/${file.name}`;
        } catch ( error ) {
            console.error( 'Error uploading file:', error );
            notifyError( 'Failed to upload image. Please try again.' );
            return null;
        } finally {
            // setIsLoading( false );
        }
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        setIsLoading( true );
        setError( null );
        try {
            let imageUrl = null;
            if ( image ) {
                imageUrl = await uploadImage( image );
                console.log( "image url:-", imageUrl );
                if ( !imageUrl ) {
                    notifyError( 'Failed to upload image' );
                    return;
                }
            }

            const categoryData = {
                category: name,
                description,
                image: imageUrl
            };

            await instance.post( '/field/category', categoryData );

            // notifySuccess( editingCategory ? "Category updated successfully" : "Category added successfully" );
            Swal.fire( {
                icon: 'success',
                title: 'Category added successfully',
                text: 'You will be redirected to the categories page.',
                showConfirmButton: false,
                timer: 2000
            } ).then( ( result ) => {
                if ( result.dismiss === Swal.DismissReason.timer ) {
                    // Redirect to categories page
                    router.push( '/admin/category' );
                }

            } );
            // window.location.reload();

            setName( '' );
            setDescription( '' );
            setImage( null );
            if ( fileInputRef.current ) {
                fileInputRef.current.value = '';
            }
            setIsLoading( false );


        } catch ( error ) {
            console.error( 'Error saving category:', error );
            setError( 'Failed to save category. Please try again.' );
            notifyError( 'Failed to save category' );
        } finally {
            setIsLoading( false );
        }
    };
    const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        if ( e.target.files && e.target.files[0] ) {
            setImage( e.target.files[0] );
        }
    };
    return (
        <div className="container p-4 min-h-screen bg-pureWhite-light rounded-md">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Add Category</h1>
            </div>
            {/* one horixonal line */}
            <hr className="border-t border-gray-300 mb-4" />
            <div >

                <form onSubmit={handleSubmit} className="bg-pureWhite-light  rounded-lg p-8 w-full mx-auto ">
                    <div className='flex justify-start items-center'>
                        {error && <p className="text-red-500 font-bold">{error}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name  <span className="text-red-500">*</span> </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={( e ) => setName( e.target.value )}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                                placeholder="Enter category name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Image <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center">
                                <label htmlFor="image" className="cursor-pointer bg-[#8D529C] text-white px-4 py-2  rounded-l-md hover:bg-[#7A4589] transition duration-300">
                                    Choose File
                                </label>
                                <span className="flex-grow px-3 py-2 bg-pageBg-light border border-gray-300 border-l-0 rounded-r-md text-gray-500">
                                    {image ? image.name : "No Chosen File"}
                                </span>
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 my-2">Description  <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={( e ) => setDescription( e.target.value )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                            placeholder="Enter category description"
                            required
                            rows={4}
                        />
                    </div>
                    <div className="mt-8 text-right">
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white bg-webred rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-offset-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-webred"
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div
                                        className="animate-spin inline-block w-5 h-5 mr-3 bg-white rounded-full border-4 border-black border-t-4 border-t-transparent transition duration-500 ease-in-out"
                                    ></div>
                                    <span className="text-white">Creating...</span>
                                </>
                            ) : (
                                "Create Category"
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
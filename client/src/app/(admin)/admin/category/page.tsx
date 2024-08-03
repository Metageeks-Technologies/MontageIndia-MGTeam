'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import instance from '@/utils/axios';
// import { Category } from '../../types/category';
// import { getCategories, deleteCategory } from '../../lib/api';

const CategoriesPage: React.FC = () =>
{
    const [ categories, setCategories ] = useState<any[]>( [] );

    useEffect( () =>
    {
        fetchCategories();
    }, [] );

    const fetchCategories = async () =>
    {
        // const data = await getCategories();
        const response = await instance.get('/field/category')
        setCategories( response.data.category );
    };

    const handleDelete = async ( id: number ) =>
    {
        if ( window.confirm( 'Are you sure you want to delete this category?' ) )
        {
            // await deleteCategory( id );
            fetchCategories();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <Link href="/categories/new" className="mb-4 inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Add New Category
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                { categories?.map( ( category ) => (
                    <div key={ category.id } className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">{ category?.name }</h2>
                        <p className="text-gray-600 mb-4">{ category?.description }</p>
                        <div className="flex justify-end space-x-2">
                            <Link href={ `/categories/${ category?.id }` } className="text-blue-500 hover:text-blue-700">
                                Edit
                            </Link>
                            <button onClick={ () => handleDelete( category?.id ) } className="text-red-500 hover:text-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                ) ) }
            </div>
        </div>
    );
};

export default CategoriesPage;
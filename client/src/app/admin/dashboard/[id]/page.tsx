'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import instance from '@/utils/axios';

interface User
{
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  mediaType: string;
  category: string;
}

export default function UserDetails ( { params }: { params: { id: string; }; } )
{
  const [ user, setUser ] = useState<User | null>( null );
  const [ isEditing, setIsEditing ] = useState( false );
  const router = useRouter();
  const { id } = params;

  useEffect( () =>
  {
    if ( id )
    {
      fetchUser();
    }
  }, [ id ] );

  const fetchUser = async () =>
  {
    try
    {
      const response = await instance.get( `auth/admin/${ id }` );

      if ( response.data && response.data.user )
      {
        setUser( response.data.user );
        console.log( "User set:", response.data.user );
      } else
      {
        console.log( "User data not found in response" );
      }
    } catch ( error: any )
    {
      console.error( 'Error fetching user:', error );
      if ( error.response )
      {
        console.error( 'Error response:', error.response.data );
        console.error( 'Error status:', error.response.status );
      }
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
    try
    {
      //   await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/admin/${id}`, user);
      //   setIsEditing(false);
      // Optionally, show a success message
    } catch ( error )
    {
      console.error( 'Error updating user:', error );
    }
  };

  const handleDelete = async () =>
  {
    if ( confirm( 'Are you sure you want to delete this user?' ) )
    {
      try
      {
        // await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/admin/${id}`);
        // router.push('/admin/users');
      } catch ( error )
      {
        console.error( 'Error deleting user:', error );
      }
    }
  };

  if ( !user ) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>
        <div className="p-6">
          <form onSubmit={ ( e ) => e.preventDefault() } className="space-y-6">
            { Object.entries( user ).map( ( [ key, value ] ) => (
              key !== 'id' && (
                <div key={ key } className="flex flex-col">
                  <label htmlFor={ key } className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    { key.replace( /([A-Z])/g, ' $1' ).trim() }
                  </label>
                  <input
                    type="text"
                    id={ key }
                    name={ key }
                    value={ value }
                    onChange={ handleInputChange }
                    disabled={ !isEditing }
                    className={ `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${ isEditing ? 'bg-white' : 'bg-gray-100'
                      }` }
                  />
                </div>
              )
            ) ) }
          </form>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
          { isEditing ? (
            <>
              <button
                onClick={ handleUpdate }
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                onClick={ () => setIsEditing( false ) }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={ () => setIsEditing( true ) }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
          ) }
          <button
            onClick={ handleDelete }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
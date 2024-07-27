'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  mediaType: string;
  category: string;
}

export default function UserDetails({ params }: { params: { id: string; }; }) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () =>
  {

    try
    {
      const response = await instance.get( `/auth/admin/${ id }`,{withCredentials: true} );
      if ( response.data && response.data.user )
      {
        console.log( response.data.user );
        setUser( response.data.user );
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    try
    {
      const response = await instance.patch( `/auth/admin/updateAdmin/${ id }`, user,{withCredentials: true} );
      console.log("response:", response );
      if ( response.data.success
 && response.data.admin )
      {
        console.log( response.data.user );
        setUser( response.data.user );
        setIsEditing( false );
        fetchUser();
        notifySuccess(response.data.message );
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await instance.delete(`/auth/admin/${id}`);
        if (response.data) {
          notifySuccess(response.data.message);
          router.back();
        }
      } catch (error: any) {
        notifyError(error.message);
        console.error('Error deleting user:', error);
      }
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-200 text-black">
          <h1 className="text-3xl font-bold text-center">User Profile</h1>
        </div>
        <div className="p-6">
          <div className="mb-8 text-center">
            {/* <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              { user.name.charAt( 0 ) }
            </div> */}
            {/* <div className='flex flex-row justify-center items-center gap-4'> */}
            <h2 className="mt-4 text-2xl font-semibold">{ user.name }</h2>
            <p className="text-gray-600 text-md italic ">{ user.username }</p>
            {/* </div> */}
            
            <p className="text-gray-600 text-md"> Email: { user.email }</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            { Object.entries( user ).map( ( [ key, value ] ) => (
              key !== '_id'&& key!=='username' && key!=="uid" && key!=="avatar" && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v' && key !== 'resetPasswordExpires' && key !== 'resetPasswordToken' && (
                <div key={ key } className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {isEditing && (key === 'role' || key === 'mediaType' || key === 'category') ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border p-3"
                    >
                      {key === 'role' && (
                        <>
                          <option value="admin">Admin</option>
                          <option value="super admin">Super Admin</option>
                        </>
                      )}
                      {key === 'mediaType' && (
                        <>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                        </>
                      )}
                      {key === 'category' && (
                        <>
                          <option value="shoes">Shoes</option>
                          <option value="slippers">Slippers</option>
                          <option value="dress">Dress</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <p className="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md">{value}</p>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

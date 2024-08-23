'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';
import { adminRolesOptions, categoriesOptions, mediaTypesOptions } from '@/utils/tempData';
import Multiselect from 'multiselect-react-dropdown';
import { Spinner } from '@nextui-org/react';
import Swal from 'sweetalert2';

interface User
{
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  mediaType: string[];
  category: string[];
}

export default function UserDetails ( { params }: { params: { id: string; }; } )
{
  const [ user, setUser ] = useState<User>( {
    id: '',
    name: '',
    email: '',
    role: '',
    username: '',
    mediaType: [],
    category: [],
  } );
  const [ selectedCategories, setSelectedCategories ] = useState<string[]>( [] );
  const [ selectedMediaTypes, setSelectedMediaTypes ] = useState<string[]>( [] );
  const [ isEditing, setIsEditing ] = useState( false );

  const onSelectCategory = ( selectedList: string[] ) =>
  {
    const uniqueSelectedList = Array.from( new Set( selectedList ) );
    const lowerCaseList = Array.from( new Set( uniqueSelectedList.map( item => item.toLowerCase() ) ) );
    setSelectedCategories( uniqueSelectedList );

    setUser( prevUser => ( {
      ...prevUser,
      category: lowerCaseList,
    } ) );

  };

  const onRemoveCategory = ( selectedList: string[] ) =>
  {
    setSelectedCategories( selectedList );
    const lowerCaseList = selectedList.map( item => item.toLowerCase() );
    setUser( prevUser => ( {
      ...prevUser,
      category: lowerCaseList,
    } ) );
  };

  const onSelectMediaType = ( selectedList: string[] ) =>
  {
    const uniqueSelectedList = Array.from( new Set( selectedList ) );
    const lowerCaseList = Array.from( new Set( uniqueSelectedList.map( item => item.toLowerCase() ) ) );

    setSelectedMediaTypes( uniqueSelectedList );
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
  const router = useRouter();
  const { id } = params;

  useEffect( () =>
  {
    if ( id )
    {
      fetchUser();
    }
  }, [ id ] );

  const capitalizeFirstLetter = ( str: string ): string =>
  {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
  };
  const fetchUser = async () =>
  {

    try
    {
      const response = await instance.get( `/auth/admin/${ id }`, { withCredentials: true } );
      if ( response.data && response.data.user )
      {
        console.log( response.data.user );
        setUser( response.data.user );
        setSelectedCategories( response.data.user.category );
        setSelectedMediaTypes( response.data.user.mediaType );
      }
    } catch ( error )
    {
      console.error( 'Error fetching user:', error );
    }
  };

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) =>
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
      const response = await instance.patch( `/auth/admin/updateAdmin/${ id }`, user, { withCredentials: true } );
      console.log( "response:", response );
      if ( response.data.success
        && response.data.admin )
      {
        console.log( response.data.user );
        setUser( response.data.user );
        setIsEditing( false );
        fetchUser();
        // notifySuccess( response.data.message );
        Swal.fire( {
          icon: 'success',
          title: 'Admin updated successfully',
          text: response.data.message,  
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',

        } );
      }
    } catch ( error: any )
    {
      // notifyError( error.response.data.message || "There is some internal server error. Please try later" );
      Swal.fire( {
        icon: 'error',
        title: 'Error updating admin',
        text: error.response.data.message || "There is some internal server error. Please try later",
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      } );
      console.error( 'Error updating user:', error );
    }
  };

  const handleEdit = async () =>
  {
    setSelectedCategories( user.category );
    setSelectedMediaTypes( user.mediaType );
    setIsEditing( true );
  };
  const handleDelete = async () =>
  {
    if ( confirm( 'Are you sure you want to delete this user?' ) )
    {
      try
      {
        const response = await instance.delete( `/auth/admin/${ id }` );
        if ( response.data )
        {
          // notifySuccess( response.data.message );
          Swal.fire( {
            icon: 'success',
            title: 'User deleted successfully',
            text: response.data.message,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            } );
          router.back();
        }
      } catch ( error: any )
      {
        // notifyError( error.message );
        Swal.fire( {
          icon: 'error',
          title: 'Error deleting user',
          text: error.message,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        } );
        
        console.error( 'Error deleting user:', error );
      }
    }
  };

  const handleUpdateCancel = () =>
  {
    fetchUser();
    setIsEditing( false );
  };

  if ( !user ) return <div className="flex justify-center items-center h-screen">
    <Spinner label="Loading..." color="success" />
  </div>;

  return (
    <div className="container p-4 m-4 bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Profile Setting</h1>
        
      </div>
      <div>

      {/* one horixonal line */ }
      <hr className="border-t border-gray-300 mb-4" />

        <div className="p-6">
          { !user && <Spinner label='Loading..' color="success" /> }

          <div className="flex justify-center mb-6 bg-pageBg-light">
            { user && <div className="mb-8 text-center">
              {/* <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              { user.name.charAt( 0 ) }
            </div> */}
              {/* <div className='flex flex-row justify-center items-center gap-4'> */ }
              <h2 className="mt-4 text-2xl font-semibold">{ user.name }</h2>
              <p className="text-gray-600 text-md italic ">User Name : { user.username }</p>
              {/* </div> */ }

              <p className="text-gray-600 text-md"> Email: { user.email }</p>
            </div> }
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            { Object.entries( user ).map( ( [ key, value ] ) => (

              key !== '_id' && key !== 'username' && key !== 'isDeleted' && key !== "uid" && key !== "avatar" && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v' && key !== 'resetPasswordExpires' && key !== 'resetPasswordToken' && (
                <div key={ key } className="flex flex-col">
                  { ( key !== 'mediaType' && key !== 'category' ) && ( <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    { key.replace( /([A-Z])/g, ' $1' ).trim() }
                  </label> ) }
                  { !isEditing && ( key === 'mediaType' || key == 'category' ) && ( <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    { key.replace( /([A-Z])/g, ' $1' ).trim() }
                  </label> ) }
                  { isEditing && ( key === 'name' || key === 'email' ) &&
                    <input name={ key } value={ value } onChange={ handleInputChange } className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  }
                  { isEditing && ( key === 'role' ) && (
                    <select
                      name={ key }
                      value={ value }
                      onChange={ handleInputChange }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border p-3"
                    >
                      { key === 'role' && (
                        <>

                          { adminRolesOptions.map( ( role, index ) => (
                            <option value={ role.value } key={ index }>{ role.name }</option>
                          ) ) }
                        </>
                      ) }
                    </select>
                  ) }
                  { isEditing && ( key === 'mediaType' ) &&
                    ( <>
                      <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                        Media Type
                      </label>
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
                            background: '#BEF264'
                          },
                          searchBox: {
                            background: 'white',
                            border: '1px solid #e5e7eb',
                          }
                        } }
                      />
                    </>
                    ) }
                  { isEditing && ( key === 'category' ) &&
                    ( <>
                      <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                        Category
                      </label>
                      <Multiselect
                        avoidHighlightFirstOption
                        showArrow
                        id="category"
                        options={ categoriesOptions.map( ( option ) => ( { name: option.name, value: option.value } ) ) }
                        selectedValues={ selectedCategories.map( ( type ) => ( { name: type } ) ) }
                        onSelect={ ( selectedList ) => onSelectCategory( selectedList.map( ( item: any ) => item.name ) ) }
                        onRemove={ ( selectedList ) => onRemoveCategory( selectedList.map( ( item: any ) => item.name ) ) }
                        showCheckbox
                        displayValue="name"
                        style={ {
                          chips: {
                            background: '#BEF264'
                          },
                          searchBox: {
                            background: 'white',
                            border: '1px solid #e5e7eb',
                          }
                        } }
                      />
                    </>
                    ) }
                  { !isEditing && (
                    <p className="mt-1 block w-full py-2 px-3 bg-pageBg-light rounded-md">   { Array.isArray( value ) ? value.map( item => capitalizeFirstLetter( item ) ).join( ', ' ) : capitalizeFirstLetter( value ) }</p>
                  ) }
                </div>
              )
            ) ) }
          </div>
        </div>
        <div className="px-6 py-4 bg-pureWhite-light flex justify-end space-x-4">
          { isEditing ? (
            <>
              <button
                onClick={ handleUpdate }
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
              <button
                onClick={ handleUpdateCancel }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={ handleEdit }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          ) }
          <button
            onClick={ handleDelete }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

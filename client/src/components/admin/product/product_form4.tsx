import instance from '@/utils/axios';
import { categoriesOptions } from '@/utils/tempData';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineSave } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select, { MultiValue, ActionMeta } from 'react-select';
import useAdminAuth from '@/components/hooks/useAdminAuth';
import Swal from 'sweetalert2';

interface Variant
{
  label: string;
  size: string;
  price: number;
  credit: number;
  key: string;
  _id: string;
  metadata: any;
}

interface FormData
{
  id: string;
  slug: string;
  uuid: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  category: string[];
  thumbnailKey: string;
}

const Form4 = ( { formData }: any ) =>
{
  const router = useRouter();
  const { user } = useAdminAuth();
  const initialData = formData.product || {};
  const [ data, setFormData ] = useState<FormData>( initialData );
  const [ selected, setSelectedcheck ] = useState( false );

  const [ newTag, setNewTag ] = useState<string>( '' ); // State for the new tag input
  const [ editMode, setEditMode ] = useState<{ [ key: string ]: boolean; }>( {
    title: false,
    slug: false,
    description: false,
    tags: false,
    variants: false,
    status: false,
    mediaType: false,
    category: false
  } );
  const [ editingVariantIndex, setEditingVariantIndex ] = useState<number | null>( null );
  const [ loading, setloader ] = useState( false );
  const [ selectedCategories, setSelectedCategories ] = useState<any[]>( [] );
  const [ availableCategories, setAvailableCategories ] = useState<any[]>( [] );
  const BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;
  const [ isPublishButtonDisabled, setIsPublishButtonDisabled ] = useState( false );
  const AwsRegiosn = process.env.NEXT_PUBLIC_AWS_REIGION;
  const updatedField = {};
  const editorChoiceCategory = "editor choice";

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, field: string ) =>
  {
    if ( typeof e === 'string' )
    {
      // Handle cases where e is a string, e.g., for rich text editors
      setFormData( { ...data, [ field ]: e } );
      // console.log(e, field);
    } else
    {
      console.log( field );
      const { name, value } = e.target;
      console.log( name, value );
      setFormData( {
        ...data,
        [ name ]: value
      } );
    }
  };

  const handleTagChange = ( index: number, value: string ) =>
  {
    const newTags = [ ...data.tags ];
    newTags[ index ] = value;
    setFormData( { ...data, tags: newTags } );
  };

  const handleVariantChange = ( index: number, key: keyof Variant, value: string | number ) =>
  {
    const newVariants = [ ...data.variants ];
    newVariants[ index ] = {
      ...newVariants[ index ],
      [ key ]: value
    } as Variant;
    setFormData( { ...data, variants: newVariants } );
  };

  const handleEditToggle = ( field: string, index?: number ) =>
  {
    if ( index !== undefined )
    {
      if ( field === 'variants' )
      {
        setEditingVariantIndex( index );
        setEditMode( prev => ( { ...prev, [ field ]: !prev[ field ] } ) );
      }
    } else
    {
      setEditMode( prev => ( { ...prev, [ field ]: !prev[ field ] } ) );
    }
  };

  const filteredTags = data.tags.filter( tag => tag.trim() !== '' );
  const isTagsEmpty: boolean = filteredTags.length === 0;

  const handleSave = async ( field: string ) =>
  {
    if ( !data.title || !data.description || filteredTags.length === 0 )
    {
      Swal.fire( {
        icon: 'error',
        title: 'Invalid input',
        text: `${ field } must be valid and not empty.`,
      } );
      setEditMode( prev => ( { ...prev, [ field ]: false } ) );

      return;
    }
    try
    {
      let updatedField = {};
      switch ( field )
      {
        case 'title':
          updatedField = { title: data.title };
          break;
        case 'category':
          updatedField = { category: selectedCategories.map( c => c.label ) };
          break;
        case 'description':
          updatedField = { description: data.description };
          break;
        case 'tags':
          updatedField = { tags: filteredTags };
          break;
        default:
          throw new Error( 'Unknown field' );
      }
      console.log( updatedField );
      const response = await instance.patch( `/product/${ initialData.uuid }`, updatedField );
      if ( response.status === 201 )
      {
        // notifySuccess( `${ field } updated successfully` );
        Swal.fire( {
          icon: 'success',
          title: 'Updated successfully',
          text: `${ field } updated successfully`
        } );

        const updatedDataResponse = await instance.get( `/product/${ initialData.uuid }` );
        if ( updatedDataResponse.status === 201 )
        {
          setFormData( updatedDataResponse.data.product );

          setSelectedCategories( response.data.product.category );
        } else
        {
          throw new Error( 'Failed to fetch updated data' );
        }
      }
    } catch ( error: any )
    {
      setloader( false );
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      console.error( 'Error saving data:', error );
    }

    setEditMode( prev => ( { ...prev, [ field ]: false } ) );
  };
  const handleSaveVariant = async ( index: number ) =>
  {
    const variant = data.variants[ index ];

    if ( !variant.price || variant.price <= 0 || !variant.credit || variant.credit <= 0 || !variant.label || variant.label.trim() === '' )
    {
      Swal.fire( {
        icon: 'error',
        title: 'Invalid input',
        text: 'Label, price and Credit must be valid and not empty.',
      } );
      const allVariantsValid = data.variants.every( variant =>
        variant.label?.trim() !== '' && variant.price > 0 && variant.credit > 0
      );
      setIsPublishButtonDisabled( allVariantsValid );
      return;
    }
    try
    {
      const sendData = {
        uuid: initialData.uuid,
        price: variant.price,
        label: variant.label,
        credit: variant.credit
      };
      const response = await instance.patch( `/product/variant/${ variant._id }`, sendData );

      if ( response.status === 201 )
      {
        console.log( 'Saving variant data:', response.data );
        setFormData( response.data.product );
        console.log( "h", data );
      }
      const isAllVariantsValid = data.variants.every( variant =>
        variant.label && variant.price
      );
      setIsPublishButtonDisabled( isAllVariantsValid );

    } catch ( error: any )
    {
      const isAllVariantsValid = data.variants.every( variant =>
        variant.label && variant.price && variant.credit
      );
      setIsPublishButtonDisabled( isAllVariantsValid );
      console.error( 'Error saving variant:', error );
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
    }
    setEditingVariantIndex( null ); // Exit edit mode for the variant
    setEditMode( prev => ( { ...prev, variants: false } ) );
  };
  const handleAddTag = () =>
  {
    if ( newTag.trim() !== '' )
    {
      setFormData( { ...data, tags: [ ...data.tags, newTag.trim() ] } );
      setNewTag( '' ); // Clear the input field after adding the tag 
    }
  };

  const handleDeleteTag = ( index: number ) =>
  {
    const newTags = data.tags.filter( ( _, i ) => i !== index );
    setFormData( { ...data, tags: newTags } );
  };

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
  {
    e.preventDefault();

    if ( !isPublishButtonDisabled || Object.values( editMode ).some( mode => mode ) || isTagsEmpty )
    {
      // Optionally, you can show an error message here if desired
      console.log( isPublishButtonDisabled, Object.values( editMode ).some( mode => mode ), isTagsEmpty );
      console.log( 'Form submission is not allowed due to invalid conditions.' );
      return; // Prevent form submission if conditions are not met
    }
    try
    {
      const updatedField = { status: "published" };
      const response = await instance.patch( `/product/${ initialData.uuid }`, updatedField );
      setloader( true );
      if ( response.status === 201 )
      {
        // notifySuccess( "Product published successfully" );
        Swal.fire( {
          icon: 'success',
          title: 'Published',
          text: 'Your product has been published.',
        } );
        router.push( '/admin/product/available' );
        setloader( false );
      }
    } catch ( error: any )
    {
      console.error( 'Error submitting form:', error );
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
    }
  };
  useEffect( () =>
  {
    if ( data?.category?.includes( editorChoiceCategory ) )
    {
      setSelectedcheck( true );
    } else
    {
      setSelectedcheck( false );
    }
    setSelectedCategories( data?.category || [] );
  }, [ data, editorChoiceCategory ] );
  const handleCheck = async ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const isChecked = event.target.checked;
    setSelectedcheck( isChecked );

    const categoryExists = selectedCategories.includes( editorChoiceCategory );

    try
    {
      let newCategories = [ ...selectedCategories ];

      if ( isChecked && !categoryExists )
      {
        newCategories.push( editorChoiceCategory );
      } else if ( !isChecked && categoryExists )
      {
        newCategories = newCategories.filter(
          ( category ) => category !== editorChoiceCategory
        );
      }

      // Update the selected categories state
      setSelectedCategories( newCategories );

      // Update the server with new categories
      const response = await instance.patch( `/product/${ data?.uuid }`, {
        ...updatedField,
        category: newCategories,
      } );

      if ( response.status === 201 )
      {
        setloader( false );
        // notifySuccess( "Updated successfully" );
        Swal.fire( {
          icon: 'success',
          title: 'Updated successfully',
          showConfirmButton: false,
          timer: 1500
        } );
      }
    } catch ( error )
    {
      console.error( "Error updating category:", error );
    } finally
    {
      setloader( false );
    }
  };
  const handleCategoryChange = ( newValue: MultiValue<any>, actionMeta: ActionMeta<any> ) =>
  {
    setSelectedCategories( newValue as any[] );
  };
  const renderMedia = () =>
  {
    switch ( data?.mediaType )
    {
      case 'audio':
        return <>
          <audio controls>
            <source src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ data.thumbnailKey }` } type="audio/mpeg" />
          </audio>
        </>;
      case 'image':
        return <img
          className="w-full h-64 object-cover"
          src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ data.thumbnailKey }` } alt="Product Media" />;
      case 'video':
        return <>
          <video width="320" height="240" controls>
            <source src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ data.thumbnailKey }` } type="video/mp4" />
          </video>
        </>;
      default:
        return <p>No media available</p>;
    }
  };

  const getCategories = async () => 
  {
    try
    {
      const response = await instance.get( '/field/category' );
      const formattedCategories = response.data.categories.map( ( category: any ) => ( {
        label: category.name ? category.name : 'Unknown', // Display text
        value: category.name ? category.name : 'Unknown', // Underlying value
      } ) );
      setAvailableCategories( formattedCategories );
    } catch ( error )
    {
      console.log( "error in getting the category:-", error );
    }
  };

  useEffect( () =>
  {
    getCategories();
    const allVariantsValid = data.variants.every( variant =>
      variant.label?.trim() !== '' && variant.price > 0
    );
    setIsPublishButtonDisabled( allVariantsValid );
  }, [] );

  console.log( data );

  return ( <>  { loading ?
    <div role="status" className='justify-center h-screen flex items-center m-auto'>
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
    : (
      <div className="p-6 mx-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-semibold">Review Product</h1>
        </div>

        <form onSubmit={ handleSubmit } className="bg-pureWhite shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={ selected }
                    onChange={ handleCheck }
                    className="mr-2"
                  />
                  <span className="text-base font-semibold">Editor Choice</span>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                      Title
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className={ `${ !editMode.title ? 'hidden' : 'block' }` }
                        onClick={ () => { handleSave( 'title' ); handleEditToggle( 'title' ); } }
                      >
                        <MdOutlineSave size={ 20 } />
                      </button>
                      <button
                        type="button"
                        className={ `${ editMode.title ? 'hidden' : 'block' }` }
                        onClick={ () => handleEditToggle( 'title' ) }
                      >
                        <FaRegEdit size={ 20 } />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    className={ `w-full p-2 border rounded bg-pageBg-light` }
                    value={ data.title }
                    disabled={ !editMode.title }
                    onChange={ ( e ) => handleChange( e, 'title' ) }
                  />
                </div>


                <div className="">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-700 text-sm font-bold" htmlFor="description">
                      Description
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className={ `text-xl ${ !editMode.description ? 'hidden' : 'block' }` }
                        onClick={ () => { handleSave( 'description' ); handleEditToggle( 'description' ); } }
                      >
                        <MdOutlineSave size={ 20 } />
                      </button>
                      <button
                        type="button"
                        className={ `${ editMode.description ? 'hidden' : 'block' }` }
                        onClick={ () => handleEditToggle( 'description' ) }
                      >
                        <FaRegEdit size={ 20 } />
                      </button>
                    </div>
                  </div>

                  <textarea
                    name="description"
                    placeholder="Product description"
                    value={ data.description }
                    readOnly={ !editMode.description }
                    className="w-full p-2 border rounded h-36 bg-pageBg-light"
                    onChange={ ( e ) => handleChange( e, 'description' ) }
                  />
                </div>

              </div>

              <div className="mb-6">
                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                  Media
                </label>
                <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg mb-5">
                  { renderMedia() }
                </div>
                { data.mediaType === 'audio' && data.variants.map( ( variant, index ) => (
                  <div key={ variant._id } className="bg-pageBg-light p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      {/* <h3 className="font-bold">{ variant.size }</h3> */ }
                      <h3 className="font-bold">Variant</h3>
                      { editingVariantIndex === index ? (
                        <button type="button" onClick={ () => handleSaveVariant( index ) }><MdOutlineSave size={ 20 } /></button>
                      ) : (
                        <button type="button" onClick={ () => handleEditToggle( 'variants', index ) }><FaRegEdit size={ 20 } /></button>
                      ) }
                    </div>

                    <div className="flex w-full gap-4">
                      <div >
                        <label className="block text-sm font-medium text-gray-600 mb-1">Label:</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter label"
                          value={ variant.label }
                          readOnly={ editingVariantIndex !== index }
                          onChange={ ( e ) => handleVariantChange( index, 'label', e.target.value ) }
                        />
                      </div>
                      <div className="">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Price:</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter price"
                          value={ variant.price }
                          readOnly={ editingVariantIndex !== index }
                          onChange={ ( e ) => handleVariantChange( index, 'price', parseFloat( e.target.value ) ) }
                        />
                      </div>
                      <div >
                        <label className="block text-sm font-medium text-gray-600 mb-1">Credit:</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter Credit"
                          value={ variant.credit }
                          readOnly={ editingVariantIndex !== index }
                          onChange={ ( e ) => handleVariantChange( index, 'credit', parseFloat( e.target.value ) ) }
                        />
                      </div>
                    </div>
                  </div>

                ) ) }
              </div>
            </div>
            {/* Variants */ }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              { data.mediaType !== 'audio' && data.variants.map( ( variant, index ) => (
                <div key={ variant._id } className="bg-pageBg-light p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>

                      <h3 className="font-bold">Variant { index + 1 }</h3>
                      <p className=" text-gray-700">{ variant?.metadata?.dimension }</p>
                    </div>
                    { editingVariantIndex === index ? (
                      <button type="button" onClick={ () => handleSaveVariant( index ) } className="text-gray-600 hover:text-gray-700 transition-colors">
                        <MdOutlineSave size={ 24 } />
                      </button>
                    ) : (
                      <button type="button" onClick={ () => handleEditToggle( 'variants', index ) } className="text-gray-600 hover:text-gray-700 transition-colors">
                        <FaRegEdit size={ 24 } />
                      </button>
                    ) }
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Label:</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter label"
                        value={ variant.label }
                        readOnly={ editingVariantIndex !== index }
                        onChange={ ( e ) => handleVariantChange( index, 'label', e.target.value ) }
                      />
                    </div>
                    <div className="">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Price:</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter price"
                        value={ variant.price }
                        readOnly={ editingVariantIndex !== index }
                        onChange={ ( e ) => handleVariantChange( index, 'price', parseFloat( e.target.value ) ) }
                      />
                    </div>
                    <div >
                      <label className="block text-sm font-medium text-gray-600 mb-1">Credit:</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter Credit"
                        value={ variant.credit }
                        readOnly={ editingVariantIndex !== index }
                        onChange={ ( e ) => handleVariantChange( index, 'credit', parseFloat( e.target.value ) ) }
                      />
                    </div>
                  </div>
                </div>
              ) ) }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className='text-xl flex items-center justify-between font-semibold mb-2'>
                  <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                    Tags
                  </label>
                  <div>
                    { !editMode.tags ? (
                      <button
                        type="button"
                        className="text-xl text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={ () => handleEditToggle( 'tags' ) }
                      >
                        <FaRegEdit size={ 22 } />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-xl text-green-600 hover:text-green-800 transition-colors"
                        onClick={ () => handleSave( 'tags' ) }
                      >
                        <MdOutlineSave size={ 20 } />
                      </button>
                    ) }
                  </div>
                </div>
                <div className="bg-pageBg-light p-4 rounded-lg shadow-sm">
                  <div className='flex flex-wrap gap-2'>
                    { data.tags.map( ( tag, index ) => (
                      tag.trim() !== '' && (
                        <div key={ index } className='flex items-center gap-2 bg-pureWhite-light border border-gray-300 rounded-lg px-3 py-1 shadow-sm'>
                          { editMode.tags ? (
                            <>
                              <input
                                type="text"
                                value={ tag }
                                required
                                onChange={ ( e ) => handleTagChange( index, e.target.value ) }
                                className="w-full bg-transparent text-sm font-semibold text-gray-700 focus:outline-none"
                              />
                              <button
                                type="button"
                                className="text-webred hover:bg-webred-light transition-colors"
                                onClick={ () => handleDeleteTag( index ) }
                              >
                                <FaTrashAlt />
                              </button>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-700">{ tag }</span>
                          ) }
                        </div>
                      )
                    ) ) }
                    { editMode.tags && (
                      <div className='flex gap-2 items-center'>
                        <input
                          type="text"
                          value={ newTag }
                          onChange={ ( e ) => setNewTag( e.target.value ) }
                          className="w-24 rounded-lg px-2 py-1 bg-pureWhite border border-gray-300 shadow-sm text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="New tag"
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={ handleAddTag }
                        >
                          <IoIosAddCircleOutline size={ 22 } />
                        </button>
                      </div>
                    ) }
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xl font-semibold mb-2">
                  <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                  </label>
                  <div>
                    { editMode.category ? (
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800 transition-colors"
                        onClick={ () => { handleSave( 'category' ); handleEditToggle( 'category' ); } }
                      >
                        <MdOutlineSave size={ 20 } />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={ () => handleEditToggle( 'category' ) }
                      >
                        <FaRegEdit size={ 20 } />
                      </button>
                    ) }
                  </div>
                </div>
                <div className="bg-pageBg-light p-2 rounded-lg shadow-sm">
                  { editMode.category ? (
                    <Select
                      isMulti
                      name="categories"
                      options={ availableCategories }
                      className='basic-multi-select'
                      classNamePrefix="select"
                      onChange={ handleCategoryChange }
                    // value={ availableCategories.filter( option => data.category.includes( option.value ) ) }
                    />
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      { data.category
                        .filter( cat => cat !== "editor choice" )
                        .map( ( cat, index ) => (

                          <span key={ index } className="text-sm  text-gray-700 p-2 rounded-lg font-semibold bg-pureWhite-light shadow-md">{ cat }</span>

                        ) ) }
                    </div>
                  ) }
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="media type">
                  Media Type
                </label>
                <div className="bg-pageBg-light p-4 my-2 rounded-lg shadow-sm">
                  <span
                    className="p-2 font-semibold px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pureWhite-light"
                  >
                    { data.mediaType }
                  </span>
                  {/* <input
                    id="mediaType"
                    type="text"
                    value={ data.mediaType }
                    readOnly
                  /> */}
                </div>
              </div>
            </div>




          </div>

          {/* Save Buttons */ }
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
            {/* <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={()=>window.location.reload()}>
              Save as Draft
            </button> */}
            <button
              type="submit"
              disabled={
                !(
                  isTagsEmpty === false &&
                  isPublishButtonDisabled === true &&
                  !Object.values( editMode ).some( ( mode ) => mode )
                )
              }
              className={ `px-4 py-2 text-white rounded ${ !(
                isTagsEmpty === false &&
                isPublishButtonDisabled === true &&
                !Object.values( editMode ).some( ( mode ) => mode )
              )
                ? 'bg-webred cursor-not-allowed'
                : 'bg-webred cursor-pointer'
                }` }
            >
              Publish
            </button>
          </div>
        </form>
      </div>

    ) }
  </> );
};

export default Form4;

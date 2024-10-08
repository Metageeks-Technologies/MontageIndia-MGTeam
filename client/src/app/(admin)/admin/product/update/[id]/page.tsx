"use client";
import useAdminAuth from '@/components/hooks/useAdminAuth';
import instance from '@/utils/axios';
import { categoriesOptions } from '@/utils/tempData';
import { notifySuccess } from '@/utils/toast';
import { Spinner } from '@nextui-org/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineSave } from 'react-icons/md';
import Select, { MultiValue, ActionMeta } from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import {SpinnerLoader} from '@/components/loader/loaders';

interface Variant
{
  label: string;
  size: string;
  price: number;
  credit: number;
  key: string;
  _id: string;
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
const Form4 = () =>
{
  const params = useParams();
  const id = params.id as string | undefined;
  const { user } = useAdminAuth();
  const [ data, setFormData ] = useState<FormData | null>( null );
  const [ loading, setloader ] = useState( false );
  const [ newTag, setNewTag ] = useState<string>( '' );
  const [ selectedCategories, setSelectedCategories ] = useState<any[]>( [] );
  const [ availableCategories, setAvailableCategories ] = useState<any[]>( [] );
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
  const [ status, setStatus ] = useState( data?.status || '' );
  const [ isPublishButtonDisabled, setIsPublishButtonDisabled ] = useState( false );
  const [ selected, setSelectedcheck ] = useState( false );
  const BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;
  const AwsRegiosn = process.env.NEXT_PUBLIC_AWS_REIGION;
  const fetchData = async () =>
  {
    setloader( true );
    try
    {
      const response = await instance( `/product/${ id }` );
      console.log( "dsds", response );
      if ( response.status === 201 )
      {
        setloader( false );
        setFormData( response.data.product );
        setStatus( response.data.product.status );
      }
    } catch ( error: any )
    {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      setloader( true );
      console.error( 'Error fetching data:', error );
    }
  };
  const getCategories = async () => 
  {
    try
    {
      const response = await instance.get( '/field/category' );
      const formattedCategories = response.data.categories.
        filter( ( category: any ) => category.name !== "editor choice" )
        .map( ( category: any ) => ( {
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
    fetchData();
  }, [] );

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, field: string ) =>
  {
    if ( !data ) return;
    if ( typeof e === 'string' )
    {
      // Handle cases where e is a string, e.g., for rich text editors
      setFormData( { ...data, description: e } );
    } else
    {
      const { name, value } = e.target;
      setFormData( {
        ...data,
        [ name ]: value
      } );
    }
  };

  const handleTagChange = ( index: number, value: string ) =>
  {
    if ( !data ) return;
    const newTags = [ ...data.tags ];
    newTags[ index ] = value;
    setFormData( { ...data, tags: newTags } );
  };

  const handleVariantChange = ( index: number, key: keyof Variant, value: string | number ) =>
  {
    if ( !data ) return;
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
      // Toggle edit mode for specific variant
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

  const filteredTags = data?.tags.filter( tag => tag.trim() !== '' );
  const isTagsEmpty: boolean = filteredTags?.length === 0;

  const handleSave = async ( field: string ) =>
  {
    if ( !data ) return;

    if ( !data.title || !data.description || filteredTags?.length === 0 )
    {
      Swal.fire( {
        icon: 'error',
        title: 'Invalid input',
        text: `${ field } must be valid and not empty.`,
      } );
      setEditMode( prev => ( { ...prev, [ field ]: false } ) );

      return;
    }
    setloader( true );
    try
    {
      let updatedField = {};
      switch ( field )
      {
        case 'title':
          updatedField = { title: data.title };
          break;
        case 'category':
          updatedField = { category: getCategoriesWithEditorChoice( selectedCategories, selected ) };
          break;
        case 'description':
          updatedField = { description: data.description };
          break;
        case 'tags':
          updatedField = { tags: data.tags };
          break;
        default:
          throw new Error( 'Unknown field' );
      }

      const response = await instance.patch( `/product/${ data.uuid }`, updatedField );
      if ( response.status === 201 )
      {
        setloader( false );
        // notifySuccess(" updated successfuly")
        Swal.fire( {
          icon: 'success',
          title: 'updated successfuly',
          text: `Your product has been updated successfully`
        } );
        fetchData();
      }
      console.log( 'Save result:', response.data );

    } catch ( error: any )
    {
      setloader( false );
      fetchData();
      const errorMessage = error.response?.data?.message || 'An error occurred ';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      console.error( 'Error saving data:', error );
    }

    setEditMode( prev => ( { ...prev, [ field ]: false } ) );
  };
  const getCategoriesWithEditorChoice = ( categories: { label: string; }[], isSelected: boolean ) =>
  {
    const editorChoiceCategory = "editor choice";
    const categoriesLabels = categories.map( c => c.label );

    if ( isSelected && !categoriesLabels.includes( editorChoiceCategory ) )
    {
      return [ ...categoriesLabels, editorChoiceCategory ];
    }

    return categoriesLabels;
  };
  const handleSaveVariant = async ( index: number ) =>
  {
    if ( !data ) return;
    const variant = data.variants[ index ];

    if ( !variant.price || variant.price <= 0 || !variant.credit || variant.credit <= 0 || !variant.label || variant.label.trim() === '' )
    {
      Swal.fire( {
        icon: 'error',
        title: 'Invalid input',
        text: 'Label, price and credit must be valid and not empty.',
      } );
      const allVariantsValid = data.variants.every( variant =>
        variant.label?.trim() !== '' && variant.price > 0
      );
      setIsPublishButtonDisabled( allVariantsValid );
      return;
    }
    try
    {

      // Prepare the data to be sent
      const sendData = {
        uuid: data.uuid,
        price: variant.price,
        label: variant.label,
        credit: variant.credit
      };
      // Make the API call with the data
      const response = await instance.patch( `/product/variant/${ variant._id }`, sendData );

      // Log the response for debugging
      console.log( 'Saving variant data:', response.data );
    } catch ( error: any )
    {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      console.error( 'Error saving variant:', error );
    }
    setEditingVariantIndex( null ); // Exit edit mode for the variant
    setEditMode( prev => ( { ...prev, variants: false } ) );
  };

  const handleAddTag = () =>
  {
    if ( !data ) return;
    if ( newTag.trim() !== '' )
    {
      setFormData( { ...data, tags: [ ...data.tags, newTag.trim() ] } );
      setNewTag( '' ); // Clear the input field after adding the tag
    }
  };

  const handleDeleteTag = ( index: number ) =>
  {
    if ( !data ) return;
    const newTags = data.tags.filter( ( _, i ) => i !== index );
    setFormData( { ...data, tags: newTags } );
  };

  const handleStatusUpdate = async ( newStatus: string ) =>
  {
    if ( !data ) return;
    try
    {
      const updatedField = { status: newStatus };
      const response = await instance.patch( `/product/${ data.uuid }`, updatedField );
      if ( response.status === 201 )
      {
        setloader( false );
        // notifySuccess(`Product updated successfully`);
        Swal.fire( {
          icon: 'success',
          title: 'Product updated successfully',
          text: `Product updated successfully`

        } );
      }

    } catch ( error )
    {
      console.error( 'Error submitting form:', error );
    }
  };


  const handleStatusChange = async ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    const newStatus = e.target.value;
    setloader( true );
    console.log( 'Current selected value:', newStatus );
    setStatus( newStatus );
    await handleStatusUpdate( newStatus );
  };

  const handleCategoryChange = ( newValue: MultiValue<any>, actionMeta: ActionMeta<any> ) =>
  {
    setSelectedCategories( newValue as any[] );
  };
  const renderMedia = () =>
  {
    if ( !data ) return null;
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
  const updatedField = {};
  const editorChoiceCategory = "editor choice";

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
        // notifySuccess("Updated successfully");
        Swal.fire( {
          icon: 'success',
          title: 'Updated successfully',
          showConfirmButton: false,
          timer: 1500

        } );
        fetchData();
      }
    } catch ( error )
    {
      console.error( "Error updating category:", error );
    } finally
    {
      setloader( false );
    }
  };
  if ( !data )
  {
    return (
      <div role="status" className='justify-center h-screen flex items-center m-auto'>
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">
          <SpinnerLoader/>
        </span>
      </div>
    );
  }

  return (
    <>
      { loading ? <>
        <div role="status" className='justify-center h-screen flex items-center m-auto'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">
            <SpinnerLoader/>
          </span>
        </div>
      </> : ( <div className='container p-4 m-4 bg-pureWhite-light rounded-md'>
        <div className="flex flex-col p-6 pb-8 ">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Review Product </h1>
          </div>

          {/* one horixonal line */ }
          <hr className="border-t border-gray-300 mb-4" />
          <form className="mt-2 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 p-6">
                <div className="mb-4 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <div className='flex flex-row gap-4'>
                    <input
                      type="text"
                      name="title"
                      className={ `text-gray-700 w-full outline-none py-3 p-2 rounded-lg ${ !editMode.title ? 'bg-pageBg-light' : 'bg-gray-200' }` }
                      value={ data.title }
                      disabled={ !editMode.title }  // Correctly disable when not in edit mode
                      onChange={ ( e ) => handleChange( e, 'title' ) }
                    />
                    <button type="button" className={ `${ !editMode.title ? 'hidden' : 'block' }` } onClick={ () => { handleSave( 'title' ); handleEditToggle( 'title' ); } }><MdOutlineSave size={ 20 } /></button>
                    <button type="button" className={ `${ editMode.title ? 'hidden' : 'block' }` } onClick={ () => handleEditToggle( 'title' ) }><FaRegEdit size={ 25 } /></button>
                  </div>
                </div>
                <div className=" mb-4 flex flex-col">
                  <label className="w-52 gap-4 text-gray-700 flex flex-row text-sm font-bold mb-2" htmlFor="description">
                    Description
                    <button type="button" className={ `text-xl ${ !editMode.description ? 'hidden' : 'block' }` } onClick={ () => { handleSave( 'description' ); handleEditToggle( 'description' ); } }><MdOutlineSave size={ 20 } /></button>
                    <button type="button" className={ `${ editMode.description ? 'hidden' : 'block' }` } onClick={ () => handleEditToggle( 'description' ) }>
                      <FaRegEdit />
                    </button>
                  </label>
                  <textarea
                    name="description"
                    value={ data.description }
                    readOnly={ !editMode.description }
                    className='outline-none p-4 bg-pageBg-light h-72  rounded-lg'
                    onChange={ ( value ) => handleChange( value, 'description' ) } />

                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                    Media
                  </label>
                  <div className="border-dashed w-full border-2 justify-center flex items-center m-auto border-gray-300 p-4 rounded-lg">
                    { renderMedia() }
                  </div>
                </div>
                { data.mediaType === 'audio' ? data.variants.map( ( variant, index ) => (
                  <div key={ variant._id } className="bg-pageBg-light p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{ variant.size }</h3>
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
                ) ) :
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    { data.variants.map( ( variant, index ) => (
                      <div key={ variant._id } className="bg-pageBg-light p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">{ variant.size }</h3>
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
                }
              </div>
              <div className="flex flex-col bg-pureWhite-light p-6">
                <div className="my-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Product Status
                  </label>
                  <select
                    id="status"
                    value={ status }
                    onChange={ handleStatusChange }
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                  >
                    <option value="published">Available</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Delete</option>
                  </select>
                </div>
                <div className='py-8'>
                  <input
                    type='checkbox'
                    checked={ selected }
                    onChange={ handleCheck }
                  />
                  <span className='text-base mb-3 font-semibold px-3'>Editor choice</span>
                </div>
                <div className='text-xl flex flex-row gap-7 w-32 font-semibold'>Tags
                  <span className='flex items-center '>
                    { editMode.tags && (
                      <button type="button" onClick={ () => handleSave( 'tags' ) }><MdOutlineSave size={ 20 } /></button>
                    ) }
                    <button
                      type="button"
                      className={ `text-xl ${ !editMode.tags ? 'block' : 'hidden' }` }
                      onClick={ () => handleEditToggle( 'tags' ) }
                    >
                      <FaRegEdit size={ 22 } />
                    </button>
                  </span>
                </div>
                <div className='flex py-2 flex-wrap w-full'>
                  { data.tags.map( ( tag, index ) => (
                    tag.trim() !== '' && (
                      <span key={ index } className='flex gap-2 w-fit'>
                        <input
                          type="text"
                          value={ tag }
                          required
                          onChange={ ( e ) => handleTagChange( index, e.target.value ) }
                          disabled={ !editMode.tags }
                          className={ `bg-pageBg-light m-2 w-32 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 ` }
                        />
                        { editMode.tags && (
                          <button
                            type="button"
                            onClick={ () => handleDeleteTag( index ) }
                          >
                            <FaTrashAlt />
                          </button>
                        ) }
                      </span>
                    )
                  ) ) }
                  { editMode.tags && (
                    <div className='flex gap-2 items-center mt-2'>
                      <input
                        type="text"
                        value={ newTag }
                        onChange={ ( e ) => setNewTag( e.target.value ) }
                        className="  bg-gray w-36 rounded-md px-3 py-1 text-sm font-semibold text-gray-700  "
                        placeholder="Add new tag"
                      />
                      <button
                        type="button"
                        onClick={ handleAddTag }
                      >
                        <IoIosAddCircleOutline />
                      </button>
                    </div>
                  ) }
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mediaType">
                    Media Type
                  </label>
                  <input
                    id="mediaType"
                    type="text"
                    value={ data.mediaType }
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                    readOnly
                  />
                </div>
                <div className='mt-4'>
                  <label className="gap-5 text-gray-700 flex flex-row text-sm font-bold mb-2" htmlFor="category">
                    Category
                    <button type="button" className={ `${ !editMode.category ? 'hidden' : 'block' }` } onClick={ () => { handleSave( 'category' ); handleEditToggle( 'category' ); } }><MdOutlineSave size={ 20 } /></button>
                    <button type="button" className={ `${ editMode.category ? 'hidden' : 'block' }` } onClick={ () => handleEditToggle( 'category' ) }><FaRegEdit size={ 25 } /></button>

                  </label>
                  <div className='flex flex-wrap gap-4'>

                  </div>
                  { editMode.category ? <>
                    <div>
                      <Select
                        isMulti
                        name="categories"
                        options={ availableCategories }
                        className='basic-multi-select'
                        classNamePrefix="select"
                        onChange={ handleCategoryChange }
                      />
                    </div>
                  </> : <>
                    <div className='flex flex-wrap'>
                      { data.category
                        .filter( cat => cat !== "editor choice" )
                        .map( ( cat, index ) => (
                          <span key={ index } className='p-2 rounded-md m-2 font-semibold bg-gray-200 text-gray-600'>
                            { cat }
                          </span>
                        ) ) }
                    </div>
                  </> }
                </div>
              </div>
            </div>

          </form>
        </div>
      </div> ) }
    </> );
};

export default Form4;

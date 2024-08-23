import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineSave } from 'react-icons/md';
import Swal from 'sweetalert2';

interface Variant
{
  label: string;
  size: string;
  price: number;
  credit: number;
  key: string;
  _id: string;
}

interface Product
{
  uuid: string;
  title: string;
  variants: Variant[];
}

interface Form3Props
{
  onNext: ( data: any ) => void;
  formData: {
    product: Product;
  };
}

const Form3: React.FC<Form3Props> = ( { onNext, formData } ) =>
{
  const [ product, setProduct ] = useState( formData.product );
  const totalVariants = product?.variants?.length || 0;
  const [ activeVariant, setActiveVariant ] = useState<Variant | null>( null );
  const [ editingVariantIndex, setEditingVariantIndex ] = useState<number | null>( null );
  const [ label, setLabel ] = useState( '' );
  const [ price, setPrice ] = useState<number | ''>( '' );
  const [ updatedVariants, setUpdatedVariants ] = useState<string[]>( [] );
  const [ updateCount, setUpdateCount ] = useState( 0 );
  const [ loading, setLoading ] = useState( false );



  const handleSaveVariant = async ( index: number ) =>
  {
    const variant = product.variants[ index ];

    if ( !variant.price || variant.price <= 0 || !variant.credit || variant.credit <= 0 || !variant.label || variant.label.trim() === '' )
    {
      Swal.fire( {
        icon: 'error',
        title: 'Invalid input',
        text: 'Label, price and credit must be valid and not empty.',
      } );
      // const allVariantsValid = pro.variants.every(variant =>
      //   variant.label?.trim() !== '' && variant.price > 0
      // );
      // setIsPublishButtonDisabled(allVariantsValid);
      return;
    }
    try
    {
      const sendData = {
        uuid: product.uuid,
        price: variant.price,
        label: variant.label,
        credit: variant.credit
      };

      const response = await instance.patch( `/product/variant/${ variant._id }`, sendData );
      if ( response.status === 201 )
      {
        console.log( 'Saving variant data:', response.data );
        setUpdatedVariants( [ ...updatedVariants, variant._id ] );

      }
    } catch ( error: any )
    {
      console.error( 'Error saving variant:', error );
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
    }
    setEditingVariantIndex( null );
  };

  const handleVariantChange = ( index: number, key: keyof Variant, value: string | number ) =>
  {
    console.log( "first", value );
    const newVariants = [ ...product.variants ];
    newVariants[ index ] = {
      ...newVariants[ index ],
      [ key ]: value
    } as Variant;
    // formData.product.variants = newVariants;
    setProduct( { ...product, variants: newVariants } );

  };

  const handleEditToggle = ( field: string, index?: number ) =>
  {
    if ( index !== undefined )
    {
      setEditingVariantIndex( prev => ( prev === index ? null : index ) );
    }
  };

  const handleSubmit = async () =>
  {
    setLoading( true );
    try
    {
      const response = await instance( `/product/${ product.uuid }` );
      if ( response.status === 201 )
      {
        onNext( response.data );
      }
    } catch ( error: any )
    {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      console.log( "Error occurred", error );
    }
    setLoading( false );
  };
  const allVariantsUpdated = product.variants.every( ( variant ) =>
    updatedVariants.includes( variant._id )
  );
  console.log( "first", allVariantsUpdated );
  return (
    <>
      { loading ? (
        <div role="status" className="flex items-center justify-center h-screen">
          <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-lime-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">
            <Spinner label="Loading..." color="danger" />
          </span>
        </div>
      ) : (
        <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
          {/* <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              { product.title }
            </h1>
          </div> */}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Variations</h2>
            <p className="text-gray-600 italic">This product has different colors, sizes, etc.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            { product.variants.map( ( variant, index ) => (
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

          <div className="mt-8 flex justify-center my-12">
            <button
              disabled={ !allVariantsUpdated }
              type="button"
              className={ `bg-webred text-white px-4 py-2 rounded-lg font-semibold transition-colors ${ allVariantsUpdated ? 'hover:bg-webred' : 'opacity-50 cursor-not-allowed'
                }` }
              onClick={ handleSubmit }
            >
              Save and Continue
            </button>
          </div>
        </div>
      ) }
    </>
  );
};

export default Form3;

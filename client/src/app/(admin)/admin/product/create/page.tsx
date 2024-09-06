"use client";
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import instance from '@/utils/axios';
import React, { useEffect, useState } from 'react';
const Form1 = dynamic( () => import( '@/components/admin/product/product_form1' ), { ssr: false } );
const Form2 = dynamic( () => import( '@/components/admin/product/product_form2' ), { ssr: false } );
const Form3 = dynamic( () => import( '@/components/admin/product/product_form3' ), { ssr: false } );
const Form4 = dynamic( () => import( '@/components/admin/product/product_form4' ), { ssr: false } );


const ProductCreatePage = () =>
{

  const searchParams = useSearchParams();
  const uuid = searchParams.get( 'uuid' );
  const [ formData, setFormData ] = useState<any>( {} );
  const [ currentForm, setCurrentForm ] = useState( 1 );
  useEffect( () =>
  {
    if ( uuid )
    {
      instance( `/product/${ uuid }` )
        .then( ( response: any ) =>
        {
          const data = response.data;
          setFormData( data );
          console.log( "first", data.product );
          if ( data )
          {
            if ( data.product.thumbnailKey )
            {
              setCurrentForm( 4 );
            } else
            {
              setCurrentForm( 2 );
              console.log( "first", data );
            }
          } else
          {
            setCurrentForm( 1 );
          }
        } )
        .catch( () =>
        {
          setCurrentForm( 1 );
        } );
    }
  }, [ uuid ] );

  const handleNext = ( data: any ) =>
  {
    setFormData( ( prevData: any ) => ( { ...prevData, ...data } ) );
    setCurrentForm( currentForm + 1 );
  };

  const handlePrev = () =>
  {
    setCurrentForm( currentForm - 1 );
  };

  return (
    <div className="container p-4 bg-pureWhite-light min-h-screen rounded-lg">
      <div>
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold">Add product</h2>
        </div>
        <div className='p-6'>
          { currentForm === 1 && <Form1 onNext={ handleNext } /> }
          { currentForm === 2 && <Form2 onNext={ handleNext } onPrev={ handlePrev } formData={ formData } /> }
          { currentForm === 3 && <Form3 onNext={ handleNext } formData={ formData } /> }
          { currentForm === 4 && <Form4 formData={ formData } /> }
        </div>

      </div>
    </div>

  );
};

export default ProductCreatePage;

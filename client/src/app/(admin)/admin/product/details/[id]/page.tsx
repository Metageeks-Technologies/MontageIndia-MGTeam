"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import instance from "@/utils/axios";
import { Spinner } from "@nextui-org/react";

export interface Variant
{
  label: string;
  price: number;
  key: string;
  size: string;
  _id: string;
}

export interface Product
{
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  uuid: string;
  status: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
  variants: Variant[];
}

const ProductDetail: React.FC = () =>
{
  const params = useParams();
  const [ productDetail, setProductDetail ] = useState<Product | null>( null );
  const [ loading, setLoading ] = useState( false );
  const router = useRouter();
  const BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;
  const AwsRegiosn = process.env.NEXT_PUBLIC_AWS_REIGION;

  const id = params.id as string | undefined;
  const fetchProduct = async ( id: string ) =>
  {
    setLoading( true );

    try
    {
      const response = await instance.get( `/product/${ id }` );
      if ( response.status === 201 )
      {
        setProductDetail( response.data.product );
        setLoading( false );
      }
      console.log( response.data.product );
    } catch ( error )
    {
      console.error( "Error fetching product:", error );
    } finally
    {
      setLoading( false );
    }
  };
  const renderMedia = () =>
  {
    switch ( productDetail?.mediaType )
    {
      case 'audio':
        return <>
          <audio controls>
            <source src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ productDetail.thumbnailKey }` } type="audio/mpeg" />
          </audio>
        </>;
      case 'image':
        return <img
          className="w-full h-64 object-cover"
          src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ productDetail.thumbnailKey }` } alt="Product Media" />;
      case 'video':
        return <>
          <video width="320" height="240" controls>
            <source src={ `https://${ BucketName }.s3.${ AwsRegiosn }.amazonaws.com/${ productDetail.thumbnailKey }` } type="video/mp4" />
          </video>
        </>;
      default:
        return <p>No media available</p>;
    }
  };
  useEffect( () =>
  {
    if ( id )
    {
      fetchProduct( id );
    }
  }, [ id ] );

  if ( loading )
  {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading..." color="danger" />
      </div>
    );
  }

  if ( !productDetail )
  {
    return <div className="flex items-center justify-center min-h-screen">
      <h1>
        No product found
      </h1>
    </div>;
  }

  const handleEditClick = () =>
  {
    router.push( `/admin/product/create?uuid=${ productDetail.uuid }` );
  };


  const capitalizeFirstLetter = ( string: string ) =>
  {
    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
  };

  return (
    <div className="container p-4 m-4 bg-pureWhite-light rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Update Product</h1>
      </div>

      {/* one horixonal line */ }
      <hr className="border-t border-gray-300 mb-4" />

      <div className="mt-2 mx-auto bg-pureWhite-light  shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={ productDetail.title }
                onChange={ ( e ) => setProductDetail( { ...productDetail, title: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={ productDetail.description }
                onChange={ ( e ) => setProductDetail( { ...productDetail, description: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                rows={ 5 }
                readOnly
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                Media
              </label>
              <div className="border-dashed border-2 justify-center flex items-center m-auto border-gray-300 p-4 rounded-lg">
                { productDetail.thumbnailKey ? <>{ renderMedia() }</> : <>
                  <img src='/images/images.png' className='h-24' alt='product image unavailable' /></> }
              </div>

            </div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Pricing</label>
              <input
                type="number"
                value={ productDetail.variants[ 0 ]?.price }
                onChange={ ( e ) =>
                  setProductDetail( {
                    ...productDetail,
                    variants: [ { ...productDetail.variants[ 0 ], price: parseFloat( e.target.value ) } ],
                  } )
                }
                className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                readOnly
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                id="variation"
                type="checkbox"
                className="mr-2 "
                checked={ productDetail.variants.length > 1 }
                readOnly
              />
              <label className="block text-gray-700 text-sm" htmlFor="variation">
                This product is variable, has different colors, size, etc.
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={ productDetail.category }
                onChange={ ( e ) => setProductDetail( { ...productDetail, category: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                readOnly
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Product Status
              </label>
              <select
                id="status"
                value={ productDetail?.status }
                onChange={ ( e ) => setProductDetail( { ...productDetail, status: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                disabled
              >
                <option value={ productDetail?.status }>{ capitalizeFirstLetter( productDetail?.status ) }</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="flex flex-wrap">
                { productDetail.tags.map( ( tag, index ) => (
                  <span
                    key={ index }
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    { tag }
                  </span>
                ) ) }
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="variants">
                Variants
              </label>
              { productDetail.variants.map( ( variant, index ) => (
                <div key={ variant._id } className="mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{ variant.size }</strong>
                    </div>
                    <div>${ variant.price }</div>
                  </div>
                  <input
                    type="text"
                    value={ variant.label }
                    className="w-full px-3 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none bg-pageBg-light"
                    readOnly
                  />
                </div>
              ) ) }
            </div>
          </div>
        </div>
        <div className="flex justify-center p-6 bg-gray-50">
          <button onClick={ handleEditClick } className="px-4 py-2 bg-webred text-white rounded-lg hover:bg-webred-light hover:text-black">
            Complete & Publish
          </button> 
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

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
  const [ isEditing, setIsEditing ] = useState( false );
  const [ loading, setLoading ] = useState( false );

  const id = params.id as string | undefined;
  console.log( "first", id );
  const fetchProduct = async ( id: string ) =>
  {
    setLoading( true );

    try
    {
      const response = await instance.get( `/product/${ id }` );
      console.log( "response from detail page:-", response );

      // const product = response.data.products.find((p: Product) => p._id === id);
      setProductDetail( response.data.product );
      console.log( response.data.product );
    } catch ( error )
    {
      console.error( "Error fetching product:", error );
    } finally
    {
      setLoading( false );
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
        <Spinner label="Loading..." color="success" />
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

  const router = useRouter();
  const handleEditClick = () =>
  {
    router.push( `/admin/product/create?uuid=${ productDetail.uuid }` );
    setIsEditing( !isEditing );
  };

  const handleFileUpload = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    if ( event.target.files && event.target.files[ 0 ] )
    {
      const file = event.target.files[ 0 ];
      // Handle file upload logic here
      console.log( file );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-start">Edit Product</h1>
      <div className="mt-2 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly={ !isEditing }
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
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                rows={ 5 }
                readOnly={ !isEditing }
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                Media
              </label>
              <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                <img
                  className="w-full h-64 object-cover"
                  // src={`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${productDetail.thumbnailKey}`}
                  src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ productDetail.thumbnailKey }` }
                  alt={ productDetail.title }
                />
              </div>
              { isEditing && (
                <input type="file" onChange={ handleFileUpload } className="mt-2" />
              ) }
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
                className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly={ !isEditing }
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                id="variation"
                type="checkbox"
                className="mr-2"
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
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly={ !isEditing }
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
                value={ productDetail.status }
                onChange={ ( e ) => setProductDetail( { ...productDetail, status: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                disabled={ !isEditing }
              >
                <option value="available">Available</option>
                <option value="out of stock">Out of Stock</option>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mediaType">
                Media Type
              </label>
              <input
                id="mediaType"
                type="text"
                value={ productDetail.mediaType }
                onChange={ ( e ) => setProductDetail( { ...productDetail, mediaType: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly={ !isEditing }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publicKey">
                Public Key
              </label>
              <input
                id="publicKey"
                type="text"
                value={ productDetail.publicKey }
                onChange={ ( e ) => setProductDetail( { ...productDetail, publicKey: e.target.value } ) }
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                readOnly={ !isEditing }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="variants">
                Variants
              </label>
              { productDetail.variants.map( ( variant, index ) => (
                <div key={ variant._id } className="mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{ variant.label }</strong> ({ variant.size })
                    </div>
                    <div>${ variant.price }</div>
                  </div>
                  <input
                    type="text"
                    value={ variant.key }
                    className="w-full px-3 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none"
                    readOnly
                  />
                </div>
              ) ) }
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 bg-gray-50">
          <button onClick={ handleEditClick } className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
            { isEditing ? "Save" : "Edit" }
          </button>
          <button className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

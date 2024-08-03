import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineSave } from 'react-icons/md';
import Swal from 'sweetalert2';

interface Variant {
  label: string;
  price: number;
  key: string;
  _id: string;
}

interface Product {
  uuid: string;
  title: string;
  variants: Variant[];
}

interface Form3Props {
  onNext: (data: any) => void;
  formData: {
    product: Product;
  };
}

const Form3: React.FC<Form3Props> = ({ onNext, formData }) => {
  const { product } = formData || {};
  const totalVariants = product?.variants?.length || 0;
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [updatedVariants, setUpdatedVariants] = useState<string[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (variant: Variant, index: number) => {
    setActiveVariant({ ...variant });
    setLabel(variant.label);
    setPrice(variant.price);
  };

  const handleSave = async () => {
    if (!activeVariant) return;
    const { _id } = activeVariant;
    const uuid = product.uuid;
    const postData = { uuid, label, price };

    try {
      const response = await instance.patch(`/product/variant/${_id}`, postData);
      if (response.data) {
        setLabel('');
        setPrice('');
        setUpdatedVariants([...updatedVariants, _id]);
        setActiveVariant(null);
        setUpdateCount(updateCount + 1);
      }
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleSaveVariant = async (index: number) => {
    try {
      const variant = product.variants[index];
      const sendData = {
        uuid: product.uuid,
        price: variant.price,
        label: variant.label
      };

      const response = await instance.patch(`/product/variant/${variant._id}`, sendData);
      console.log('Saving variant data:', response.data);
    } catch (error: any) {
      console.error('Error saving variant:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
    setEditingVariantIndex(null);
  };

  const handleVariantChange = (index: number, key: keyof Variant, value: string | number) => {
    const newVariants = [...product.variants];
    newVariants[index] = {
      ...newVariants[index],
      [key]: value
    } as Variant;
    formData.product.variants = newVariants;
  };

  const handleEditToggle = (field: string, index?: number) => {
    if (index !== undefined) {
      setEditingVariantIndex(prev => (prev === index ? null : index));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await instance(`/product/${product.uuid}`);
      if (response.status === 201) {
        onNext(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
      console.log("Error occurred", error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div role="status" className='justify-center h-screen flex items-center m-auto'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">
            <Spinner label="Loading..." color="success" />
          </span>
        </div>
      ) : (
        <div>
          <div className='flex gap-3 flex-row'>
            <span className='text-xl font-semibold'>Title</span>
            <span className='font-semibold text-lg text-gray-600'>{product.title}</span>
          </div>
          <span className='font-semibold text-xl my-3'>Variation
            <p className='font-medium text-sm'>The product is variable, has different colors, size, etc.</p>
          </span>

          <div className='p-4 text-balance flex justify-start flex-col font-semibold'>
            {product.variants.map((variant, index) => (
              <React.Fragment key={variant._id}>
                <div className="w-72 gap-4 text-gray-700 flex flex-row text-sm font-bold mb-2">
                  Version {index + 1}
                  {editingVariantIndex === index ? (
                    <button type="button" onClick={() => handleSaveVariant(index)}>
                      <MdOutlineSave size={20} />
                    </button>
                  ) : (
                    <button type="button" onClick={() => handleEditToggle('variants', index)}>
                      <FaRegEdit size={20} />
                    </button>
                  )}
                </div>
                <div className='flex flex-row'>
                <div className='flex flex-col sm:flex-row m-2 gap-8'>
                  <span className='flex flex-row items-center justify-between w-20'>Label:</span>
                  <input
                    type="text"
                    className={`text-gray-700 w-fit outline-none py-3 p-2 rounded-lg ${editingVariantIndex === index ? 'border border-gray-600' : 'bg-gray-100'}`}
                    value={variant.label}
                    disabled={editingVariantIndex !== index}
                    onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                  />
                </div>
                <div className='flex flex-col sm:flex-row m-2 gap-8'>
                  <span className='flex flex-row items-center justify-between w-20'>Price:</span>
                  <input
                    type="number"
                    className={`text-gray-700 w-fit outline-none py-3 p-2 rounded-lg ${editingVariantIndex === index ? 'border border-gray-600' : 'bg-gray-100'}`}
                    value={variant.price}
                    disabled={editingVariantIndex !== index}
                    onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                  />
                </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-lime-400 text-white rounded-md"
            onClick={handleSubmit}
          >
            Save and Continue
          </button>
        </div>
      )}
    </>
  );
};

export default Form3;

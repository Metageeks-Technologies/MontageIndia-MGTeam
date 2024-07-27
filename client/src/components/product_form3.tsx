import instance from '@/utils/axios';
import React, { useState } from 'react';

const Form3 = ({onNext, formData }: any) => {
  const data = formData || {};  
  const product = data.product;
  const [activeVariant, setActiveVariant] = useState<any>(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [updatedVariants, setUpdatedVariants] = useState<any[]>([]);

  console.log("first",data)
  const handleButtonClick = (variant: any) => {
    setActiveVariant(variant);
    setLabel(variant.label || '');
    setPrice(variant.price || '');
  };

  const handleSave = async () => {
    if (!activeVariant) return;
    console.log("variant",activeVariant);
    const { _id } = activeVariant;
    const uuid=product.uuid;
    console.log("id",uuid)
    const postData = { uuid, label, price };
    console.log("data",postData)
    try {
      const response = await instance.patch(`/product/variant/${_id}`, postData);
      if (response.data) {
        console.log(`Variant ID: ${_id}, UUID: ${uuid}, Label: ${label}, Price: ${price}`);

        setLabel('');
        setPrice('');
        setUpdatedVariants([...updatedVariants, _id]);
        setActiveVariant(null);
      }
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleSubmit=()=>{
    onNext(product)
  }
  return (
    <div className=''>
      <h1 className='font-semibold text-2xl'>{product.title}</h1>
      <span className='font-semibold text-xl my-3'>Variation
        <p className='font-medium text-sm'>The product is variable, has different colors, size, etc.</p>
      </span>

      <div className='p-4 text-balance font-semibold'>
        {product.variants.map((variant: any) => (
          <div
            key={variant._id}
            onClick={() => handleButtonClick(variant)}
            className={`w-2/4 py-3 cursor-pointer bg-lime-400 text-white justify-center flex rounded-lg px-5 m-5 ${updatedVariants.includes(variant._id) ? 'cursor-not-allowed ' : ''}`}
            style={{ pointerEvents: updatedVariants.includes(variant._id) ? 'none' : 'auto' }}
            >
            <button>{variant.size}</button>
          </div>
        ))}
      </div>
      <div className='justify-between flex w-auto gap-5'>
      <button onClick={handleSubmit}  className={`p-2 px-3 w-fit font-semibold text-white rounded-lg  
            // file ? 'bg-lime-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          `} 
        >
          Next</button>
    </div>
      {activeVariant && (
        <div className='p-3 h-screen w-full justify-center z-30 bg_glass top-0 left-0 bg-black bg-opacity-15 items-center flex m-auto absolute'>
          <div className='flex flex-col rounded-xl justify-center items-center'>
            <h3>Editing Variant: {activeVariant._id}</h3>
            <div>
              <label>
                <span className='font-semibold'>Label:</span>
                <input
                  type="text"
                  value={label}
                  className='text-gray-700 outline-none py-2 mx-2 p-2 bg-gray-100 rounded-lg'
                  onChange={(e) => setLabel(e.target.value)}
                />
              </label>
            </div>
            <div className='my-3'>
              <label>
                <span className='font-semibold'>Price:</span>
                <input
                  type="number"
                  value={price}
                  className='text-gray-700 outline-none py-2 mx-2 p-2 bg-gray-100 rounded-lg'
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
            <div className='flex flex-row justify-between'>
            <button
              className='bg-lime-500 font-medium px-3 py-1 rounded-lg text-teal-50'
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className='bg-red-500 font-medium px-3 py-1 rounded-lg text-teal-50 mt-2'
              onClick={() => setActiveVariant(null)}
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form3;

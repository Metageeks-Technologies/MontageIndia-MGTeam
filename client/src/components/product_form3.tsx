import instance from '@/utils/axios';
import React, { useState } from 'react';

const Form3 = ({onNext, formData }: any) => {
  const data = formData || {};  
  const product = data.product;
  const totalVariants = product.variants.length;
  const [activeVariant, setActiveVariant] = useState<any>(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [updatedVariants, setUpdatedVariants] = useState<any[]>([]);
  const[nextdata,setnext]=useState<any>(null);
  const [updateCount, setUpdateCount] = useState(0);
  console.log("first",data)
  const handleButtonClick = (variant: any,index:number) => {
    setActiveVariant({...variant,index});
    setLabel(variant.label || '');
    setPrice(variant.price || '');
  };
    console.log(product.variants)
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
        setnext(response.data.product)
        setUpdatedVariants([...updatedVariants, _id]);
        setActiveVariant(null);
        setUpdateCount(updateCount + 1); 
      }
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleSubmit=()=>{
    onNext(nextdata)
  }
  return (
    <div className=''>
       <div className='flex gap-3 flex-row'>
        <span className='text-xl font-semibold'>Title</span>
        <span className='font-semibold text-lg text-gray-600'>{product.title}</span>
      </div>
      <span className='font-semibold text-xl my-3'>Variation
        <p className='font-medium text-sm'>The product is variable, has different colors, size, etc.</p>
      </span>

      <div className='p-4 text-balance flex items-center justify-center flex-col font-semibold'>
        {product.variants.map((variant: any,index: number) => (
          <div
            key={variant._id}
            onClick={() => handleButtonClick(variant,index)}
            className={`w-2/4 py-3 cursor-pointer bg-lime-400  text-white justify-center flex rounded-lg px-5 m-5 ${updatedVariants.includes(variant._id) ? 'cursor-not-allowed pointer-events-none bg-lime-800 text-red-300' : ''}`}
            >
            <button>Variant {index +1}</button>
          </div>
        ))}
      </div>
      <div className='justify-center items-center flex w-auto gap-5'>
      <button onClick={handleSubmit} 
      className={`p-2 px-3 text-center w-28 items-center m-auto justify-center flex font-semibold text-white rounded-lg ${updateCount === totalVariants ? 'bg-lime-400' : 'bg-gray-400 cursor-not-allowed'}`} 
      disabled={updateCount !== totalVariants}  >
          Next
      </button>
      </div>
      {activeVariant && (
        <div className='p-3 h-screen w-full justify-center z-50 bg_glass top-0 left-0 bg-black bg-opacity-15 items-center flex m-auto absolute'>
          <div className='flex flex-col rounded-xl justify-center gap-10  items-center'>
            <div className='font-semibold text-2xl pb-8'>Variant {activeVariant.index +1}</div>
            <div className=''>
              <label>
                <span className='font-semibold'>Label:</span>
                <input
                  type="text"
                  value={label}
                  required
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
                  required
                  value={price}
                  className='text-gray-700 outline-none py-2 mx-2 p-2 bg-gray-100 rounded-lg'
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
            <div className='flex flex-row w-full justify-between'>
            <button
              className='bg-red-500 font-medium px-3 py-1 rounded-lg text-teal-50 mt-2'
              onClick={() => setActiveVariant(null)}
            >
              Cancel
            </button>
            <button
              className={`font-medium px-3 py-1 rounded-lg mt-2 text-teal-50 ${label && price ? 'bg-lime-500' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={handleSave}
              disabled={!label || !price}
            >
              Save
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form3;

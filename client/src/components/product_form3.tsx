import React, { useState } from 'react';
// import AWS from 'aws-sdk';

const Form2 = ({ onPrev }: any) => {
    const [error, setError] = useState('');
    const[labels,setLabels]=useState('');
    const [variants, setVariants] = useState([{ label: '', price: 0, key: '' ,labels:''}]);

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    // newVariants[index][field] = value;
    setVariants(newVariants);
  };
    
  
  
  const addVariant = () => {
    setVariants([...variants, { label: '', price: 0, key: '',labels }]);
  };

  const handleFileChange = async (index: number) => {
    // const s3 = new AWS.S3();
    console.log(variants,index)
    // const key = `variants/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newVariants = [...variants];
    // newVariants[index].key = key;
    setVariants(newVariants);
  };

  const handleSubmit = () => {
    console.log(variants)
  };

  return (
    <div className='flex flex-col items-center w-full gap-5 h-full justify-center m-5'>
      {variants.map((variant, index) => (
        <div key={index} className='flex flex-col items-center w-full gap-3'>
          <input
            placeholder="Label"
            className='text-black p-1'
            // value={variant.label}
            value={labels}
            onChange={(e) => setLabels(e.target.value)}

            // onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
          />
          <input
            placeholder="Price"
            type="number"
            className='text-black p-1'
            value={variant.price}
            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
          />
          <button onClick={() => handleFileChange(index)} className='p-2 px-3 bg-blue-500 rounded-lg'>
            Generate Key
          </button>
          {variant.key && <p className='text-green-500'>Key: {variant.key}</p>}
        </div>
      ))}
      <button onClick={addVariant} className='p-2 px-3 bg-gray-500 rounded-lg'>
        Add Variant
      </button>
      <div className='justify-between flex w-auto gap-5'>
        <button onClick={onPrev} className='p-2 px-3 bg-red-400 rounded-lg'>
          Prev
        </button>
        <button onClick={handleSubmit} className='p-2 px-3 text-orange-500 text-opacity-75   bg-white font-semibold rounded-lg'>
          Submit
        </button>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default Form2;

import React, { useState } from 'react';
// import AWS from 'aws-sdk';

const Form2 = ({ formData }: any) => {

  const data = formData || {}; // Default to an empty object if formData is undefined
  const product= data.product;
    const [activeVariant, setActiveVariant] = useState(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');

  const handleButtonClick = (variant:any) => {
    setActiveVariant(variant._id);
  };

  const handleSave = () => {
    // Add logic to save label and price for the active variant
    console.log(`Variant ID: ${activeVariant}, Label: ${label}, Price: ${price}`);
    setActiveVariant(null);  // Reset the active variant
  };

  return (
    <div className='flex flex-col items-center w-full m-auto gap-5 mt-16 h-full justify-center'>
      <h1 className='font-semibold text-2xl'>{product.title}</h1>
      <div className='p-4  text-balance font-semibold'>

        {product.variants.map((variant:any) => (
          <div key={variant._id} className='bg-indigo-800 py-2  justify-center flex rounded-2xl px-5 m-5'>
            <button onClick={() => handleButtonClick(variant)}>{variant.size}</button>
          </div>
        ))}
      </div>
      
      {activeVariant && (
        <div className='bg-violet-600 rounded-xl p-3 flex flex-col absolute h-[50%] mt-15 justify-center items-center'>
          <h3>Editing Variant: {activeVariant}</h3>
          <div>
            <label>
              <span className='font-semibold'>Label:</span>
              <input 
                type="text" 
                value={label} 
                className='text-black  px-2 rounded-md font-semibold m-3 bg-gray-500'
                onChange={(e) => setLabel(e.target.value)} 
              />
            </label>
          </div>
          <div>
            <label>
            <span className='font-semibold'>Price:</span>
            <input 
                type="text" 
                value={price} 
                className='text-black  px-2 rounded-md font-semibold m-3 bg-gray-500'
                onChange={(e) => setPrice(e.target.value)} 
              />
            </label>
          </div>
          <button className='bg-fuchsia-900 px-3 py-1 rounded-lg hover:bg-fuchsia-800' onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Form2;

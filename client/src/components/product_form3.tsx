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
    <div className='relative'>
    <h1 className='font-semibold text-2xl'>{product.title}</h1>
    <span className='font-semibold text-xl my-3'>Variation
      <p className='font-medium text-sm'>The product is variable,has different colors,size etc</p>
    </span>
    
      <div className='p-4  text-balance font-semibold'>

        {product.variants.map((variant:any) => (
          <div key={variant._id} onClick={() => handleButtonClick(variant)} className='w-2/4 py-3 cursor-pointer bg-lime-400 text-white justify-center flex rounded-lg px-5 m-5'>
            <button >{variant.size}</button>
          </div>
        ))}
      </div>
      
      {activeVariant && (
        <div className=' p-3 rounded-xl  bg-white w-auto m-auto    flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2justify-center items-center'>
          {/* <h3>Editing Variant: {activeVariant}</h3> */}
          <div>
            <label>
              <span className='font-semibold'>Label:</span>
              <input 
                type="text" 
                value={label} 
                className='text-gray-700 outline-none py-2 mx-2 p-2 bg-gray-100 rounded-lg '
                onChange={(e) => setLabel(e.target.value)} 
              />
            </label>
          </div>
          <div className='my-3'>
            <label>
            <span className='font-semibold'>Price:</span>
            <input 
                type="text" 
                value={price} 
                className='text-gray-700 outline-none py-2 mx-2 p-2 bg-gray-100 rounded-lg '
                onChange={(e) => setPrice(e.target.value)} 
              />
            </label>
          </div>
          <button className='bg-lime-500 font-medium px-3 py-1 rounded-lg text-teal-50' onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Form2;

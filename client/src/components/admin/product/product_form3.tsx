import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Form3 = ({onNext, formData }: any) => {
  const data = formData || {};  
  const product = data.product;
  const totalVariants = product.variants.length;
  const [activeVariant, setActiveVariant] = useState<any>(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [updatedVariants, setUpdatedVariants] = useState<any[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const[loading,setloader]=useState(false)


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
        setUpdatedVariants([...updatedVariants, _id]);
        setActiveVariant(null);
        setUpdateCount(updateCount + 1); 
      }
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleSubmit=async()=>{
    setloader(true)
    try {
      const response=await instance(`/product/${product.uuid}`)
      console.log(response.data.product)
      if(response.status===201){
        setloader(false)
        onNext(response.data)
      }
    } catch (error:any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';

      setloader(false)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      }); 
     console.log("Error occurred",error)
      
    }
   
  }
  return <>
    {loading?<>
      <div role="status" className='justify-center h-screen flex items-center m-auto'>
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
          <span className="sr-only">
              <Spinner label="Loading..." color="success" />
        </span>
        </div>
        </>:(<>
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
        <div className='p-3 h-screen w-full justify-center z-50  top-0 left-0 5 items-center flex m-auto absolute'>
          <div className='flex  rounded-xl justify-center gap-10  items-center'>
            <div className='flex-col bg_glass p-8 bg-white/90 rounded-2xl flex'>
            <div className='font-semibold m-auto items-center flex text-2xl pb-8'>Variant {activeVariant.index +1}</div>
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
        </div>
      )}
    </div>
  </>)}
  </>;
};

export default Form3;

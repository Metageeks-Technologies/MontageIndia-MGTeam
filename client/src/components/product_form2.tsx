import React, { useState } from 'react';

const Form2 = ({ onPrev ,onNext}: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const[name,setname]=useState('')
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log("ff",selectedFile)
    if (selectedFile) { 
      const fileType = selectedFile.type;
      console.log("Dsdsd",fileType)
      setname(selectedFile.name)
      const validTypes = ['image/jpeg','image/jpg','image/png', 'audio/*', 'video/*'];
      
      if (validTypes.some(type => fileType.startsWith(type))) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Invalid file type. Please upload an image, audio, or video file.');
      }
    }
  };

  const handleSubmit = () => {
    if (file) {
      // Handle file upload
      console.log('File ready for upload:', file);
      onNext();
    } else {
      setError('Please select a valid file before submitting.');
    }
  };

  return (
    <div className='flex flex-col   items-center w-full m-auto gap-5 mt-16 h-full justify-center '>
      <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed m-5 rounded-lg cursor-pointer hover:bg-gray-700 bg-gray-800   dark:hover:border-gray-500 ">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  {!name?(<> 
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                    Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p></>):(<span className='font-semibold'>{name}</span>)}
                  
              </div>
              <input
              type='file'
              id='dropzone-file'
              className='hidden'
              accept='image/*,audio/*,video/*'
              onChange={handleFileChange}
            />    </label>
      </div> 
      {error && <p className='text-red-500'>{error}</p>}
      <div className='justify-between flex w-auto gap-5'>
        <button onClick={onPrev} className='p-2 px-3 bg-red-400 rounded-lg'>
          Prev
        </button>
        <button onClick={handleSubmit} className='p-2 px-3 text-orange-500 text-opacity-75   bg-white rounded-lg'>
          Next
        </button>
      </div>
      
    </div>
  );
};

export default Form2;

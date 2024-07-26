import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { Accept, useDropzone } from 'react-dropzone';


interface FormData {
  uuid: string;
  mediaType: string;
}

const Form2 = ({ onPrev, onNext, formData }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const datas = formData || {}; // Default to an empty object if formData is undefined
  const data = datas.product;
  

  const validateFileType = (fileType: string): boolean => {
    if (!data.mediaType) {
      return true; // No mediaType specified, allow any file type
    }

    switch (data.mediaType) {
      case 'image':
        return fileType.startsWith('image/');
      case 'audio':
        return fileType.startsWith('audio/');
      case 'video':
        return fileType.startsWith('video/');
      default:
        return false;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      console.log("Selected media type:", data.mediaType);
      console.log("Selected file type:", selectedFile.type);
      if (validateFileType(selectedFile.type)) {
        setFile(selectedFile);
        setName(selectedFile.name);
        setError('');
      } else {
        setError(`Selected file type does not match the expected media type (${data.mediaType}).`);
      }
    }
  }, [data.mediaType]);

  const getAcceptableFileTypes = (): Accept => {
    if (!data.mediaType) {
      return {}; // Default to no specific types if mediaType is not defined
    }

    switch (data.mediaType) {
      case 'image':
        return { 'image/*': ['.jpeg', '.jpg', '.png'] };
      case 'audio':
        return { 'audio/*': ['.mp3', '.wav'] };
      case 'video':
        return { 'video/*': ['.mp4', '.avi'] };
      default:
        return {}; // No specific file types if mediaType is unknown
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: getAcceptableFileTypes(),
    maxFiles: 1,
  });

  const handleImageSubmit = async (file:any, data:any) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uuid', JSON.stringify(data.uuid));
    formData.append('mediaType', JSON.stringify(data.mediaType));
  
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/media/image/reduce`;
  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        const responseData = response.data;
        console.log('Upload success:', responseData);
        onNext(responseData);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('An error occurred while uploading the image.');
    }
  };
  
  const handleAudioSubmit = async (file:any, data:any) => {
    console.log(file,data);
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('uuid', JSON.stringify(data.uuid));
    formData.append('mediaType', JSON.stringify(data.mediaType));

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/media/audio/reduce`;
  
    try {    
      const response = await axios.post(url, formData,{
        headers: {
          "Content-Type": "multipart/form-data"},
      });
      if (response.status === 201) {
        const responseData = response.data;
        console.log('Upload success:', responseData);
        onNext(responseData);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError('An error occurred while uploading the audio.');
    }
  };
  
  const handleVideoSubmit = async (file:any, data:any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uuid', JSON.stringify(data.uuid));
    formData.append('mediaType', JSON.stringify(data.mediaType));
  
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/media/video/reduce`;
  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        const responseData = response.data;
        console.log('Upload success:', responseData);
        onNext(responseData);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('An error occurred while uploading the video.');
    }
  };
  
  const handleSubmit = async () => {
    if (file) {
      switch (data.mediaType) {
        case 'image':
          await handleImageSubmit(file, data);
          break;
        case 'audio':
          await handleAudioSubmit(file, data);
          break;
        case 'video':
          await handleVideoSubmit(file, data);
          break;
        default:
          setError('Invalid media type.');
      }
    } else {
      setError('Please select a valid file before submitting.');
    }
  };
  

  return (
    <div className='flex flex-col items-center w-full m-auto gap-5 mt-16 h-full justify-center'>
      <div {...getRootProps()} className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed m-5 rounded-lg cursor-pointer hover:bg-gray-700 bg-gray-800 dark:hover:border-gray-500">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          {!name ? (
            <>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF, MP3, MP4 (MAX. 800x400px)</p>
            </>
          ) : (
            <span className='font-semibold'>{name}</span>
          )}
        </div>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      <div className='justify-between flex w-auto gap-5'>
        <button onClick={onPrev} className='p-2 px-3 bg-red-400 rounded-lg'>Prev</button>
        <button onClick={handleSubmit} className='p-2 px-3 text-orange-500 text-opacity-75 bg-white rounded-lg'>Next</button>
      </div>
    </div>
  );
};

export default Form2;

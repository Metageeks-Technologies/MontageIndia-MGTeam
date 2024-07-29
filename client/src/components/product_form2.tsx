import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';
import React, { useState, useCallback } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import axios from 'axios';



const Form2 = ({ onPrev, onNext, formData }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const[loading,setloader]=useState(false)

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
  
    const url = `/media/image/reduce`;
  
    try {
      const response = await instance.post(url,formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          if (data.total) {
            console.log(Math.round((data.loaded / data.total) * 100));
     
            notifySuccess("Image  upload successfully")
          }}

      });
      if (response.status === 200) {
        const data = response.data;
        console.log('Upload success:', data);
        onNext(data);
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

    const url = `/media/audio/reduce`;
  
    try {    
      
      const response = await instance.post(url,formData,{
        headers: {
          "Content-Type": "multipart/form-data"},
           onUploadProgress: (data) => {
          if (data.total) {
            console.log(Math.round((data.loaded / data.total) * 100));
     
            notifySuccess("Audio file upload successfully")
          }}
      })
      if (response.status === 200) {
        const data = response.data;
        console.log('Upload success:', data);
        onNext(data);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError('An error occurred while uploading the audio.');
    }
  };
  
  const handleVideoSubmit = async (file: File, data: any) => {
    try {
      // Initiate the upload process
      const response = await instance(
        `/media/video/upload?uuid=${data.uuid}&filename=${file.name}`
      );
      
      if (response.status === 200) {
        // Upload the video file
        const uploadRes = await axios.put(response.data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        console.log("upload")
        if (uploadRes.status === 200) {
          // Get the job IDs
          const getJobIdRes = await instance(`media/video/job-id?uuid=${data.uuid}`);
          console.log(getJobIdRes.data);
          const { mainJobId, watermarkJobId } = getJobIdRes.data.emcMediaJob;
  
          // Poll for transcoding progress
          const id = setInterval(async () => {
            try {
              const res = await instance(
                `/media/video/transcode/progress/?watermarkJobId=${watermarkJobId}&mainJobId=${mainJobId}`
              );
              console.log(res.data.process,"status");
              if (res.data.process.status === 'complete') {
                // Update product with video info once transcoding is complete
               const productRes =  await instance.patch(`/product/video/`, {
                  uuid: data.uuid,
                  mediaType: "video",
                });
                clearInterval(id);
                console.log('Transcoding complete, polling stopped.');
                setloader(false);
                onNext(productRes.data);
              }
            } catch (error) {
              console.error('Error fetching transcoding progress:', error);
            }
          }, 10000);

          console.log("setInterval")
  
        } else {
          console.error('Failed to upload the video file.');
        }
      } else {
        console.error('Failed to initiate the upload process.');
      }
  
      console.log("Upload successful:", data);
    } catch (error) {
      setloader(false);
      console.error("Error uploading video:", error);
    }
  };
  
  
  const handleSubmit = async () => {
    if (file) {
      setloader(true)

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
      setloader(false);
      setError('Please select a valid file before submitting.');
    }
  };
  
  const mesg = (mediaType:any) => {
    switch (mediaType) {
      case 'audio':
        return 'Mp3, Wav';
      case 'image':
        return 'SVG, PNG, JPG';
      case 'video':
        return 'MP4, Webp';
      default:
        return 'SVG, PNG, JPG, GIF, MP3, MP4';
    }
  };
  return (
  <>
    {loading?<>
    <div role="status" className='justify-center h-screen flex items-center m-auto'>
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
  </div>
  </>:(
       <div className='flex flex-col items-center w-full m-auto gap-5 mt-16 h-full justify-center'>
    <div {...getRootProps()} className="flex items-center bg-gray-100 justify-center w-full h-64 border-2 border-gray-300 border-dashed m-5 rounded-lg cursor-pointer hover:bg-gray-200    ">
      <input {...getInputProps()} />
      <div className="flex flex-col text-black items-center justify-center pt-5 pb-6">
        <svg className="w-8 h-8 mb-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
        </svg>
        {!name ? (
          <>
            <p className="mb-2 text-sm  ">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs  ">{mesg(data.mediaType)}</p>
          </>
        ) : (
          <span className='font-semibold'>{name}</span>
        )}
      </div>
    </div>
    


    {error && <p className=''>{error}</p>}
    <div className='justify-between flex w-auto gap-5'>
      <button onClick={handleSubmit}  className={`p-2 px-3 w-fit font-semibold text-white rounded-lg ${
            file ? 'bg-lime-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`} 
          disabled={!file}>Next</button>
    </div>
  </div>)}
 
  </>);
};

export default Form2;

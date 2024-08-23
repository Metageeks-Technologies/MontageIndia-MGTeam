import instance from '@/utils/axios';
import { notifyError, notifySuccess } from '@/utils/toast';
import React, { useState, useCallback, useMemo } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Spinner } from '@nextui-org/react';
import Swal from 'sweetalert2';

interface FormData
{
  product: {
    uuid: string;
    mediaType: 'image' | 'audio' | 'video';
    title: string;
  };
}

interface Form2Props
{
  onPrev: () => void;
  onNext: ( data: any ) => void;
  formData: FormData;
}

const Form2: React.FC<Form2Props> = ( { onPrev, onNext, formData } ) =>
{
  const [ file, setFile ] = useState<File | null>( null );
  const [ error, setError ] = useState( '' );
  const [ loading, setLoading ] = useState( false );
  const [ loadingPer, setLoadingPer ] = useState( 0 );

  const data = formData?.product || {};

  const validateFileType = useCallback( ( fileType: string ): boolean =>
  {
    if ( !data.mediaType ) return true;
    const mediaTypeMap: Record<string, string> = {
      image: 'image/',
      audio: 'audio/',
      video: 'video/',
    };
    return fileType.startsWith( mediaTypeMap[ data.mediaType ] || '' );
  }, [ data.mediaType ] );
console.log(file)
  const onDrop = useCallback( ( acceptedFiles: File[] ) =>
  {
    const selectedFile = acceptedFiles[ 0 ];
    if ( selectedFile )
    {
      if ( validateFileType( selectedFile.type ) )
      {
        setFile( selectedFile );
        setError( '' );
      } else
      {
        setError( `Please select a valid ${ data.mediaType } file.` );
      }
    }
  }, [ data.mediaType, validateFileType ] );

  const acceptableFileTypes: Accept = useMemo( () =>
  {
    const typeMap: Record<string, Record<string, string[]>> = {
      image: { 'image/*': [ '.jpeg', '.jpg', '.png' ] },
      audio: { 'audio/*': [ '.mp3', '.wav' ] },
      video: { 'video/*': [ '.mp4', '.avi' ] },
    };
    return data.mediaType ? typeMap[ data.mediaType ] : {};
  }, [ data.mediaType ] );

  const { getRootProps, getInputProps } = useDropzone( {
    onDrop,
    accept: acceptableFileTypes,
    maxFiles: 1,
  } );

  const handleImageSubmit = async ( file: File, data: any ) =>
  {
    const formData = new FormData();
    formData.append( 'image', file );
    formData.append( 'uuid', JSON.stringify( data.uuid ) );
    formData.append( 'mediaType', JSON.stringify( data.mediaType ) );

    const url = `/media/image/reduce`;

    try
    {
      const response = await instance.post( url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: ( progressEvent ) =>
        {
          if ( progressEvent.total )
          {
            const percentCompleted = Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total );
            setLoadingPer( percentCompleted );
          }
        },
      } );
      if ( response.status === 200 )
      {
        notifySuccess( "Image upload successful" );
        onNext( response.data );
      }
    } catch ( error: any )
    {
      handleError( error );
    }
  };

  const handleAudioSubmit = async ( file: File, data: any ) =>
  {
    const formData = new FormData();
    formData.append( 'audio', file );
    formData.append( 'uuid', JSON.stringify( data.uuid ) );
    formData.append( 'mediaType', JSON.stringify( data.mediaType ) );

    const url = `/media/audio/reduce`;
    try
    {
      const response = await instance.post( url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: ( progressEvent ) =>
        {
          if ( progressEvent.total )
          {
            const percentCompleted = Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total );
            setLoadingPer( percentCompleted );
          }
        }
      } );
      if ( response.status === 200 )
      {
        notifySuccess( "Audio file upload successful" );
        onNext( response.data );
      }
    } catch ( error: any )
    {
      handleError( error );
    }
  };

  const handleVideoSubmit = async ( file: File, data: any ) =>
  {
    if ( !file || !data || !data.uuid )
    {
      setError( 'Invalid input data.' );
      return;
    }

    try
    {
      // Initiate the upload process
      const response = await instance( `/media/video/upload?uuid=${ data.uuid }&filename=${ file.name }` );

      if ( response.status !== 200 )
      {
        throw new Error( 'Failed to initiate the upload process.' );
      }

      // Upload the video file
      const uploadRes = await axios.put( response.data.url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: ( progressEvent ) =>
        {
          if ( progressEvent.total )
          {
            const percentCompleted = Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total );
            setLoadingPer( percentCompleted );
          }
        },
      } );

      if ( uploadRes.status !== 200 )
      {
        throw new Error( 'Failed to upload the video file.' );
      }

      // Get the job IDs
      const pollInterval = 5000;
      const maxPollTime = 120000;
      let elapsedTime = 0;
      let emcMediaJob = null;

      while ( elapsedTime < maxPollTime )
      {
        const jobResponse = await instance( `/media/video/job-id/?uuid=${ data.uuid }` );
        emcMediaJob = jobResponse.data.emcMediaJob;
        if ( emcMediaJob ) break;
        await new Promise( resolve => setTimeout( resolve, pollInterval ) );
        elapsedTime += pollInterval;
      }

      if ( !emcMediaJob )
      {
        throw new Error( 'Timeout: mcMediaJob not found' );
      }

      const { mainJobId, watermarkJobId } = emcMediaJob;

      // Poll for transcoding progress
      const id = setInterval( async () =>
      {
        try
        {
          const res = await instance( `/media/video/transcode/progress/?watermarkJobId=${ watermarkJobId }&mainJobId=${ mainJobId }` );

          if ( res.data.process.status === 'complete' )
          {
            clearInterval( id );
            const productRes = await instance.patch( `/product/video/`, {
              uuid: data.uuid,
              mediaType: "video",
            } );
            notifySuccess( "Video upload and processing complete" );
            onNext( productRes.data );
          }
        } catch ( error )
        {
          clearInterval( id );
          handleError( error );
        }
      }, 10000 );

    } catch ( error: any )
    {
      handleError( error );
    }
  };

  const handleError = ( error: any ) =>
  {
    const errorMessage = error.response?.data?.message || `An error occurred while uploading the ${ data.mediaType }.`;
    // notifyError( errorMessage );
    setError( errorMessage );
    Swal.fire( {
      icon: 'error',
      title: 'Upload Failed',
      text: errorMessage,
    } );
    setLoading( false );
  };

  const handleSubmit = async () =>
  {
    if ( !file )
    {
      setError( 'Please select a file before submitting.' );
      return;
    }

    setLoading( true );
    setError( '' );

    switch ( data.mediaType )
    {
      case 'image':
        await handleImageSubmit( file, data );
        break;
      case 'audio':
        await handleAudioSubmit( file, data );
        break;
      case 'video':
        await handleVideoSubmit( file, data );
        break;
      default:
        setError( 'Invalid media type.' );
        setLoading( false );
    }
  };

  const acceptedFileTypes: Record<string, string> = {
    audio: 'MP3, WAV',
    image: 'PNG, JPG, JPEG',
    video: 'MP4, AVI',
  };
  const displayPercentage = loadingPer >= 98 ? 98 : loadingPer;
  return (
    <div className="w-full mx-auto p-6">
     

      <h3 className="text-lg font-medium mb-4">Upload { data.mediaType }</h3>

      <div { ...getRootProps() } className="border-2 border-dashed bg-pageBg-light border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-pageBg">
        <input { ...getInputProps() } />
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">Choose a file or drag & drop it here</p>
        <p className="mt-1 text-xs text-gray-500">{ acceptedFileTypes[ data.mediaType ] || 'Any file' } formats, up to 5MB</p>
        <button className="mt-4 px-4 py-2 bg-webred text-pureWhite-light rounded-md hover:bg-webred focus:outline-none focus:ring-2 focus:ring-webred focus:ring-opacity-50">
          Browse File
        </button>
      </div>

      { loading && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between items-center">
            <span>{ displayPercentage }% Uploading...</span>
            <button className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* file name */ } 
          <div className="text-sm text-gray-600 p-2">{ file?.name || "" }</div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full" style={ { width: `${ displayPercentage }%` } }></div>
          </div>
        </div>  
      ) }

      { error && <p className="text-red-500 mt-4">{ error }</p> }

      <div className="mt-6">
        <button
          onClick={ handleSubmit }
          className={ `w-full p-3 font-semibold text-white rounded-lg ${ file && !loading ? 'bg-webred hover:bg-webred-light' : 'bg-gray-400 cursor-not-allowed'
            }` }
          disabled={ !file || loading }
        >
          Upload and Continue
        </button>
      </div>
    </div>
  );

};

export default Form2;
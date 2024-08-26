"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { images } from "";
import Cookies from 'js-cookie';
import { notifySuccess } from "@/utils/toast";
import instance from "@/utils/axios";
import TermsModal from "@/components/user/termsCondition";
import Link from "next/link";
import Swal from "sweetalert2";
import { Spinner } from "@nextui-org/react";

const Page = () =>
{
  const router = useRouter();
  const [ email, setEmail] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ username, setUsername ] = useState( "" );
  const [phone,setphone]=useState("")
  const [terms,SetTerms]=useState<boolean>(false);
  const [ error, setError ] = useState( "" );
  const [loading,setloading]=useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [ showPassword, setShowPassword ] = useState( false );


  const togglePasswordVisibility = () =>
  {
    setShowPassword( !showPassword );
  };

  const handleLogin = async () =>
  {
    setError( "" );


    if (!username ) {
      setError("Please enter  username ");
      return;
    }
    if (!phone ) {
      setError("Please enter  Phone number ");
      return;
    }
    if (!name ) {
      setError("Please enter name ");
      return;
    }
    if (!email ) {
      setError("Please enter email ");
      return;
    }
    if (!password ) {
      setError("Please enter Passowrd");
      return;
    }

    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    console.log("login clicked");
    try
    {
      setloading(true)
      const response = await instance.post(
        `/user/signup`,
        { name,username,email, password ,phone},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log( "Login successful:", response.data );
      if(response.status===201){
        setloading(false)
      console.log(name,username,email,password)
        notifySuccess( "Login Successful" );
        // Swal.fire( {
        //   icon: 'success',
        //   title: 'Login Successful',
        //   text: 'You have been login successfully.', 
        // } );
      router.replace("/auth/user/login");
      }
    } catch ( error:any )
    {
      setloading(false)
      console.error( "Login error:", error );
      const errorMessage = error.response?.data?.message || `Please try again later`;
      Swal.fire( {
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      } );
      if ( axios.isAxiosError( error ) )
      {
        setError( error.response?.data?.message || "An error occurred during login. Please try again." );
      } else
      {
        setError( "An unexpected error occurred. Please try again." );
      }
    }
  };

  return (
    <>

      <div className="flex flex-col items-center justify-center h-full relative px-4 sm:px-6 lg:px-8">
        
      <div className="w-48 h-14 flex m-8    justify-center  rounded-xl ">
            <img src={ "/images/logo.png" } alt="logo" />
          </div>
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md   p-8 bg-white border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your details to register and start to discover!
          </p>
          { error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              { error }
            </div>
          ) }
          <div className="mt-6">
          <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Name<span className="text-red-500">*</span>
              </label>

              <input
                type={ "text" }
                id="name"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: John"
                onChange={ ( e ) => {setName( e.target.value ); } }
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Username<span className="text-red-500">*</span>
              </label>

              <input
                type={ "text" }
                id="username"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: John@12"
                onChange={ ( e ) => {setUsername( e.target.value ); } }
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Phone no.<span className="text-red-500">*</span>
              </label>

              <input
                type={ "number" }
                id="phone"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: 9898989898"
                onChange={ ( e ) => {setphone(e.target.value)} }
                required
              />
            </div>
            <div className="mt-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type={'email'}
                id="password"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Ex Johndoe@gmail.com"
                onChange={ ( e ) => {  setEmail( e.target.value ); } }
                required
              />
            </div>
            <div className="mt-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={ showPassword ? "text" : "password" }
                id="password"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Enter your password"
                onChange={ ( e ) => { setError( "" ); setPassword( e.target.value ); } }
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                onClick={ togglePasswordVisibility }
              >
                { showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                ) }
              </button>
            </div>
            <div className="flex justify-start gap-5 mt-2">
              <input type="checkbox" onChange={(e) => SetTerms(e.target.checked)} />
              <button
                className="text-sm text-[#65A30D] hover:underline focus:outline-none"
                onClick={() => setIsModalOpen(true)}  // Open modal on click
              >
                Terms and conditions
              </button>
            </div>
            <div className="flex justify-center flex-row items-center gap-5">
              <span className="h-[1px] bg-gray-200 w-full"></span>
             or
             <span className="h-[1px] bg-gray-200 w-full"></span>

            </div>
            <div className="flex justify-center gap-5 mt-2">
              <div
                className="text-sm mx-2 font-medium hover:underline focus:outline-none"
              >
                Already a user
               <Link
               className="text-blue-600"
              href={'/auth/user/login'} > Please login
              </Link>
              </div>
            </div>
            {loading?
               <button
               disabled={!terms==true}
                 className="flex items-center rounded-md justify-center w-full px-4 py-1 mt-4  bg-webgreen"
                 onClick={ handleLogin }
               >
                 <Spinner color="danger"/>
              </button>
                :
              <button
              disabled={!terms==true}
                className="flex items-center rounded-md justify-center w-full px-4 py-2 mt-4 text-white bg-webgreen hover:bg-webgreenHover"
                onClick={ handleLogin }
              >
                Continue
              </button>
              }            
          </div>
        </div>
      </div>
      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Page;

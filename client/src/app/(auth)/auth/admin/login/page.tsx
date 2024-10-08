"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notifySuccess } from "@/utils/toast";
import instance from "@/utils/axios";
import Link from "next/link";

const AdminLoginPage = () =>
{
  const router = useRouter();
  const [ usernameOrEmail, setUsernameOrEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ error, setError ] = useState( "" );
  const [ showPassword, setShowPassword ] = useState( false );


  const togglePasswordVisibility = () =>
  {
    setShowPassword( !showPassword );
  };

  const handleLogin = async () =>
  {
    setError( "" );

    if ( !usernameOrEmail || !password )
    {
      setError( "Please enter both usernameOrEmail and password." );
      return;
    }
    console.log( "login cliked" );
    try
    {
      const response = await instance.post(
        `auth/admin/login`,
        { usernameOrEmail, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log( "Login successful:", response ); 

      if(response?.data.user?.role === "superadmin"){
        router.push( "/admin/dashboard" );
      }
      else{
        router.push( "/admin/product/available" ); 
      } 
      notifySuccess( "Login Successful" );
      setUsernameOrEmail( "" );
      setPassword( "" );
    } catch ( error )
    {
      console.error( "Login error:", error );

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

      <div className="flex flex-col items-center justify-center min-h-screen relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6 absolute top-12 gap-3">

          <Link href="/" className="w-48 h-14 flex mb-4 justify-center items-center rounded-xl ">
            <img src={ "/images/logo.png" } alt="logo" />
          </Link>

        </div>

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md p-8 bg-white border rounded-lg shadow-md">
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
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium text-gray-700 required-label"
              >
                Username or Email <span className="text-red-500">*</span>
              </label>

              <input
                type={ 'email' || 'text' }
                id="usernameOrEmail"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Example412@gmail.com / Example412"
                onChange={ ( e ) => { setError( "" ); setUsernameOrEmail( e.target.value ); } }
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
            <div className="flex justify-end mt-2">
              <button
                onClick={ () => router.push( '/admin/reset-password' ) }
                className="text-sm text-[#65A30D] hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <button
              className="flex items-center rounded-md justify-center w-full px-4 py-2 mt-4 text-white bg-webgreen hover:bg-webgreenHover"
              onClick={ handleLogin }
            >
              Continue
            </button>
          </div>



        </div>
      </div>

    </>
  );
};

export default AdminLoginPage;

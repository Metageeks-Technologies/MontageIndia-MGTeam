"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";

const Page = () =>
{
  const router = useRouter();
  const [ usernameOrEmail, setUsernameOrEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ error, setError ] = useState( "" );
  const [ showPassword, setShowPassword ] = useState( false );
  const [ showForgotPasswordModal, setShowForgotPasswordModal ] = useState( false );
  const [ email, setEmail ] = useState( "" );

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

    try
    {
      const response = await axios.post(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/api/v1/auth/admin/login`,
        { usernameOrEmail, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log( "Login successful:", response.data );
      alert( "Login Successful" )
      router.push("/")
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

  // handle forgot password
  const forgotPasswordModel = () =>
  {
    setShowForgotPasswordModal( true );
  };

  const handleForgotPassword = async ( e: any ) =>
  {
    e.preventDefault();
    if ( !email )
    {
      setError( "Please enter your email address." );
      return;
    }

    try
    {
      const response = await axios.post(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/api/v1/auth/admin/forgetPassword`,
        { email },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log( "Password reset requested:", response.data );
      alert( `Password reset instructions have been sent to ${ email }` );
      setShowForgotPasswordModal( false );
      setEmail( "" );

    } catch ( error )
    {
      console.error( "Password reset error:", error );
      setShowForgotPasswordModal( true );

      if ( axios.isAxiosError( error ) )
      {
        setError( error.response?.data?.message || "An error occurred while requesting password reset. Please try again." );
      } else
      {
        setError( "An unexpected error occurred. Please try again." );

      }
    }
  };

  return (
    <>
      {/* // this style is for red astrix */ }
      <style jsx>{ `.required-label::after { content: "*"; color: red; margin-left: 0.25rem; }` }</style>;
      <div className="flex flex-col items-center justify-center min-h-screen relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6 absolute top-12 gap-3">
          <div className="w-14 h-14 bg-white border border-gray-300 flex justify-center items-center rounded-xl shadow-xl">
            <IoBagHandleSharp className="text-[#65A30D] h-10 w-10 rounded-md" />
          </div>

          <div>
            <h1 className="mt-2 text-2xl font-semibold">Durara</h1>
          </div>
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
                Username or Email
              </label>

              <input
                type={ 'email' || "text"}
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
                Password
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
                onClick={ forgotPasswordModel }
                className="text-sm text-[#65A30D] hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <button
              className="flex items-center rounded-md justify-center w-full px-4 py-2 mt-4 text-white bg-[#BEF264] hover:bg-[#cbff70]"
              onClick={ handleLogin }
            >
              Continue
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            By clicking Register, you agree to accept Durara{ " " }
          </p>
          <p className="underline text-black hover:text-blue-800 mt-2">
            Terms and Conditions
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Have an account?{ " " }
            <a
              href="/admin/login"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      { showForgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={ handleForgotPassword }>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 required-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 bg-[#F4F4F5] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={ email }
                  onChange={ ( e ) => setEmail( e.target.value ) }
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={ () => setShowForgotPasswordModal( false ) }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#BEF264] rounded-md hover:bg-[#cbff70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      ) }
    </>
  );
};

export default Page;

import React from "react";
import { IoBagHandleSharp } from "react-icons/io5";

const Page = () => {
  return (
    <>
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
          <div className="mt-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: marc@example.com"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
            <button className="flex items-center rounded-md justify-center w-full px-4 py-2 mt-4 text-white bg-[#BEF264] hover:bg-[#cbff70]">
              Continue
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            By clicking Register, you agree to accept Durara{" "}
          </p>
          <p className="underline text-black hover:text-blue-800 mt-2">
            Terms and Conditions
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Have an account?{" "}
            <a
              href="/login"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;

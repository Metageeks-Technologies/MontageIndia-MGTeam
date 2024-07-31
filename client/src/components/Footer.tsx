import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-black text-white pb-10 lg:px-20 sm:px-20 px-10">
    <div className="flex ">
      <div className="mt-10 w-full md:w-full lg:w-1/2 pr-4 basis-[25%]">
        <div className="mb-4 ">
        <div className="text-sm border border-gray-700 px-4 py-2 rounded-md w-60 ">
            <span className=" mr-2">🌐</span> English
          </div>
        </div>
        
      </div>
      <div className="mt-5 w-full md:w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-6 basis-[75%]">
        <div className=" w-full sm:w-full">
          <h2 className="font-bold  mb-3">Our Companey</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">About us</a></li>
            <li><a href="#" className="hover:text-gray-200">Careers</a></li>
            <li><a href="#" className="hover:text-gray-200">Press/Media</a></li>
            <li><a href="#" className="hover:text-gray-200">Investor relations</a></li>
            <li><a href="#" className="hover:text-gray-200">Pricing</a></li>
            <li><a href="#" className="hover:text-gray-200">Popular searches</a></li>
            <li><a href="#" className="hover:text-gray-200">Contact us</a></li>
          </ul>
        </div>
       
        <div className="mb-6 w-full sm:w-full">
            <div>
          <h2 className="font-bold mb-3">Stock Photos and Videos</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">Stock Photos</a></li>
            <li><a href="#" className="hover:text-gray-200">Stock videos</a></li>
            <li><a href="#" className="hover:text-gray-200">Stock vectors</a></li>
            <li><a href="#" className="hover:text-gray-200">Editorial images</a></li>
            <li><a href="#" className="hover:text-gray-200">Featured photo collections</a></li>
          </ul>
          </div>
          <div className="mt-6 w-full sm:w-full">
          <h2 className="font-bold  mb-2">Partners</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">Sell your content</a></li>
            <li><a href="#" className="hover:text-gray-200">Affiliate/Reseller</a></li>
            <li><a href="#" className="hover:text-gray-200">International reseller</a></li>
            <li><a href="#" className="hover:text-gray-200">Live assignments</a></li>
            <li><a href="#" className="hover:text-gray-200">Rights and clearance</a></li>
            <li><a href="#" className="hover:text-gray-200">Developers</a></li>
          </ul>
        </div>
        </div>

        <div className="mb-6 w-full sm:w-full">
            <div>
          <h2 className="font-bold mb-3">Legal</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">Website Terms of Use</a></li>
            <li><a href="#" className="hover:text-gray-200">Terms of Service</a></li>
            <li><a href="#" className="hover:text-gray-200">Privacy policy</a></li>
            <li><a href="#" className="hover:text-gray-200">Modern Slavery Statement</a></li>
            <li><a href="#" className="hover:text-gray-200">Patents</a></li>
            <li><a href="#" className="hover:text-gray-200">Cpkies prefences</a></li>
          </ul>
          </div>
          <div className="mt-6 w-full sm:w-full">
          <h2 className="font-bold  mb-2">Our Brands</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">Pond5</a></li>
            <li><a href="#" className="hover:text-gray-200">PremiumBeat</a></li>
            <li><a href="#" className="hover:text-gray-200">TurboSquid</a></li>
            <li><a href="#" className="hover:text-gray-200">Giphy</a></li>
          </ul>
        </div>
        </div>
     
        <div className=" w-full sm:w-full">
          <h2 className="font-bold  mb-3">Inavation</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-gray-200">Shutterstock.AI</a></li>
            <li><a href="#" className="hover:text-gray-200">AI image generator</a></li>
            <li><a href="#" className="hover:text-gray-200">AI style types</a></li>
            <li><a href="#" className="hover:text-gray-200">Color palette generator</a></li>
            <li><a href="#" className="hover:text-gray-200">Shutterstock mobile app</a></li>
            <li><a href="#" className="hover:text-gray-200">iOS app</a></li>
            <li><a href="#" className="hover:text-gray-200">Android app</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  
  

  );
};

export default Footer;
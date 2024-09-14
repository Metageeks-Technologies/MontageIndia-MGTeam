import React from 'react';
import Image from 'next/image';
import {GoogleTranslate} from './LanguageSelector';
import {getPrefLangCookie} from '@/utils/cookies';

const Footer = () => {
  return (
    <div className="bg-black text-white pb-10 px-4 sm:px-4 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-0">
        <div className="mt-5 md:w-1/4 flex flex-col items-start">
          <div className="mb-4 rounded-lg w-fit">
            <img
              src="/images/logo-white.svg"
              alt="logo"
              className="w-44 h-10 cursor-pointer mb-4 sm:mb-0 sm:mr-4"
            />
          </div>
          <div className="mb-4">
            <GoogleTranslate />
          </div>
        </div>

        <div className=" sm:hidden block w-full md:w-1/4 mt-4">
          <h2 className="font-bold mb-7">Newsletter</h2>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-[#444444] rounded-md p-2 mb-3 text-white bg-black"
            />
            <button
              type="submit"
              className="bg-[#222222] text-gray-400 rounded-md py-2 px-4"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-5 md:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
          <div className="w-full">
            <h2 className="font-bold mb-3">Our Company</h2>
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

          <div className="w-full sm:block hidden">
            <h2 className="font-bold mb-3">Stock Photos and Videos</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-gray-200">Stock Photos</a></li>
              <li><a href="#" className="hover:text-gray-200">Stock videos</a></li>
              <li><a href="#" className="hover:text-gray-200">Stock vectors</a></li>
              <li><a href="#" className="hover:text-gray-200">Editorial images</a></li>
              <li><a href="#" className="hover:text-gray-200">Featured photo collections</a></li>
            </ul>
            <div className="mt-6">
              <h2 className="font-bold mb-2">Partners</h2>
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
           
          <div className="w-full block sm:hidden ">
            <h2 className="font-bold mb-3">Stock Photos and Videos</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-gray-200">Stock Photos</a></li>
              <li><a href="#" className="hover:text-gray-200">Stock videos</a></li>
              <li><a href="#" className="hover:text-gray-200">Stock vectors</a></li>
              <li><a href="#" className="hover:text-gray-200">Editorial images</a></li>
              <li><a href="#" className="hover:text-gray-200">Featured photo collections</a></li>
            </ul>
           
          </div>

          <div className=" w-full block sm:hidden">
              <h2 className="font-bold mb-2">Partners</h2>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gray-200">Sell your content</a></li>
                <li><a href="#" className="hover:text-gray-200">Affiliate/Reseller</a></li>
                <li><a href="#" className="hover:text-gray-200">International reseller</a></li>
                <li><a href="#" className="hover:text-gray-200">Live assignments</a></li>
                <li><a href="#" className="hover:text-gray-200">Rights and clearance</a></li>
                <li><a href="#" className="hover:text-gray-200">Developers</a></li>
              </ul>
            </div>

          <div className="w-full ">
            <h2 className="font-bold mb-3">Legal</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-gray-200">Website Terms of Use</a></li>
              <li><a href="#" className="hover:text-gray-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-200">Privacy policy</a></li>
              <li><a href="#" className="hover:text-gray-200">Modern Slavery Statement</a></li>
              <li><a href="#" className="hover:text-gray-200">Patents</a></li>
              <li><a href="#" className="hover:text-gray-200">Cookies preferences</a></li>
            </ul>
            <div className="mt-6 sm:block hidden">
              <h2 className="font-bold mb-2">Our Brands</h2>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gray-200">Pond5</a></li>
                <li><a href="#" className="hover:text-gray-200">PremiumBeat</a></li>
                <li><a href="#" className="hover:text-gray-200">TurboSquid</a></li>
                <li><a href="#" className="hover:text-gray-200">Giphy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className=" sm:block hidden w-full md:w-1/4 mt-4">
          <h2 className="font-bold mb-7">Newsletter</h2>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-[#444444] rounded-md p-2 mb-3 text-white bg-black"
            />
            <button
              type="submit"
              className="bg-webgreen hover:bg-webgreen-light text-[#FFFFFF] rounded-md py-2 px-4"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Footer;
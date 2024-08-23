import React, { useState } from 'react';
import { CiShare2 } from 'react-icons/ci';
import Link from 'next/link';
import { FaCheck, FaFacebook, FaInstagramSquare, FaPinterest } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { IoCopy } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
const CustomShareButton: React.FC = () => {
  const param=usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Access environment variable correctly
  const shareUrl = process.env.NEXT_PUBLIC_CLIENT_URL+param || '';
  const handleCopyUrl = () => {
    
    console.log("copied",shareUrl)
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Clear the success message after 2 seconds
    }).catch(() => {
      setCopySuccess(false);
    });
  };

  return (
    <div className="relative flex flex-row items-center gap-2">
      {/* Custom Share Button */}
      <span
        className="flex font-medium rounded-md gap-2 border-gray-300 flex-row text-center p-2 border items-center cursor-pointer"
        onClick={toggleDropdown}
        // onMouseEnter={() => setIsDropdownOpen(true)}
        // onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <CiShare2 size={20} /> Share
      </span>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          className="absolute w-72 flex flex-col items-center gap-6 -left-16 justify-center  top-full  mt-2 bg-white border rounded shadow-lg p-4 z-50"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={closeDropdown}
        >
          <div >
          <h2 className="text-xl mb-4">Share this item</h2>
          </div>
          <div className="flex border-b pb-5 flex-row gap-2">
            <Link
              target='_blank'
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              className="text-blue-600 hover:underline"
            >
              <FaFacebook size={32} />  
            </Link>
            <Link
              target='_blank'
              href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
              className="text-blue-400 hover:underline"
            >
              <FaSquareXTwitter size={32} />
            </Link>
            <Link
              target='_blank'
              href={`https://pinterest.com/pin/create/button/?url=${shareUrl}`}
              className="text-red-600 hover:underline"
            >
              <FaPinterest size={32} />
            </Link>
            <Link
              target='_blank'
              href={`https://www.instagram.com`}
              className="text-purple-600 hover:underline"
            >
            <FaInstagramSquare size={32} />
            </Link>
          </div>
          <div>
          <button
              onClick={handleCopyUrl}
              className="text-white bg-webred rounded-md w-36 justify-center p-2 px-3 flex items-center gap-2"
            >
              {!copySuccess?<><IoCopy />Copy Url</>:<>
                <FaCheck /> copied</>}
              
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomShareButton;

import React, {useState} from 'react';
import {BsFilterLeft} from 'react-icons/bs';
import {MdClear} from 'react-icons/md';

const Filter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState( false );
  const [selectedOption, setSelectedOption] = useState( "All" );

  const toggleSidebar = () => {
    setIsSidebarOpen( !isSidebarOpen );
  };

  const handleOptionChange = ( option: string ) => {
    setSelectedOption( option );
    // Add your filtering logic here
  };

  return (
    <>
      <div>
        <button
          className="  py-2 text-gray-800 bg-[#eeeeee] border flex flex-row items-center gap-2 border-gray-300 px-5 rounded-md"
          onClick={toggleSidebar}
        >
          Filter <BsFilterLeft />
        </button>
      </div>
      <div>
        <div
          className={`fixed top-0 left-0 w-64 z-[80] h-screen bg-[#eeeeee]  text-gray-600 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={toggleSidebar}
          >
            <MdClear />
          </button>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer p-2 rounded-lg ${selectedOption === "All" ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleOptionChange( "All" )}
              >
                All
              </li>
              <li
                className={`cursor-pointer p-2 rounded-lg ${selectedOption === "Category1" ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleOptionChange( "Category1" )}
              >
                Category 1
              </li>
              <li
                className={`cursor-pointer p-2 rounded-lg ${selectedOption === "Category2" ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleOptionChange( "Category2" )}
              >
                Category 2
              </li>
              <li
                className={`cursor-pointer p-2 rounded-lg ${selectedOption === "Category3" ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleOptionChange( "Category3" )}
              >
                Category 3
              </li>
            </ul>
          </div>
        </div>
      </div>

    </> );
};

export default Filter;

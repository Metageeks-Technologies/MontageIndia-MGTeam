import React, {useState, useCallback, useEffect, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";

interface FilterProps {
  isOpen: boolean;
  onToggle: () => void;
  mediaType: "image" | "audio" | "video";
  onFilterChange: (filterType: string, value: string | number) => void;
  onClearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({
  isOpen,
  onToggle,
  mediaType,
  onFilterChange,
  onClearFilter,
} ) => {
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | number;}>( {} );
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimers = useRef<{[key: string]: NodeJS.Timeout | null;}>( {} );

  const updateURL = useCallback(
    (params: URLSearchParams) => {
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleFilterClick = useCallback(
    (filterType: string, value: string | number) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      if (currentParams.get(filterType) === value.toString()) {
        // Remove the filter if it's already selected
        currentParams.delete(filterType);
        setActiveFilters((prev) => {
          const newFilters = { ...prev };
          delete newFilters[filterType];
          return newFilters;
        });
      } else {
        // Set the new filter value
        currentParams.set(filterType, value.toString());
        setActiveFilters((prev) => ({
          ...prev,
          [filterType]: value,
        }));
      }

      updateURL(currentParams);
      onFilterChange(filterType, currentParams.get(filterType) || "");
    },
    [searchParams, updateURL, onFilterChange]
  );

  const debounce = ( callback: Function, delay: number ) => {
    return ( key: string, value: string ) => {
      if ( debounceTimers.current[key] ) {
        clearTimeout( debounceTimers.current[key]! );
      }
      debounceTimers.current[key] = setTimeout( () => {
        callback( key, value );
        debounceTimers.current[key] = null;
      }, delay );
    };
  }; 

  const handleInputChange = useCallback(
    ( key: string, value: string ) => {
      const currentParams = new URLSearchParams( searchParams.toString() );
      if ( value === "" ) {
        currentParams.delete( key );
        setActiveFilters( ( prev ) => {
          const newFilters = {...prev};
          delete newFilters[key];
          return newFilters;
        });
      } else {
        const numValue = parseInt(value) || 0;
        currentParams.set(key, numValue.toString());
        setActiveFilters((prev) => ({
          ...prev,
          [key]: numValue,
        }));
      }

      updateURL(currentParams);
      onFilterChange(key, value === "" ? "" : parseInt(value) || 0);
    },
    [searchParams, updateURL, onFilterChange]
  );

  const debouncedInputChange = debounce( handleInputChange, 1500 );

  useEffect( () => {
    const filtersFromQuery: {[key: string]: string | number;} = {};
    searchParams.forEach( ( value, key ) => {
      console.log("Key:-",key,"value:-",value)
      if (
        [
          "imageWidth",
          "imageHeight",
          "imageDensity",
          "videoLength",
          "videoFrameRate",
          "audioLength",
          "audioBitrate",
        ].includes( key )
      ) {
        filtersFromQuery[key] = value === "" ? "" : parseInt( value ) || 0;
      } else if ( key === "videoResolution" ) {
        if ( value == "1080" ) filtersFromQuery[key] = "fhd";
        else if ( value == "720" ) filtersFromQuery[key] = "hd";
      } else {
        console.log(key)
        filtersFromQuery[key] = value;
      }
    });
    setActiveFilters(filtersFromQuery);
  }, [searchParams]);

  const renderFilterButton = ( option: string, filterType: string ) => {
    console.log( "option:-", filterType );
    console.log( "active filters:-", activeFilters );
    return (
      <button
        key={option}
        className={`px-3 py-1 rounded-full ${activeFilters[filterType] === option.toLowerCase()
          ? "bg-black text-white"
          : "bg-gray-200 text-gray-800"
          }`}
        onClick={() => {
          const resolution = option === "FHD" ? 1080 : option === "HD" ? 720 : option.toLowerCase();
          handleFilterClick( filterType, resolution );
        }}
      >
        {option}
      </button>
    );
  };


  const renderInput = ( placeholder: string, filterType: string ) => (
    <input
      type="number"
      placeholder={placeholder}
      className="w-full px-2 py-1 border rounded"
      value={activeFilters[filterType] || ""}
      onChange={( e ) => {
        const newValue = e.target.value;
        setActiveFilters( ( prev ) => ( {
          ...prev,
          [filterType]: newValue,
        } ) );
        debouncedInputChange( filterType, newValue );
      }}
    />
  );

  const renderImageFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">File Type</h3>
        <div className="flex flex-wrap gap-2">
          {["JPEG", "PNG"].map( ( option ) =>
            renderFilterButton( option, "imageFileType" )
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Dimensions</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Width", "imageWidth" )}
          {renderInput( "Height", "imageHeight" )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Orientation</h3>
        <div className="flex flex-wrap gap-2">
          {["Horizontal", "Vertical"].map( ( option ) =>
            renderFilterButton( option, "imageOrientation" )
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Density</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Density", "imageDensity" )}
        </div>
      </div>
    </>
  );

  const renderVideoFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Resolution</h3>
        <div className="flex flex-wrap gap-2">
          {["FHD", "HD"].map( ( option ) =>
            renderFilterButton( option, "videoResolution" )
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Orientation</h3>
        <div className="flex flex-wrap gap-2">
          {["Vertical", "Horizontal"].map( ( option ) =>
            renderFilterButton( option, "videoOrientation" )
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Length</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Length (seconds)", "videoLength" )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Frame Rate</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Frame Rate", "videoFrameRate" )}
        </div>
      </div>
    </>
  );

  const renderAudioFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Length</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Length (seconds)", "audioLength" )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Bitrate</h3>
        <div className="flex flex-wrap gap-2">
          {renderInput( "Bitrate", "audioBitrate" )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`h-fit sticky top-36 left-0  text-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      <div className="p-4 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold ">Filters</h2>
          <div className="flex items-center">
            <button
              onClick={onClearFilter}
              className="mr-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
            <button onClick={onToggle} className="">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {["Newest", "Oldest", "Popular"].map( ( option ) =>
              renderFilterButton( option, "sortBy" )
            )}
          </div>
        </div>

        {mediaType === "image" && renderImageFilters()}
        {mediaType === "video" && renderVideoFilters()}
        {mediaType === "audio" && renderAudioFilters()}
      </div>
    </div>
  );
};

export default Filter;

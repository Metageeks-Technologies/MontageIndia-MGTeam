import React, {useState, useCallback, useEffect, useRef} from "react";
import {BsChevronDown, BsChevronUp} from "react-icons/bs";
import {MdClear} from "react-icons/md";
import {useRouter, useSearchParams} from "next/navigation";

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface FilterProps {
  isOpen: boolean;
  onToggle: () => void;
  mediaType: "image" | "audio" | "video";
  onFilterChange: ( filterType: string, value: string | number ) => void;
  onClearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ( {
  isOpen,
  onToggle,
  mediaType,
  onFilterChange,
  onClearFilter,
} ) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>( {} );
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | number;}>( {} );
  const router = useRouter();
  const searchParams = useSearchParams();
  const throttleTimers = useRef<{[key: string]: NodeJS.Timeout | null;}>( {} );

  const toggleSection = ( section: string ): void => {
    setExpandedSections( ( prev ) => ( {...prev, [section]: !prev[section]} ) );
  };

  const updateURL = useCallback( ( params: URLSearchParams ) => {
    router.push( `?${params.toString()}`, {scroll: false} );
  }, [router] );

  const handleFilterClick = useCallback(
    ( filterType: string, value: string | number ) => {
      const currentParams = new URLSearchParams( searchParams.toString() );

      if ( currentParams.get( filterType ) === value.toString() ) {
        // Remove the filter if it's already selected
        currentParams.delete( filterType );
        setActiveFilters( ( prev ) => {
          const newFilters = {...prev};
          delete newFilters[filterType];
          return newFilters;
        } );
      } else {
        // Set the new filter value
        currentParams.set( filterType, value.toString() );
        setActiveFilters( ( prev ) => ( {
          ...prev,
          [filterType]: value,
        } ) );
      }

      updateURL( currentParams );
      onFilterChange( filterType, currentParams.get( filterType ) || "" );
    },
    [searchParams, updateURL, onFilterChange]
  );

  const throttle = ( callback: Function, delay: number ) => {
    return ( key: string, value: string ) => {
      if ( throttleTimers.current[key] ) {
        clearTimeout( throttleTimers.current[key]! );
      }
      throttleTimers.current[key] = setTimeout( () => {
        callback( key, value );
        throttleTimers.current[key] = null;
      }, delay );
    };
  };

  const handleInputChange = useCallback(
    ( key: string, value: string ) => {
      const currentParams = new URLSearchParams( searchParams.toString() );
      console.log("key:-",key,"value:-",value)
      if ( value === "" ) {
        currentParams.delete( key );
        setActiveFilters( ( prev ) => {
          const newFilters = {...prev};
          delete newFilters[key];
          return newFilters;
        } );
      } else {
        const numValue = parseInt( value ) || 0;
        currentParams.set( key, numValue.toString() );
        setActiveFilters( ( prev ) => ( {
          ...prev,
          [key]: numValue,
        } ) );
      }

      updateURL( currentParams );
      onFilterChange( key, value === "" ? "" : parseInt( value ) || 0 );
    },
    [searchParams, updateURL, onFilterChange]
  );

  const throttledInputChange = throttle( handleInputChange, 300 );


  useEffect( () => {
    const filtersFromQuery: {[key: string]: string | number;} = {};
    searchParams.forEach( ( value, key ) => {
      if (
        [
          "imageWidth",
          "imageHeight",
          "imageDensity",
          "videoResolution",
          "videoLength",
          "videoFrameRate",
          "audioLength",
          "audioBitrate",
          "imageOrientation"

        ].includes( key )
      ) {
        filtersFromQuery[key] = value === "" ? "" : parseInt( value ) || 0;
      } else {
        filtersFromQuery[key] = value;
      }
    } );
    setActiveFilters( filtersFromQuery );
  }, [searchParams] );

  const FilterSection: React.FC<FilterSectionProps> = ( {
    title,
    expanded,
    onToggle,
    children,
  } ) => (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="font-semibold">{title}</h3>
        {expanded ? <BsChevronUp /> : <BsChevronDown />}
      </div>
      {expanded && <div className="mt-2">{children}</div>}
    </div>
  );

  const renderFilterButton = ( option: string, filterType: string ) => (
    <button
      key={option}
      className={`px-3 py-1 rounded-full ${activeFilters[filterType] === option
        ? "bg-gray-800 text-white"
        : "bg-gray-200"
        }`}
      onClick={() => {
        const resolution = option === "FHD" ? 1080 : option === "HD" ? 720 : option.toLowerCase();
        handleFilterClick( filterType, resolution );
      }
      }
    >
      {option}
    </button>
  );

  const renderInput = ( placeholder: string, filterType: string ) => ( 
    <input
      type="number"
      placeholder={placeholder}
      className="w-full px-2 py-1 border rounded"
      value={activeFilters[filterType] || ""}
      onChange={( e ) => throttledInputChange( filterType, e.target.value )}
    />
  );

  const renderImageFilters = () => (
    <>
      <FilterSection
        title="File Type"
        expanded={expandedSections["fileType"] || false}
        onToggle={() => toggleSection( "fileType" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {["JPEG", "PNG"].map( ( option ) =>
            renderFilterButton( option, "imageFileType" )
          )}
        </div>
      </FilterSection>
      <FilterSection
        title="Dimensions"
        expanded={expandedSections["dimensions"] || false}
        onToggle={() => toggleSection( "dimensions" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Width", "imageWidth" )}
          {renderInput( "Height", "imageHeight" )}
        </div>
      </FilterSection>
      <FilterSection
        title="Orientation"
        expanded={expandedSections["orientation"] || false}
        onToggle={() => toggleSection( "orientation" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {["Horizontal", "Vertical"].map( ( option ) =>
            renderFilterButton( option, "imageOrientation" )
          )}
        </div>
      </FilterSection>
      <FilterSection
        title="Density"
        expanded={expandedSections["density"] || false}
        onToggle={() => toggleSection( "density" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Density", "imageDensity" )}
        </div>
      </FilterSection>
    </>
  );

  const renderVideoFilters = () => (
    <>
      <FilterSection
        title="Resolution"
        expanded={expandedSections["resolution"] || false}
        onToggle={() => toggleSection( "resolution" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {["FHD", "HD"].map( ( option ) =>
            renderFilterButton( option, "videoResolution" )
          )}
        </div>
      </FilterSection>
      <FilterSection
        title="Orientation"
        expanded={expandedSections["orientation"] || false}
        onToggle={() => toggleSection( "orientation" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {["Vertical", "Horizontal"].map( ( option ) =>
            renderFilterButton( option, "videoOrientation" )
          )}
        </div>
      </FilterSection>
      <FilterSection
        title="Length"
        expanded={expandedSections["length"] || false}
        onToggle={() => toggleSection( "length" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Length (seconds)", "videoLength" )}
        </div>
      </FilterSection>
      <FilterSection
        title="Frame Rate"
        expanded={expandedSections["videoFrameRate"] || false}
        onToggle={() => toggleSection( "videoFrameRate" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Frame Rate", "videoFrameRate" )}
        </div>
      </FilterSection>
    </>
  );

  const renderAudioFilters = () => (
    <>
      <FilterSection
        title="Length"
        expanded={expandedSections["length"] || false}
        onToggle={() => toggleSection( "length" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Length (seconds)", "audioLength" )}
        </div>
      </FilterSection>
      <FilterSection
        title="Bitrate"
        expanded={expandedSections["bitrate"] || false}
        onToggle={() => toggleSection( "bitrate" )}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {renderInput( "Bitrate", "audioBitrate" )}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div
      className={`h-fit sticky top-36 left-0 bg-white text-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? "w-80" : "w-0"
        }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center">
            <button
              onClick={onClearFilter}
              className="mr-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
            <button onClick={onToggle} className="md:hidden">
              <MdClear size={24} />
            </button>
          </div>
        </div>

        <FilterSection
          title="Sort by"
          expanded={expandedSections["sortBy"] || false}
          onToggle={() => toggleSection( "sortBy" )}
        >
          <div className="flex flex-wrap gap-2 mt-2">
            {["newest", "oldest", "popular"].map( ( option ) =>
              renderFilterButton( option, "sortBy" )
            )}
          </div>
        </FilterSection>

        {mediaType === "image" && renderImageFilters()}
        {mediaType === "video" && renderVideoFilters()}
        {mediaType === "audio" && renderAudioFilters()}
      </div>
    </div>
  );
};


export default Filter;
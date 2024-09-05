import React, {useState, useCallback} from 'react';
import {BsFilterLeft, BsChevronDown, BsChevronUp} from 'react-icons/bs';
import {MdClear} from 'react-icons/md';

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface FilterOption {
  label: string;
  options: string[] | {minHeight: number; minWidth: number;};
}

interface FilterProps {
  isOpen: boolean;
  onToggle: () => void;
  filterOptions: {
    sortBy: string[];
    orientation?: string[];
    more?: FilterOption[];

    videoLength?: number;
    frameRate?: string[];
    audioLength?: number;
    bitRate?: number;
    density?: number;
  };
  onFilterChange: ( filterType: string, value: string | number ) => void;
}

const Filter: React.FC<FilterProps> = ( {isOpen, onToggle, filterOptions, onFilterChange} ) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>( {} );
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | number;}>( {} );

  const toggleSection = ( section: string ): void => {
    setExpandedSections( prev => ( {...prev, [section]: !prev[section]} ) );
  };

  const handleFilterClick = useCallback( ( filterType: string, value: string | number ) => {
    setActiveFilters( prev => {
      const newFilters = {...prev};
      if ( newFilters[filterType] === value ) {
        delete newFilters[filterType];
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    } );
    onFilterChange( filterType, value );
  }, [onFilterChange] );

  const handleNumericInputChange = useCallback( ( key: string, value: string ) => {
    const numValue = parseInt( value ) || 0;
    handleFilterClick( key, numValue );
  }, [handleFilterClick] );

  const FilterSection: React.FC<FilterSectionProps> = ( {title, expanded, onToggle, children} ) => (
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

  return (
    <div className={`h-fit sticky top-36 left-0 bg-white text-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-0'}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onToggle} className="md:hidden">
            <MdClear size={24} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.sortBy.map( ( option ) => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full ${activeFilters['sortBy'] === option ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                onClick={() => handleFilterClick( 'sortBy', option )}
              >
                {option}
              </button>
            ) )}
          </div>
        </div>

        {filterOptions.orientation && (
          <FilterSection
            title="Orientation"
            expanded={expandedSections['orientation'] || false}
            onToggle={() => toggleSection( 'orientation' )}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.orientation.map( ( option ) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${activeFilters['orientation'] === option ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleFilterClick( 'orientation', option )}
                >
                  {option}
                </button>
              ) )}
            </div>
          </FilterSection>
        )}

       
        {filterOptions.more && (
          <FilterSection
            title="More"
            expanded={expandedSections['more'] || false}
            onToggle={() => toggleSection( 'more' )}
          >
            {filterOptions.more.map( ( option ) => (
              <div key={option.label} className="mb-2">
                <h4 className="font-medium">{option.label}</h4>
                {Array.isArray( option.options ) ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {option.options.map( ( subOption ) => (
                      <button
                        key={subOption}
                        className={`px-3 py-1 rounded-full ${activeFilters[option.label] === subOption ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterClick( option.label, subOption )}
                      >
                        {subOption}
                      </button>
                    ) )}
                  </div>
                ) : (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min Width"
                      className="w-1/2 px-2 py-1 border rounded"
                        value={''}
                        onChange={( e ) => handleFilterClick( `imageWidth`, parseInt( e.target.value ) || 0 )}
                    />
                    <input  
                      type="number"
                      placeholder="Min Height"
                      className="w-1/2 px-2 py-1 border rounded"
                      value={activeFilters[`${option.label}_minHeight`] || ''}
                        onChange={( e ) => handleFilterClick( `imageHeight`, parseInt( e.target.value ) || 0 )}
                    />
                  </div>
                )}
              </div>
            ) )}
          </FilterSection>
        )}

        {( filterOptions.videoLength !== undefined || filterOptions.audioLength !== undefined || filterOptions.bitRate !== undefined || filterOptions.density !== undefined ) && (
          <FilterSection
            title="Other Filters"
            expanded={expandedSections['otherFilters'] || false}
            onToggle={() => toggleSection( 'otherFilters' )}
          >
            {filterOptions.videoLength !== undefined && (
              <div className="mb-2">
                <label className="block font-medium">Video Length</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded"
                  value={activeFilters['videoLength'] || ''}
                  onChange={( e ) => handleNumericInputChange( 'videoLength', e.target.value )}
                />
              </div>
            )}
            {filterOptions.audioLength !== undefined && (
              <div className="mb-2">
                <label className="block font-medium">Audio Length</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded"
                  value={activeFilters['audioLength'] || ''}
                  onChange={( e ) => handleNumericInputChange( 'audioLength', e.target.value )}
                />
              </div>
            )}
            {filterOptions.bitRate !== undefined && (
              <div className="mb-2">
                <label className="block font-medium">Bit Rate</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded"
                  value={activeFilters['bitRate'] || ''}
                  onChange={( e ) => handleNumericInputChange( 'bitRate', e.target.value )}
                />
              </div>
            )}
            {filterOptions.density !== undefined && (
              <div className="mb-2">
                <label className="block font-medium">Density</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded"
                  value={activeFilters['density'] || ''}
                  onChange={( e ) => handleNumericInputChange( 'density', e.target.value )}
                />
              </div>
            )}
          </FilterSection>
        )}

        {filterOptions.frameRate && (
          <FilterSection
            title="Frame Rate"
            expanded={expandedSections['frameRate'] || false}
            onToggle={() => toggleSection( 'frameRate' )}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.frameRate.map( ( option ) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${activeFilters['frameRate'] === option ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleFilterClick( 'frameRate', option )}
                >
                  {option}
                </button>
              ) )}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
};

export default Filter;
// chats - https://claude.ai/chat/658085bc-784c-49af-ad62-7d26769ce024
// https://claude.ai/chat/0128b738-2363-45af-b3bf-9ba522d08645

"use client";
import React, {useState} from 'react';
import {BsFilterLeft, BsChevronDown, BsChevronUp} from 'react-icons/bs';
import {MdClear} from 'react-icons/md';

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface ExpandedSections {
  premiumImages: boolean;
  orientation: boolean;
  color: boolean;
  people: boolean;
  artists: boolean;
  more: boolean;
}

interface FilterOption {
  label: string;
  options: string[];
}

interface FilterOptions {
  [key: string]: FilterOption[];
}

interface FilterProps {
  isOpen: boolean;
  onToggle: () => void;
  filterOptions: {
    sortBy: string[];
    premiumImages: FilterOption[];
    orientation: string[];
    color: FilterOption[];
    people: FilterOption[];
    artists: FilterOption[];
    more: FilterOption[];
  };
}

const Filter: React.FC<FilterProps> = ( {isOpen, onToggle, filterOptions} ) => {
  const [sortBy, setSortBy] = useState<string>( filterOptions.sortBy[0] );
  const [orientation, setOrientation] = useState<string>( '' );
  const [excludeAI, setExcludeAI] = useState<boolean>( false );
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>( {
    premiumImages: false,
    orientation: true,
    color: false,
    people: false,
    artists: false,
    more: false,
  } );

  const toggleSection = ( section: keyof ExpandedSections ): void => {
    setExpandedSections( prev => ( {...prev, [section]: !prev[section]} ) );
  };

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
    <div className={`fixed top-0 left-0  bg-white text-gray-800 overflow-y-auto transition-all duration-300 ease-in-out z-50
      ${isOpen ? 'w-full md:w-80' : 'w-0'}
    `}>
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
                className={`px-3 py-1 rounded-full ${sortBy === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setSortBy( option )}
              >
                {option}
              </button>
            ) )}
          </div>
        </div>

        <FilterSection
          title="Premium images"
          expanded={expandedSections.premiumImages}
          onToggle={() => toggleSection( 'premiumImages' )}
        >
          {filterOptions.premiumImages.map( ( option ) => (
            <div key={option.label} className="mb-2">
              <h4 className="font-medium">{option.label}</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {option.options.map( ( subOption ) => (
                  <button
                    key={subOption}
                    className="px-3 py-1 rounded-full bg-gray-200"
                  >
                    {subOption}
                  </button>
                ) )}
              </div>
            </div>
          ) )}
        </FilterSection>

        <FilterSection
          title="Orientation"
          expanded={expandedSections.orientation}
          onToggle={() => toggleSection( 'orientation' )}
        >
          <div className="flex flex-wrap gap-2 mt-2">
            {filterOptions.orientation.map( ( option ) => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full ${orientation === option ? 'bg-gray-800 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setOrientation( option )}
              >
                {option}
              </button>
            ) )}
          </div>
        </FilterSection>

        <div className="flex items-center justify-between mb-4">
          <span>AI Generated</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={excludeAI}
              onChange={() => setExcludeAI( !excludeAI )}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {( ['Color', 'People', 'Artists', 'More'] as const ).map( ( section ) => (
          <FilterSection
            key={section}
            title={section}
            expanded={expandedSections[section.toLowerCase() as keyof ExpandedSections]}
            onToggle={() => toggleSection( section.toLowerCase() as keyof ExpandedSections )}
          >
            {filterOptions[section.toLowerCase() as keyof typeof filterOptions].map( ( option: any ) => (
              <div key={option.label} className="mb-2">
                <h4 className="font-medium">{option.label}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {option.options.map( ( subOption: string ) => (
                    <button
                      key={subOption}
                      className="px-3 py-1 rounded-full bg-gray-200"
                    >
                      {subOption}
                    </button>
                  ) )}
                </div>
              </div>
            ) )}
          </FilterSection>
        ) )}
      </div>
    </div>
  );
};

export default Filter;
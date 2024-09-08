import React, { useState, useCallback, useRef, useEffect } from "react";
import { BsFilterLeft, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";

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
  options: string[] | { imageHeight: number; imageWidth: number };
}

interface FilterProps {
  isOpen: boolean;
  onToggle: () => void;
  filterOptions: {
    sortBy: string[];
    orientation?: string[];
    resolution?: string[];
    more?: FilterOption[];
    videoLength?: number;
    frameRate?: string[];
    audioLength?: number;
    bitRate?: number;
    density?: number;
    size?: { imageWidth: number; imageHeight: number };
    fileType?: string[];
  };
  onFilterChange: (filterType: string, value: string | number) => void;
  onclearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({
  isOpen,
  onToggle,
  filterOptions,
  onFilterChange,
  onclearFilter,
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(
    {}
  );
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string | number;
  }>({});
  const inputRefs = useRef<{
    [key: string]: React.RefObject<HTMLInputElement>;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterClick = useCallback(
    (filterType: string, value: string | number) => {
      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        if (newFilters[filterType] === value) {
          delete newFilters[filterType];
        } else {
          newFilters[filterType] = value;
        }
        return newFilters;
      });

      const currentParams = new URLSearchParams(searchParams.toString());
      if (currentParams.get(filterType) === value.toString()) {
        currentParams.delete(filterType);
      } else {
        currentParams.set(filterType, value.toString());
      }
      router.push(`?${currentParams.toString()}`, { scroll: false });

      onFilterChange(filterType, value);
    },
    [onFilterChange, router, searchParams]
  );

  const handleNumericInputChange = useCallback(
    (key: string, value: string) => {
      const numValue = parseInt(value) || 0;
      handleFilterClick(key, numValue);
      // Maintain focus on the input after value change
      if (inputRefs.current[key] && inputRefs.current[key].current) {
        inputRefs.current[key].current?.focus();
      }
    },
    [handleFilterClick]
  );

  useEffect(() => {
    const filtersFromQuery: { [key: string]: string | number } = {};
    searchParams.forEach((value, key) => {
      if (
        key === "imageMinWidth" ||
        key === "imageMaxWidth" ||
        key === "imageMinHeight" ||
        key === "imageMaxHeight" ||
        key === "minVideoLength" ||
        key === "maxVideoLength" ||
        key === "audioMinLength" ||
        key === "audioMaxLength" ||
        key === "audioMinBitrate" ||
        key === "audioMaxBitrate" ||
        key === "maxDensity" ||
        key === "minDensity"
      ) {
        filtersFromQuery[key] = parseInt(value) || 0;
      } else {
        filtersFromQuery[key] = value;
      }
    });
    setActiveFilters(filtersFromQuery);
  }, [searchParams]);

  const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    expanded,
    onToggle,
    children,
  }) => (
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
    <div
      className={`h-fit sticky top-36 left-0 bg-white text-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center">
            <button
              onClick={onclearFilter}
              className="mr-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
            <button onClick={onToggle} className="md:hidden">
              <MdClear size={24} />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.sortBy.map((option) => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full ${
                  activeFilters["sortBy"] === option
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleFilterClick("sortBy", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {filterOptions.orientation && (
          <FilterSection
            title="Orientation"
            expanded={expandedSections["orientation"] || false}
            onToggle={() => toggleSection("orientation")}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.orientation.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${
                    activeFilters["orientation"] === option
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleFilterClick("orientation", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {filterOptions.resolution && (
          <FilterSection
            title="Resolution"
            expanded={expandedSections["resolution"] || false}
            onToggle={() => toggleSection("resolution")}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.resolution.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${
                    activeFilters["resolution"] === option
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    handleFilterClick(
                      "videoResolution",
                      option === "FHD" ? 1080 : 720
                    )
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {filterOptions.more && (
          <FilterSection
            title="More"
            expanded={expandedSections["more"] || false}
            onToggle={() => toggleSection("more")}
          >
            {filterOptions.more.map((option) => (
              <div key={option.label} className="mb-2">
                <h4 className="font-medium">{option.label}</h4>
                {Array.isArray(option.options) ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {option.options.map((subOption) => (
                      <button
                        key={subOption}
                        className={`px-3 py-1 rounded-full ${
                          activeFilters["imageFileType"] === subOption
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() =>
                          handleFilterClick("imageFileType", subOption)
                        }
                      >
                        {subOption}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["MinWidth", "MaxWidth", "MinHeight", "MaxHeight"].map(
                      (dim) => {
                        const key = `image${dim}`;
                        if (!inputRefs.current[key]) {
                          inputRefs.current[key] =
                            React.createRef<HTMLInputElement>();
                        }
                        return (
                          <input
                            key={key}
                            ref={inputRefs.current[key]}
                            type="number"
                            placeholder={dim}
                            className="w-32 px-2 py-1 border rounded"
                            value={activeFilters[key] || ""}
                            onChange={(e) =>
                              handleNumericInputChange(key, e.target.value)
                            }
                          />
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            ))}
          </FilterSection>
        )}

        {(filterOptions.videoLength !== undefined ||
          filterOptions.audioLength !== undefined ||
          filterOptions.bitRate !== undefined ||
          filterOptions.density !== undefined) && (
          <FilterSection
            title="Other Filters"
            expanded={expandedSections["otherFilters"] || false}
            onToggle={() => toggleSection("otherFilters")}
          >
            {filterOptions.videoLength !== undefined && (
              <div className="mb-2">
                <div className="flex gap-2">
                  <div>
                    <label className="block font-medium">minLength (sec)</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={activeFilters["minVideoLength"] || ""}
                      onChange={(e) =>
                        handleNumericInputChange(
                          "minVideoLength",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-medium">maxLength (sec)</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={activeFilters["maxVideoLength"] || ""}
                      onChange={(e) =>
                        handleNumericInputChange(
                          "maxVideoLength",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {filterOptions.audioLength !== undefined && (
              <div className="mb-2 flex gap-2">
                <div>
                  <label className="block font-medium">minLength(sec)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    className="w-full px-2 py-1 border rounded"
                    value={activeFilters["audioMinLength"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange("audioMinLength", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium">maxLength(sec)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    className="w-full px-2 py-1 border rounded"
                    value={activeFilters["audioMaxLength"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange("audioMaxLength", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {filterOptions.bitRate !== undefined && (
              <div className="mb-2 flex gap-2 ">
                <div>
                  <label className="block font-medium">minBitRate</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    className="w-full px-2 py-1 border rounded"
                    value={activeFilters["audioMinBitrate"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "audioMinBitrate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium">maxBitRate</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    className="w-full px-2 py-1 border rounded"
                    value={activeFilters["audioMaxBitrate"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "audioMaxBitrate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}
            {filterOptions.density !== undefined && (
              <div className="mb-2 flex gap-2">
                <div>
                  <label className="block font-medium">Min Density</label>
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="e.g. 0"
                    value={activeFilters["minDensity"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange("minDensity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium">Max Density</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    className="w-full px-2 py-1 border rounded"
                    value={activeFilters["maxDensity"] || ""}
                    onChange={(e) =>
                      handleNumericInputChange("maxDensity", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </FilterSection>
        )}

        {filterOptions.frameRate && (
          <FilterSection
            title="Frame Rate"
            expanded={expandedSections["frameRate"] || false}
            onToggle={() => toggleSection("frameRate")}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.frameRate.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${
                    activeFilters["frameRate"] === option
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    handleFilterClick(
                      "videoFrameRate",
                      option === "30Hz" ? 30 : 24
                    )
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
};

export default Filter;

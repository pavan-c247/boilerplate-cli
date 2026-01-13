"use client";

import { useTranslations } from "next-intl";
import React, { useCallback,useState } from "react";
import { Dropdown } from "react-bootstrap";

import FilterBar from "@/components/common/filter/FilterBar";
import { SearchInput } from "@/components/common/search";
import Button from "@/components/pure-components/Button";
import { FilterState, TableFilterSearchProps } from "@/types/filters";

const TableFilterSearch: React.FC<TableFilterSearchProps> = ({
  enableSearch = false,
  enableFilter = false,
  filtersConfig,
  searchPlaceholder,
  onFilterChange,
}) => {
  const t = useTranslations("common");
  const [showDropdown, setShowDropdown] = useState(false);
  const handleFilterApply = useCallback((filters: FilterState) => {
    setShowDropdown(false);
    
    // Notify parent component about applied filters
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [onFilterChange]);


  return (
    <>
      <div className="d-flex gap-3 mb-3">
        {/* SEARCH */}
        {enableSearch && <SearchInput placeholder={searchPlaceholder} />}

        {/* FILTER BUTTON + DROPDOWN */}
        {enableFilter && filtersConfig && (
          <Dropdown
            show={showDropdown}
            onToggle={(isOpen) => setShowDropdown(isOpen)}
            autoClose="outside"
            align="end"
            className="position-relative"
          >
            <Dropdown.Toggle
              as={Button}
              variant="primary"
              className="py-2 px-3"
            >
              <span className="fw-medium fs-sm">{t("filter.text")}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              onClick={(e) => e.stopPropagation()} // prevent inside close
              className="p-3 shadow border rounded fw-medium fs-sm"
              style={{
                width: "1000px", // take full width of container or customize
                maxWidth: "650px", // optional max width
                maxHeight: "800px", // limit height
                overflowY: "auto", // scroll if too tall
              }}
            >
              <FilterBar 
                filtersConfig={filtersConfig} 
                onApply={handleFilterApply}
              />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </>
  );
};

export default TableFilterSearch;

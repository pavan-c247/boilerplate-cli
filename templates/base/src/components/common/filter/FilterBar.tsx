"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";

import { useFilterHandlers } from "@/hooks/useFilterHandlers";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { FilterBarProps, FilterConfig, FilterState } from "@/types/filters";
import { updateUrlParams } from "@/utils";

import { createFilterRenderers } from "./FilterRenderers";

const FilterBar = <T extends FilterState>({ filtersConfig, onApply }: FilterBarProps<T>) => {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { appliedFilters, setAppliedFilters } = useUrlFilters(
    filtersConfig as FilterConfig<Record<string, unknown>>[],
  );

  const { handleDateFilter, handleSelectFilter } = useFilterHandlers(setAppliedFilters);

  const applyFilters = useCallback(() => {
    setAppliedFilters(appliedFilters);
    updateUrlParams(router, pathname, searchParams, appliedFilters);

    // Notify parent component about applied filters
    if (onApply) {
      onApply(appliedFilters);
    }
  }, [appliedFilters, router, pathname, searchParams, onApply, setAppliedFilters]);

  const filterRenderers = createFilterRenderers(
    appliedFilters,
    handleDateFilter,
    handleSelectFilter,
  );

  const resetFilters = () => {
    const clearedFilter: Record<string, string[]> = {};

    filtersConfig.forEach((filter) => {
      clearedFilter[filter.key as string] = [];
    });

    setAppliedFilters(clearedFilter);
    updateUrlParams(router, pathname, searchParams, clearedFilter);

    // Notify parent component about reset
    if (onApply) {
      onApply(clearedFilter);
    }
  };

  const hasFilters = Object.values(appliedFilters).some((v) => v.length > 0);

  return (
    <Row className="g-3">
      {filtersConfig.map((config) => {
        const renderFilter = filterRenderers[config.type];
        return (
          <Col key={String(config.key)} xs={12}>
            {renderFilter && renderFilter(config as FilterConfig<FilterState>)}
          </Col>
        );
      })}

      <Col className="d-flex justify-content-end gap-2 mt-4 border-top pt-3" xs={12}>
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="min-width-100"
        >
          {t("filter.reset")}
        </Button>
        <Button size="sm" disabled={!hasFilters} onClick={applyFilters} className="min-width-100">
          {t("filter.text")}
        </Button>
      </Col>
    </Row>
  );
};

export default FilterBar;

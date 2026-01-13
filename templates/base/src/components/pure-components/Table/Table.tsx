"use client";

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import NextArrowIcon from "@public/IconComponent/NextArrowIcon";
import PrevArrowIcon from "@public/IconComponent/PrevArrowIcon";
import { ArrowDownUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Collapse, Table as BootstrapTable } from "react-bootstrap";

import Button from "@/components/pure-components/Button";
import CommonAccordionRenderer from "@/components/pure-components/Table/CommonAccordionRenderer";
import { FIXED_COLUMN_POSITION } from "@/constants";
import { useAccordion, useStickyColumns } from "@/hooks/table";
import { FilterConfig } from "@/types/filters";
import { TableProps } from "@/types/table";
import { UITableColumn } from "@/types/ui";

import { SortableHeaderCell } from "./CommonSortableHeaderCell";
import styles from "./styles.module.scss";
import TableFilterSearch from "./TableSearchFilter";
import TableSetting from "./TableSetting";
import TableSkeleton from "./TableSkeleton";

const Table = <T extends Record<string, unknown>>({
  columns = [],
  dataSource = [],
  rowKey,
  className = "table table-striped table-hover table-responsive",
  bordered = false,
  striped = false,
  hover = false,
  size,
  variant,
  pagination,
  stickyHeader = false,
  loading = false,
  enableSearch = true,
  enableFilter = true,
  enableSetting = true,
  enableColumnReorder = false,
  filtersConfig,
  searchPlaceholder,
  sortBy,
  sortOrder,
  onSort,
  onFilterChange,
  accordion,
  rowActions,
}: TableProps<T>) => {
  const t = useTranslations("users");
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((c) => c.key));
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    columns.filter((c) => !c.hidden).map((c) => c.key),
  );

  const { leftOffsets, rightOffsets } = useStickyColumns(columns);

  const { toggle, isExpanded } = useAccordion(rowKey as string);

  const hasAccordion = !!accordion;
  const isColumnDragEnabled = Boolean(enableColumnReorder);
  const isColumnDraggable = (column: UITableColumn<T>) => column.disableReorder !== true;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag starts after 5px move
      },
    }),
  );

  /* --------------------------------
   * COMMON ROW CLICK FUNCTION
   * -------------------------------- */
  const handleRowClick = (record: T) => {
    if (!rowActions?.onRowClick) return;

    rowActions.onRowClick(record);
  };

  /* --------------------------------
   * COMMON STICKY CELL FUNCTION
   * -------------------------------- */
  const getStickyCellProps = (
    column: UITableColumn<T>,
    index: number,
  ): {
    className?: string;
    style?: React.CSSProperties;
  } => {
    const style: React.CSSProperties = {};
    let className: string | undefined;

    // 1️⃣ Apply width FIRST (independent of fixed)
    if (column.width) {
      style.width = column.width;
      style.minWidth = column.width;
      style.maxWidth = column.width;
    }

    // 2️⃣ Apply fixed positioning
    if (column.fixed === FIXED_COLUMN_POSITION.LEFT) {
      className = styles.fixedLeft;
      style.left = leftOffsets[index];
    }

    if (column.fixed === FIXED_COLUMN_POSITION.RIGHT) {
      className = styles.fixedRight;
      style.right = rightOffsets[index];
    }

    return { className, style };
  };

  /* --------------------------------
   * PAGINATION
   * -------------------------------- */

  const visibleColumns = React.useMemo(() => {
    const ordered = isColumnDragEnabled
      ? columnOrder.map((key) => columns.find((col) => col.key === key)).filter(Boolean)
      : columns;

    return ordered.filter((col) => col && visibleColumnKeys.includes(col.key));
  }, [columns, columnOrder, visibleColumnKeys, isColumnDragEnabled]);

  const draggableColumnKeys = React.useMemo(
    () =>
      visibleColumns
        .filter((col): col is UITableColumn<T> => col !== undefined)
        .filter(isColumnDraggable)
        .map((col) => col?.key)
        .filter((key): key is string => key !== undefined),
    [visibleColumns],
  );

  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, pageSize, total, onChange, onPageSizeChange } = pagination;

    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);

    return (
      <div className="pagination-table-bottom pt-3">
        <span style={{ fontWeight: 500 }}>Go to page</span>

        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
            onChange(page);
          }}
          className="form-control"
        />

        <span style={{ fontWeight: 500 }}>Per page</span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="form-select"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span style={{ fontWeight: 500 }}>
          {start} - {end} of {total}
        </span>

        <Button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
          className="btn d-flex align-items-center justify-content-center p-0 border-0"
          variant="primary"
        >
          <PrevArrowIcon />
        </Button>

        <Button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
          className="btn d-flex align-items-center justify-content-center p-0 border-0"
          variant="primary"
        >
          <NextArrowIcon />
        </Button>
      </div>
    );
  };

  /* --------------------------------
   * STICKY HEADER HEIGHT
   * -------------------------------- */
  useEffect(() => {
    if (!stickyHeader) return;

    const updateHeight = () => {
      setTableHeight(window.innerHeight - 350);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [stickyHeader]);

  const renderTableHeader = () => (
    <thead className={stickyHeader ? styles.stickyHeader : ""}>
      <tr>
        {hasAccordion && <th style={{ width: 40 }} />}
        {visibleColumns.map((column, index) => {
          if (!column) return null;
          const stickyProps = getStickyCellProps(column, index);

          const content = (
            <>
              {column.title}
              {column.sortable && (
                <span
                  className="ms-2 cursor-pointer d-inline-flex align-items-center border sort-icon"
                  onClick={() => onSort?.(column.key)}
                >
                  {sortBy === column.key ? (
                    sortOrder === "asc" ? (
                      <ArrowUpDown size={12} />
                    ) : (
                      <ArrowDownUp size={12} />
                    )
                  ) : (
                    <ArrowUpDown size={12} />
                  )}
                </span>
              )}
            </>
          );

          if (!isColumnDraggable(column)) {
            return (
              <th key={column.key} {...stickyProps}>
                {content}
              </th>
            );
          }

          return (
            <SortableHeaderCell
              key={column.key}
              index={index}
              column={column}
              stickyProps={stickyProps}
              enableColumnReorder={isColumnDragEnabled}
            >
              {content}
            </SortableHeaderCell>
          );
        })}
      </tr>
    </thead>
  );

  // on drag and drop function
  const handleColumnDragEnd = ({
    active,
    over,
  }: {
    active: { id: string | number };
    over: { id: string | number } | null;
  }) => {
    if (!over || active.id === over.id) return;

    // Only allow drag if both are draggable
    if (
      !draggableColumnKeys.includes(active.id as string) ||
      !draggableColumnKeys.includes(over.id as string)
    ) {
      return;
    }

    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  /* --------------------------------
   * RENDER
   * -------------------------------- */
  return (
    <>
      <div className="d-flex justify-content-between gap-2">
        {(enableSearch || enableFilter) && (
          <TableFilterSearch
            enableSearch={enableSearch}
            enableFilter={enableFilter}
            filtersConfig={filtersConfig as FilterConfig<Record<string, unknown>>[] | undefined}
            searchPlaceholder={searchPlaceholder}
            onFilterChange={onFilterChange}
          />
        )}

        {enableSetting && (
          <TableSetting
            columns={columns}
            visibleColumnKeys={visibleColumnKeys}
            onChange={setVisibleColumnKeys}
          />
        )}
      </div>
      <div
        className={styles.tableContainer}
        style={{
          maxHeight: stickyHeader ? tableHeight : "auto",
          overflowY: stickyHeader ? "auto" : "visible",
        }}
      >
        <BootstrapTable
          className={className}
          bordered={bordered}
          striped={striped}
          hover={hover}
          size={size}
          variant={variant}
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          {isColumnDragEnabled ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleColumnDragEnd}
            >
              <SortableContext items={draggableColumnKeys} strategy={horizontalListSortingStrategy}>
                {renderTableHeader()}
              </SortableContext>
            </DndContext>
          ) : (
            renderTableHeader()
          )}

          <tbody>
            {loading && dataSource.length === 0 ? (
              <TableSkeleton columns={visibleColumns.length} rows={8} />
            ) : dataSource.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="text-center text-muted py-4">
                  {t("noData")}
                </td>
              </tr>
            ) : (
              dataSource.map((record) => {
                const expanded = hasAccordion ? isExpanded(record) : false;
                const isRowAccordionEnabled = accordion?.shouldRender?.(record) ?? true;
                return (
                  <React.Fragment key={record[rowKey] as React.Key}>
                    <tr
                      className={`${expanded && hasAccordion && styles.expandedColumn} ${rowActions?.onRowClick ? styles.hoverRow : ""}`}
                      onClick={() => handleRowClick(record)}
                    >
                      {hasAccordion && (
                        <td
                          className={`${
                            hasAccordion && isRowAccordionEnabled
                              ? "cursor-pointer"
                              : "cursor-default"
                          }`}
                          onClick={() => hasAccordion && toggle(record)}
                        >
                          {isRowAccordionEnabled && (
                            <button type="button" className={`btn p-0 ${styles.svgIcon}`}>
                              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          )}
                        </td>
                      )}
                      {visibleColumns.map((column, columnIndex) => {
                        if (!column) return null; // Ensure column is defined
                        const stickyProps = getStickyCellProps(column, columnIndex);
                        return (
                          <td
                            key={`${record[rowKey]}-${column.key}`}
                            className={`${expanded && hasAccordion && styles.expandedColumn}`}
                            {...stickyProps}
                          >
                            {column.render
                              ? (column.render(
                                  column.dataIndex ? record[column.dataIndex] : null,
                                  record,
                                  columnIndex,
                                ) as React.ReactNode)
                              : column.dataIndex
                                ? (record[column.dataIndex] as React.ReactNode)
                                : null}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Accordion Content Row */}
                    {hasAccordion && isRowAccordionEnabled && (
                      <tr className={hasAccordion && styles.accordianRow}>
                        <td colSpan={visibleColumns.length + 1} className="p-0">
                          <Collapse
                            in={expanded}
                            className={hasAccordion && styles.accordianCollapse}
                          >
                            <div className="px-3">
                              <CommonAccordionRenderer record={record} node={accordion} />
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </BootstrapTable>
      </div>
      {renderPagination()}
    </>
  );
};

export default Table;

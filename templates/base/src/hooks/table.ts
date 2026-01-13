import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { FIXED_COLUMN_POSITION } from "@/constants";
import { Key } from "@/types/table";

export function useStickyColumns(columns: any[]) {
  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);

  const [leftOffsets, setLeftOffsets] = useState<number[]>([]);
  const [rightOffsets, setRightOffsets] = useState<number[]>([]);

  // Store previous values to prevent unnecessary setState
  const prevLeft = useRef<number[]>([]);
  const prevRight = useRef<number[]>([]);

  useLayoutEffect(() => {
    if (!columns.length) return;

    const calculateOffsets = () => {
      let leftOffset = 0;
      let rightOffset = 0;

      const left = new Array(columns.length).fill(0);
      const right = new Array(columns.length).fill(0);

      // LEFT sticky
      columns.forEach((col, index) => {
        if (col.fixed === FIXED_COLUMN_POSITION.LEFT) {
          left[index] = leftOffset;
          leftOffset += headerRefs.current[index]?.offsetWidth ?? 0;
        }
      });

      // RIGHT sticky
      for (let i = columns.length - 1; i >= 0; i--) {
        if (columns[i].fixed === FIXED_COLUMN_POSITION.RIGHT) {
          right[i] = rightOffset;
          rightOffset += headerRefs.current[i]?.offsetWidth ?? 0;
        }
      }

      // Prevent infinite re-render
      const leftChanged =
        left.length !== prevLeft.current.length ||
        left.some((v, i) => v !== prevLeft.current[i]);

      const rightChanged =
        right.length !== prevRight.current.length ||
        right.some((v, i) => v !== prevRight.current[i]);

      if (leftChanged) {
        prevLeft.current = left;
        setLeftOffsets(left);
      }

      if (rightChanged) {
        prevRight.current = right;
        setRightOffsets(right);
      }
    };

    // Run once after paint
    requestAnimationFrame(calculateOffsets);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculateOffsets);
    });

    headerRefs.current.forEach((el) => {
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener("resize", calculateOffsets);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateOffsets);
    };
  }, [columns.length]); // ✅ ONLY length, NOT whole array

  return {
    headerRefs,
    leftOffsets,
    rightOffsets,
  };
}

export function useAccordion<
  T extends Record<string, unknown>,
  K extends keyof T
>(rowKey: K, defaultExpanded: Key[] = []) {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(defaultExpanded);

  const toggle = useCallback(
    (record: T) => {
      const key = record[rowKey];

      if (typeof key !== "string" && typeof key !== "number") {
        return;
      }

      setExpandedKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    },
    [rowKey]
  );

  const isExpanded = useCallback(
    (record: T) => {
      const key = record[rowKey];
      return (
        (typeof key === "string" || typeof key === "number") &&
        expandedKeys.includes(key)
      );
    },
    [expandedKeys, rowKey]
  );

  return {
    expandedKeys,
    toggle,
    isExpanded,
  };
}

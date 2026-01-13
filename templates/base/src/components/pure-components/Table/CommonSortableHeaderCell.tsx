import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { SortableHeaderCellProps } from "@/types/table";
export const SortableHeaderCell = <T extends object>({
  column,
  stickyProps,
  children,
  enableColumnReorder,
}: SortableHeaderCellProps<T>) => {
  const reorderable = enableColumnReorder && column.disableReorder !== true;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.key,
    disabled: !reorderable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...stickyProps?.style,
  };

  return (
    <th ref={setNodeRef} className={stickyProps?.className} style={style}>
      <div className="d-flex align-items-center gap-2">
        {/* COLUMN CONTENT */}
        <div className="align-self-center">{children}</div>
        {/* DRAG HANDLE */}
        {reorderable && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grabbing d-inline-flex align-items-center border sort-icon"
            onClick={(e) => e.stopPropagation()}
            style={{cursor:"grabbing"}}
          >
            <GripVertical size={12} />
          </span>
        )}
      </div>
    </th>
  );
};

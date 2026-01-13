import { Settings } from "lucide-react"; // or any icon you use
import React from "react";
import { Dropdown, Form } from "react-bootstrap";

import type { UITableColumn } from "@/types/ui";

interface TableSettingProps {
  columns: UITableColumn<any>[];
  visibleColumnKeys: string[];
  onChange: (keys: string[]) => void;
}

const TableSetting: React.FC<TableSettingProps> = ({
  columns,
  visibleColumnKeys,
  onChange,
}) => {
  const toggleColumn = (key: string) => {
    if (visibleColumnKeys.includes(key)) {
      onChange(visibleColumnKeys.filter((k) => k !== key));
    } else {
      onChange([...visibleColumnKeys, key]);
    }
  };

  return (
    <Dropdown align="end" className="table-setting-dropdown">
      <Dropdown.Toggle
        variant="primary"
        className="border d-flex align-items-center gap-1 p-3"
      >
        <Settings size={16} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" style={{ minWidth: 220 }}>
        {columns.map((col) => {
          const checkboxId = `table-column-${col.key}`;

          return (
            <Form.Check
              key={col.key}
              id={checkboxId}
              type="checkbox"
              label={col.title}
              checked={visibleColumnKeys.includes(col.key)}
              onChange={() => toggleColumn(col.key)}
              className="mb-1 fs-sm"
            />
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TableSetting;

"use client";

import React from "react";

import Table from "@/components/pure-components/Table";
import { AccordionNode } from "@/types/table";

interface Props<T extends object> {
  record: T;
  node: AccordionNode<T>;
}

function CommonAccordionRenderer<T extends { children?: T[] }>({
  record,
  node,
}: Props<T>) {
  const dataSource = Array.isArray(record.children) ? record.children : [];

  if (!dataSource.length) return null;

  return (
    <>
      {/* 🔹 CUSTOM CONTENT (cards, profile, etc.) */}
      {node.renderContent && (
        <div className="mb-3">{node.renderContent(record)}</div>
      )}

      {/* 🔹 TABLE (only if columns exist) */}
      {node.columns && (
        <Table
          columns={node.columns}
          dataSource={dataSource}
          rowKey={node.rowKey}
          enableSearch={false}
          enableFilter={false}
          enableSetting={false}
          accordion={
            node.children
              ? {
                  ...node.children,
                  shouldRender: (childRecord: T) =>
                    Array.isArray(childRecord.children) &&
                    childRecord.children.length > 0,
                }
              : undefined
          }
        />
      )}
    </>
  );
}

export default CommonAccordionRenderer;

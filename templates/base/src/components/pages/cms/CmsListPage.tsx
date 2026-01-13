"use client";

// Moved from src/components/cms/CmsPages/index.tsx
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

import ActionButton from "@/components/pure-components/ActionButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import Status from "@/components/pure-components/Status";
import Table from "@/components/pure-components/Table";
import { useDeletePageMutation, usePagesQuery } from "@/hooks/cms";
import { useStandardPagination } from "@/hooks/usePagination";
import type { CMSPage } from "@/types/cms";
import { UITableColumn } from "@/types/ui";
import { handleDeleteAction } from "@/utils/deleteHandler";

export default function CmsListPage() {
  const tCommon = useTranslations("common");
  const tCms = useTranslations("cms");
  const router = useRouter();

  // React Query hooks
  const { data: pages = [], isLoading: loading, error } = usePagesQuery();
  const deletePageMutation = useDeletePageMutation();

  // Local state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "danger";
  }>({ show: false, message: "", variant: "success" });

  // Use the pagination hook for URL state management
  const {
    params: pagination,
    setPage,
    setPageSize,
    setSearch,
  } = useStandardPagination({
    defaultPageSize: 10,
  });

  // Sort pages by creation date (newest first)
  const sortedPages = [...pages].sort((a: CMSPage, b: CMSPage) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleOpenAddPage = () => {
    router.push("/cms/add");
  };

  const handleEdit = (page: CMSPage) => {
    router.push(`/cms/${page.id}/edit`);
  };

  const handleDelete = (id: string) =>
    handleDeleteAction({
      id,
      mutation: (id: string | number) =>
        deletePageMutation.mutateAsync(String(id)),
      t: tCms,
      setToast,
      confirmTitle: tCms("confirmDelete"),
      confirmButtonText: tCms("delete"),
      cancelButtonText: tCms("cancel"),
      successMessage: tCms("messages.cmsDeleted"),
      errorMessage: tCms("messages.errorDeleting"),
    });

  // Filter pages by search
  const filteredPages = pagination.search
    ? sortedPages.filter(
        (page) =>
          page.title.toLowerCase().includes(pagination.search.toLowerCase()) ||
          page.content
            .toLowerCase()
            .includes(pagination.search.toLowerCase()) ||
          page.slug.toLowerCase().includes(pagination.search.toLowerCase())
      )
    : sortedPages;

  // Pagination logic
  const total = filteredPages.length;
  const pagedPages = filteredPages.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  // Table columns
 const columns: UITableColumn<CMSPage>[] = [
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
    },
    {
      key: "slug",
      title: "Slug",
      dataIndex: "slug",
      render: (slug: string) => <code>/{slug}</code>,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (status: CMSPage["status"]) => (
        <Status
          variant={
            status as
              | "published"
              | "draft"
              | "archived"
              | "pending"
              | "scheduled"
          }
          label={status}
        />
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      dataIndex: "createdAt",
      render: (createdAt: string) => {
        if (!createdAt) return "-";
        const date = new Date(createdAt);
        return (
          date.toLocaleDateString() +
          " " +
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: CMSPage) => (
        <div className="action-wrap">
          <ActionButton
            title=""
            icon={<Pencil width={14} />}
            variant="primary"
            size="sm"
            className="text-white"
            tooltip="Edit"
            onClick={() => handleEdit(record)}
          />
          <ActionButton
            title=""
            icon={<Trash2 width={14} />}
            variant="danger"
            size="sm"
            className="text-white"
            tooltip="Delete"
            onClick={() => handleDelete(String(record.id))}
          />
        </div>
      ),
    },
  ];

  return (
    <CardWrapper
      title={tCms("pagesTitle")}
      onCreate={handleOpenAddPage}
      createButtonText={tCms("addPage")}
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {tCms("messages.errorLoading")}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={pagedPages}
        rowKey="id"
        hover
        pagination={{
          currentPage: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        loading={loading}
        searchPlaceholder={tCms("searchPlaceholder") || "Search pages..."}
      />

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Body
            style={{ color: toast.variant === "danger" ? "#fff" : undefined }}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </CardWrapper>
  );
}

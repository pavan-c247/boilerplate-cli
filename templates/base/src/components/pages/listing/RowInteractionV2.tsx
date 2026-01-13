"use client";

// Extracted from src/app/(view)/users/page.tsx

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import CommonToast from "@/components/common/toast";
import ActionButton from "@/components/pure-components/ActionButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import CommonModal from "@/components/pure-components/Modal";
import Status from "@/components/pure-components/Status";
import Table from "@/components/pure-components/Table";
import { DATA_TYPES, FIXED_COLUMN_POSITION } from "@/constants";
import { useStandardPagination } from "@/hooks/usePagination";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from "@/hooks/user";
import type { UITableColumn } from "@/types/ui";
import { handleDeleteAction } from "@/utils/deleteHandler";
import { formatDate } from "@/utils/formatDate";

import UserForm, { UserFormValues } from "../users/UserForm";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

// User type for the users list page
export type UserListItem = {
  id: string | number;
  name: string;
  email: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function RowInteractionV2() {
  const t = useTranslations("listing");
  const router = useRouter();
  // State
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<UserListItem>>({
    name: "",
    email: "",
    status: 0,
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "danger";
  }>({ show: false, message: "", variant: "success" });

  // Pagination state via URL params
  const {
    params: pagination,
    setPage,
    setPageSize,
    setSearch,
  } = useStandardPagination({ defaultPageSize: 10 });

  // Data fetching
  const { data, isLoading } = useUsersQuery(
    pagination.page,
    pagination.pageSize,
    pagination.search,
  );
  const users = data?.users || [];
  const total = data?.total || 0;

  const { mutateAsync: createUser } = useCreateUserMutation();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const [editId, setEditId] = useState<string | number | null>(null);

  const handleDelete = (id: string | number) =>
    handleDeleteAction({
      id,
      mutation: deleteUser,
      t,
      setToast,
    });

  const handleEditClick = (record: UserListItem) => {
    const idNumber =
      typeof record.id === DATA_TYPES.STRING ? parseInt(record.id as string, 10) : record.id;

    if (typeof idNumber !== DATA_TYPES.NUMBER || Number.isNaN(idNumber)) return;

    setEditId(idNumber);
    setForm({
      name: record.name,
      email: record.email,
      status: record.status,
    });
    setShowModal(true);
  };

  const columns: UITableColumn<UserListItem>[] = [
    {
      key: "name",
      title: t("name"),
      dataIndex: "name",
      fixed: FIXED_COLUMN_POSITION.LEFT,
    },
    {
      key: "email",
      title: t("email"),
      dataIndex: "email",
      fixed: FIXED_COLUMN_POSITION.LEFT,
    },
    {
      key: "status",
      title: t("status"),
      dataIndex: "status",
      fixed: FIXED_COLUMN_POSITION.LEFT,
      render: (status: number) => (
        <Status
          variant={status === 0 ? "active" : "inactive"}
          label={status === 0 ? t("statusOptions.active") : t("statusOptions.inactive")}
        />
      ),
    },
    {
      key: "createdAt",
      title: t("createdAt"),
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      key: "updatedAt",
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      render: (date: string) => formatDate(date),
    },
    {
      key: "actions",
      title: t("actions"),
      dataIndex: "id",
      fixed: FIXED_COLUMN_POSITION.RIGHT,
      render: (_: any, record: UserListItem) => (
        <div className="action-wrap" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            title=""
            icon={<Pencil width={14} />}
            variant="primary"
            size="sm"
            className="text-white"
            tooltip={t("edit")}
            onClick={() => handleEditClick(record)}
          />
          <ActionButton
            title=""
            icon={<Trash2 width={14} />}
            variant="danger"
            size="sm"
            className="text-white"
            tooltip={t("delete")}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setForm({ name: "", email: "", status: 0 });
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      if (editId !== null && typeof editId === "number") {
        await updateUser({ id: editId, data });
        setToast({
          show: true,
          message: t("messages.listUpdated"),
          variant: "success",
        });
      } else {
        await createUser(data);
        setToast({
          show: true,
          message: t("messages.listCreated"),
          variant: "success",
        });
      }
      setShowModal(false);
      setEditId(null);
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || t("messages.error"),
        variant: "danger",
      });
    }
  };

  return (
    <>
      <CardWrapper
        title={t("rowInteractionV2Title")}
        onCreate={handleOpenModal}
        createButtonText={t("createList")}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          hover
          pagination={{
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
            total,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          loading={isLoading}
          searchPlaceholder={t("searchPlaceholder")}
          stickyHeader
          rowActions={{
            onRowClick: (record) => {
              router.push(`/row-interaction-V2/${record.id}`);
            },
          }}
        />

        <CommonModal
          show={showModal}
          onClose={handleCloseModal}
          title={editId ? t("editList") : t("createNewList")}
        >
          <UserForm defaultValues={form} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
        </CommonModal>
      </CardWrapper>
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
}

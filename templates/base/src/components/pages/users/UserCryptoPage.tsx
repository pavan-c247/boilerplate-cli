"use client";

// Extracted from src/app/(view)/users/page.tsx

import { Pencil, Search,Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

import ActionButton from "@/components/pure-components/ActionButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import CommonModal from "@/components/pure-components/Modal";
import Status from "@/components/pure-components/Status";
import Table from "@/components/pure-components/Table";
import { encryptPayload } from "@/helper/encrypt";
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

import styles from "./styles.module.scss";
import UserForm, { UserFormValues } from "./UserForm";

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


export default function UserCryptoPage() {
  const t = useTranslations("users");
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
    pagination.search
  );
  const users = data?.users || [];
  const total = data?.total || 0;

  const { mutateAsync: createUser } = useCreateUserMutation();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const [editId, setEditId] = useState<number | null |string>(null);

  const handleDelete = (id: string | number) =>
    handleDeleteAction({
      id,
      mutation: deleteUser,
      t,
      setToast,
    });

  const columns: UITableColumn<UserListItem>[] = [
    { key: "name", title: t("name"), dataIndex: "name" },
    { key: "email", title: t("email"), dataIndex: "email" },
    {
      key: "status",
      title: t("status"),
      dataIndex: "status",
      render: (status: number) => (
        <Status
          variant={status === 0 ? "active" : "inactive"}
          label={
            status === 0
              ? t("statusOptions.active")
              : t("statusOptions.inactive")
          }
        />
      ),
    },
    {
      key: "createdAt",
      title: t("createdAt"),
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date, "YYYY-MM-DD HH:mm"),
    },
    {
      key: "updatedAt",
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      render: (date: string) => formatDate(date, "YYYY-MM-DD HH:mm"),
    },
    {
      key: "actions",
      title: t("actions"),
      dataIndex: "id",
      render: (_: any, record: UserListItem) => (
        <div className="action-wrap">
          <ActionButton
            title=""
            icon={<Pencil width={16} />}
            variant="primary"
            size="sm"
            className={`text-white ${styles.actionLink}`}
            tooltip={t("edit")}
            onClick={() => {
              setEditId(record.id);
              setForm({
                name: record.name,
                email: record.email,
                status: record.status,
              });
              setShowModal(true);
            }}
          />
          <ActionButton
            title=""
            icon={<Trash2 width={16} />}
            variant="danger"
            size="sm"
            className={`text-white ${styles.actionLink}`}
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
      const encryptData = await encryptPayload(data);
      if (editId !== null && typeof editId === "string") {
        await updateUser({ id: editId, data: { encryptedData: encryptData } });
        setToast({ show: true, message: t("messages.userUpdated"), variant: "success" });
      } else {
        await createUser({encryptedData: encryptData,});
        setToast({ show: true, message: t("messages.userCreated"), variant: "success" });
      }
      setShowModal(false);
      setEditId(null);
    } catch (err: any) {
      setToast({ show: true, message: err?.message || t("messages.error"), variant: "danger" });
    }
  };

  return (
    <CardWrapper title={t("title")} onCreate={handleOpenModal} createButtonText={t("createUser")}>
      {/* Search */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: 400 }}>
          <span className="input-group-text">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder={t("searchPlaceholder") || "Search users..."}
            value={pagination.search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {pagination.search && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

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
      />

      <CommonModal show={showModal} onClose={handleCloseModal} title={editId ? t("editUser") : t("createNewUser")}>
        <UserForm defaultValues={form} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </CommonModal>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide>
          <Toast.Body style={{ color: toast.variant === "danger" ? "#fff" : undefined }}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </CardWrapper>
  );
}

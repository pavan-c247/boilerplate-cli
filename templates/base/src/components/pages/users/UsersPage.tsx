"use client";

// Extracted from src/app/(view)/users/page.tsx

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

import ActionButton from "@/components/pure-components/ActionButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import CommonModal from "@/components/pure-components/Modal";
import Status from "@/components/pure-components/Status";
import Table from "@/components/pure-components/Table";
import { FILTER_ENTITY } from "@/constants";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from "@/hooks/user";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { UITableColumn } from "@/types/ui";
import { UserListItem } from "@/types/user";
import { getFiltersAsString } from "@/utils";
import { handleDeleteAction } from "@/utils/deleteHandler";
import { getFiltersConfig } from "@/utils/filterConfig";
import { formatDate } from "@/utils/formatDate";
import { useListTableController } from "@/utils/table";

import styles from "./styles.module.scss";
import UserForm, { UserFormValues } from "./UserForm";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function UsersPage() {
  const t = useTranslations("users");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<UserListItem>>({
    firstName: "",
    lastName: "",
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
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    sortBy,
    sortOrder,
    setSort,
  } = useListTableController();

  const filtersConfig = getFiltersConfig(FILTER_ENTITY.USER);

  const { appliedFilters } = useUrlFilters(filtersConfig);

  const mergedFilterString = getFiltersAsString(appliedFilters);

  const { data, isLoading } = useUsersQuery(
    page,
    pageSize,
    search,
    mergedFilterString,
    sortBy,
    sortOrder
  );
  const users = data?.users || [];
  const total = data?.total || 0;

  const { mutateAsync: createUser } = useCreateUserMutation();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const [editId, setEditId] = useState<number | string | null>(null);

  const handleDelete = (id: string | number) =>
    handleDeleteAction({
      id,
      mutation: deleteUser,
      t,
      setToast,
    });

  const columns: UITableColumn<UserListItem>[] = [
    {
      key: "firstName",
      title: t("firstName"),
      dataIndex: "firstName",
      sortable: true,
    },
    {
      key: "lastName",
      title: t("lastName"),
      dataIndex: "lastName",
      sortable: true,
    },
    { key: "email", title: t("email"), dataIndex: "email", sortable: true },
    {
      key: "status",
      title: t("status"),
      dataIndex: "status",
      sortable: true,
      render: (status: number) => (
        <Status
          variant={status === 1 ? "active" : "inactive"}
          label={
            status === 1
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
      sortable: true,
      render: (date: string) => formatDate(date, "YYYY-MM-DD HH:mm"),
    },
    {
      key: "updatedAt",
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      sortable: true,
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
            icon={<Pencil width={14} />}
            variant="primary"
            size="sm"
            className={`text-white ${styles.actionLink}`}
            tooltip={t("edit")}
            onClick={() => {
              setEditId(record.id);
              setForm({
                firstName: record.firstName,
                lastName: record.lastName,
                email: record.email,
                status: record.status,
              });
              setShowModal(true);
            }}
          />
          <ActionButton
            title=""
            icon={<Trash2 width={14} />}
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
    setForm({ firstName: "", lastName: "", email: "", status: 0 });
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      const payload = {
        firstName: data.firstName,
        ...(data.lastName?.trim() && { lastName: data.lastName }),
        email: data.email,
        status: data.status,
      };

      if (editId !== null) {
        await updateUser({ id: editId, data: payload });
        setToast({
          show: true,
          message: t("messages.userUpdated"),
          variant: "success",
        });
      } else {
        await createUser(payload);
        setToast({
          show: true,
          message: t("messages.userCreated"),
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
        title={t("title")}
        onCreate={handleOpenModal}
        createButtonText={t("createUser")}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          hover
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
          pagination={{
            currentPage: page,
            pageSize: pageSize,
            total,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          loading={isLoading}
          filtersConfig={filtersConfig}
          searchPlaceholder={t("searchPlaceholder")}
        />

        <CommonModal
          show={showModal}
          onClose={handleCloseModal}
          title={editId ? t("editUser") : t("createNewUser")}
        >
          <UserForm
            defaultValues={form}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
          />
        </CommonModal>
      </CardWrapper>
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 999999 }}
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
    </>
  );
}

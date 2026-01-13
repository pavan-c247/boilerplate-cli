"use client";

// Extracted from src/app/(view)/users/page.tsx

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CommonCard from "@/components/common/card/CommonCard";
import CommonCardSkeleton from "@/components/common/card/CommonCardSkeleton";
import CommonToast from "@/components/common/toast";
import CardWrapper from "@/components/pure-components/CardWrapper";
import CommonModal from "@/components/pure-components/Modal";
import { useStandardPagination } from "@/hooks/usePagination";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from "@/hooks/user";
import { handleDeleteAction } from "@/utils/deleteHandler";

import UserForm, { UserFormValues } from "../users/UserForm";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

// User type for the users list page
export type UserListItem = {
  id: string | number;
  name?: string;
  email?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function CardListingPage() {
  const t = useTranslations("listing");
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

  const [editId, setEditId] = useState<string | number | null>(null);

  const handleDelete = (id: string | number) =>
    handleDeleteAction({
      id,
      mutation: deleteUser,
      t,
      setToast,
    });

  const handleEditClick = (record: UserListItem) => {
    setEditId(record.id);
    setForm({
      name: record.name,
      email: record.email,
      status: record.status,
    });
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setForm({ name: "", email: "", status: 0 });
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      if (editId !== null) {
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
        title={t("cardListTitle")}
        onCreate={handleOpenModal}
        createButtonText={t("createList")}
      >
        <Container>
          <Row>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Col key={i} xs={12} sm={6} md={3} lg={3} className="p-3">
                    <CommonCardSkeleton />
                  </Col>
                ))
              : users.map((user) => (
                  <Col key={user.id} xs={12} sm={6} md={3} lg={3} className="p-3">
                    <CommonCard
                      items={user}
                      showActions
                      onEdit={handleEditClick}
                      onDelete={() => handleDelete(user.id)}
                    />
                  </Col>
                ))}
          </Row>
        </Container>

        <CommonModal
          show={showModal}
          onClose={handleCloseModal}
          title={editId ? t("editList") : t("createNewList")}
        >
          <UserForm
            defaultValues={form}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
          />
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

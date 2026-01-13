"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

import ActionButton from "@/components/pure-components/ActionButton";
import Button from "@/components/pure-components/Button";
import CardWrapper from "@/components/pure-components/CardWrapper";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import TextArea from "@/components/pure-components/Form/Input/TextArea";
import Modal from "@/components/pure-components/Modal";
import Table from "@/components/pure-components/Table";
import { THEME_COLORS } from "@/constants";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useFaqsQuery,
  useUpdateFaqMutation,
} from "@/hooks/faq";
import { type Faq as FaqType } from "@/services/faq";
import { handleDeleteAction } from "@/utils/deleteHandler";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const FaqComponent: React.FC = () => {
  const tCommon = useTranslations("common");
  const tFaq = useTranslations("faq");

  // React Query hooks
  const { data: faqs = [], isLoading: loading, error } = useFaqsQuery();
  const createFaqMutation = useCreateFaqMutation();
  const updateFaqMutation = useUpdateFaqMutation();
  const deleteFaqMutation = useDeleteFaqMutation();

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "danger";
  }>({ show: false, message: "", variant: "success" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const submitting = createFaqMutation.isPending || updateFaqMutation.isPending;

  const handleOpenModal = () => {
    setForm({ title: "", description: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (faq: FaqType) => {
    setForm({ title: faq.title, description: faq.description });
    setEditingId(faq.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) =>
    handleDeleteAction({
      id,
      mutation: (id: number | string) =>
        deleteFaqMutation.mutateAsync(String(id)),
      t: tFaq,
      setToast,
      confirmTitle: tFaq("confirmDelete"),
      confirmButtonText: tFaq("delete"),
      cancelButtonText: tFaq("cancel"),
      successMessage: tFaq("messages.faqDeleted"),
      errorMessage: tFaq("messages.errorDeleting"),
    });

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ title: "", description: "" });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaqMutation.mutateAsync({ id: editingId, data: form });
        setToast({
          show: true,
          message: tFaq("messages.faqUpdated"),
          variant: "success",
        });
      } else {
        await createFaqMutation.mutateAsync(form);
        setToast({
          show: true,
          message: tFaq("messages.faqCreated"),
          variant: "success",
        });
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ title: "", description: "" });
    } catch {
      setToast({
        show: true,
        message: tFaq("messages.errorSaving"),
        variant: "danger",
      });
    }
  };

  // Pagination logic
  const total = faqs.length;
  const pagedFaqs = faqs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { key: "title", title: "Title", dataIndex: "title" },
    { key: "description", title: "Description", dataIndex: "description" },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Record<string, unknown>) => {
        const faqRecord = record as FaqType;
        return (
          <div className="action-wrap">
            <ActionButton
              title=""
              icon={<Pencil width={16} />}
              variant="primary"
              size="sm"
              className="text-white"
              tooltip={tFaq("edit") || "Edit"}
              onClick={() => handleEdit(faqRecord)}
            />
            <ActionButton
              title=""
              icon={<Trash2 width={16} />}
              variant="danger"
              size="sm"
              className="text-white"
              tooltip={tFaq("delete") || "Delete"}
              onClick={() => handleDelete(faqRecord.id)}
              disabled={deleteFaqMutation.isPending}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CardWrapper
      title={tFaq("faqTitle")}
      onCreate={handleOpenModal}
      createButtonText={tFaq("addFaq")}
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {tFaq("messages.errorLoading")}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={pagedFaqs}
        rowKey="id"
        hover
        pagination={{
          currentPage,
          pageSize,
          total,
          onChange: setCurrentPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
        loading={loading}
      />
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingId ? tFaq("editFaq") : tFaq("addFaq")}
        footer={null}
        size="lg"
      >
        <Form onSubmit={handleFormSubmit}>
          <FormGroup>
            <FormLabel>{tFaq("title")}</FormLabel>
            <Input
              name="title"
              placeholder={tFaq("title")}
              value={form.title}
              onChange={handleFormChange}
              required
              disabled={submitting}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>{tFaq("description")}</FormLabel>
            <TextArea
              name="description"
              placeholder={tFaq("description")}
              value={form.description}
              onChange={handleFormChange}
              required
              disabled={submitting}
              rows={4}
            />
          </FormGroup>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="secondary"
              type="button"
              onClick={handleCloseModal}
            >
              {tCommon("actions.cancel", { default: tFaq("cancel") })}
            </Button>
            <Button variant={THEME_COLORS.PRIMARY} type="submit">
              {editingId ? tFaq("update") : tFaq("save")}
            </Button>
          </div>
        </Form>
      </Modal>
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
};

export default FaqComponent;

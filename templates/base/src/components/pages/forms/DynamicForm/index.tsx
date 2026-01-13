"use client";

import { Copy, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import CommonToast from "@/components/common/toast";
import ActionButton from "@/components/pure-components/ActionButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import Spinner from "@/components/pure-components/Spinner";
import Table from "@/components/pure-components/Table";
import { BUTTON_VARIANTS } from "@/constants";
import {
  useAddUpdateFormConfigMutation,
  useDeleteFormConfigMutation,
  useFormConfigsQuery,
} from "@/hooks/dynamicForm";
import { useToast } from "@/hooks/useToast";
import { paths } from "@/routes";
import {
  createFormConfigApiPayload,
  formConfigService,
  renderDynamicFormFields,
} from "@/services/dynamicForm";
import type { DynamicFormResponseData } from "@/types/forms/dynamicForm";
import type { UITableColumn } from "@/types/ui";
import { useDeleteActionV2 } from "@/utils/deleteHandlerV2";
import { formatDate } from "@/utils/formatDate";

import styles from "./styles.module.scss";

export default function DynamicFormsListPage() {
  const t = useTranslations("dynamicForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { handleDeleteActionV2 } = useDeleteActionV2();

  const [duplicatingFormId, setDuplicatingFormId] = useState<string | null>(null);

  // Fetch all form configs
  const { data: formData, isLoading } = useFormConfigsQuery();
  const forms = formData || [];

  const { mutateAsync: deleteFormConfig } = useDeleteFormConfigMutation();
  const { mutateAsync: addUpdateFormConfig } = useAddUpdateFormConfigMutation();

  const handleDelete = (id: string) =>
    handleDeleteActionV2({
      id,
      mutation: (id) => deleteFormConfig(String(id)),
      showSuccess,
      showError,
    });

  const handleEdit = (id: string) => {
    router.push(`${paths.DYNAMIC_FORM_LIST}/${id}/edit`);
  };

  const handleAddForm = () => {
    router.push(paths.DYNAMIC_FORM_ADD);
  };

  const handleDuplicate = async (id: string) => {
    try {
      setDuplicatingFormId(id);
      // Fetch the form configuration
      const response = await formConfigService.getFormConfig(id);
      const formConfig = renderDynamicFormFields(response);
      if (!formConfig) {
        showError(tCommon("errors.notFound"));
        setDuplicatingFormId(null);
        return;
      }
      // Create a duplicate with modified title
      const duplicatedConfig = {
        ...formConfig,
        title: `${formConfig.title} (${t("duplicate")})`,
      };
      // Convert to API request format
      const data = createFormConfigApiPayload(duplicatedConfig);
      await addUpdateFormConfig(data);
      showSuccess(t("formDuplicated"));
    } catch (error: any) {
      console.error("Failed to duplicate form:", error);
      showError(error?.message || tCommon("errors.serverError"));
    } finally {
      setDuplicatingFormId(null);
    }
  };

  const columns: UITableColumn<DynamicFormResponseData>[] = [
    {
      key: "Id",
      title: t("id"),
      dataIndex: "id",
    },
    {
      key: "title",
      title: tCommon("title"),
      dataIndex: "title",
    },
    {
      key: "createdAt",
      title: tCommon("createdAt"),
      render: (createdAt) => formatDate(createdAt),
    },
    {
      key: "updatedAt",
      title: tCommon("updatedAt"),
      render: (updatedAt) => formatDate(updatedAt),
    },
    {
      key: "actions",
      title: tCommon("actionsText"),
      render: (_: any, record: DynamicFormResponseData) => {
        const isDuplicating = duplicatingFormId === record.id;
        const isAnyDuplicating = duplicatingFormId !== null;
        return (
          <div className="action-wrap">
            <ActionButton
              title=""
              icon={<Pencil width={16} />}
              variant={BUTTON_VARIANTS.PRIMARY}
              size="sm"
              className={`text-white ${styles.actionLink}`}
              tooltip={tCommon("actions.edit")}
              disabled={isAnyDuplicating}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record.id);
              }}
            />
            <ActionButton
              title=""
              icon={isDuplicating ? <Spinner /> : <Copy width={16} />}
              variant={BUTTON_VARIANTS.SECONDARY}
              size="sm"
              className={`text-white ${styles.actionLink}`}
              tooltip={t("duplicate")}
              disabled={isAnyDuplicating}
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(record.id);
              }}
            />
            <ActionButton
              title=""
              icon={<Trash2 width={16} />}
              variant={BUTTON_VARIANTS.DANGER}
              size="sm"
              className={`text-white ${styles.actionLink}`}
              tooltip={tCommon("actions.delete")}
              disabled={isAnyDuplicating}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CardWrapper
      title={t("title")}
      onCreate={handleAddForm}
      createButtonText={tCommon("addButton", { entityName: t("form") })}
    >
      <Table
        columns={columns}
        dataSource={forms}
        rowKey="id"
        hover
        loading={isLoading}
        searchPlaceholder={tCommon("multiselect.searchPlaceholder")}
      />
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </CardWrapper>
  );
}

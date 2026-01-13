import { useTranslations } from "next-intl";

import { confirmDialog } from "./swal";

export function useDeleteActionV2() {
  const tCommon = useTranslations("common");
  const handleDeleteActionV2 = async ({
    id,
    mutation,
    showSuccess,
    showError,
    confirmTitle,
    confirmText,
    confirmButtonText,
    cancelButtonText,
    successMessage,
    errorMessage,
    entityName = "",
  }: {
    id: number | string;
    mutation: (id: number | string) => Promise<any>;
    showSuccess: (msg: string) => void;
    showError: (msg: string) => void;
    entityName?: string;
    confirmTitle?: string;
    confirmText?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    successMessage?: string;
    errorMessage?: string;
  }) => {
    const baseMessage = `${tCommon("deleteConfirmation", { entityName })}?`;

    const confirmed = await confirmDialog({
      title: confirmTitle || baseMessage,
      text: confirmText || "",
      confirmButtonText: confirmButtonText || tCommon("actions.delete"),
      cancelButtonText: cancelButtonText || tCommon("actions.cancel"),
      icon: "error",
    });

    if (!confirmed) return;

    try {
      await mutation(id);
      showSuccess(successMessage || tCommon("success.deleted"));
    } catch (err: any) {
      showError(err?.message || errorMessage || tCommon("errors.error"));
    }
  };
  return { handleDeleteActionV2 };
}

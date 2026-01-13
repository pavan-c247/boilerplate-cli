import { useCallback,useState } from "react";

import { ToastVariant } from "@/components/common/toast";

export interface ToastState {
  show: boolean;
  message: string;
  variant: ToastVariant;
}

const initialToastState: ToastState = {
  show: false,
  message: "",
  variant: "success",
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>(initialToastState);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToast({
      show: true,
      message,
      variant,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      show: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "danger");
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, "warning");
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info");
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;

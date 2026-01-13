"use client";

import { Toast, ToastContainer } from "react-bootstrap";

import { THEME_COLORS } from "@/constants";

export type ToastVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface CommonToastProps {
  show: boolean;
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
}

const CommonToast = ({
  show,
  message,
  variant = THEME_COLORS.PRIMARY,
  onClose,
}: CommonToastProps) => {
  if (!show) return null;

  return (
    <ToastContainer position="top-end" className="p-3 common-toast-container">
      <Toast
        bg={variant}
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        className={`common-toast common-toast--${variant}`}
      >
        <Toast.Body className="common-toast-body">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CommonToast;

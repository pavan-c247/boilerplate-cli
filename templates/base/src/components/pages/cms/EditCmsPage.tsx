"use client";

// Copied from src/app/(view)/cms/[id]/edit/page.tsx
import React, { useEffect, useState } from "react";
import CmsForm from "./CmsForm";
import type { CmsFormValues } from "./CmsForm";
import { cmsService, type CMSPage } from "@/services/cms";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CardWrapper from "@/components/pure-components/CardWrapper";
import { Toast, ToastContainer } from "react-bootstrap";
import type { PageStatus } from "@/types/cms";

const convertEditorJSToHTML = (editorJSData: any): string => {
  if (!editorJSData || !editorJSData.blocks || !Array.isArray(editorJSData.blocks)) return "";
  return editorJSData.blocks.map((block: any) => {
    switch (block.type) {
      case "paragraph": return `<p>${block.data.text || ""}</p>`;
      case "header": return `<h${block.data.level || 1}>${block.data.text || ""}</h${block.data.level || 1}>`;
      case "list": {
        const listType = block.data.style === "ordered" ? "ol" : "ul";
        const items = (block.data.items || []).map((item: string) => `<li>${item}</li>`).join("");
        return `<${listType}>${items}</${listType}>`;
      }
      case "quote": return `<blockquote><p>${block.data.text || ""}</p></blockquote>`;
      case "image": return `<img src="${block.data.url || ""}" alt="${block.data.caption || ""}" />`;
      case "code": return `<pre><code>${block.data.code || ""}</code></pre>`;
      default: return `<p>${block.data.text || ""}</p>`;
    }
  }).join("");
};

export default function EditCmsPage() {
  const t = useTranslations("cms");
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.id === "string" ? params.id : undefined;

  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = React.useState<{ show: boolean; message: string; variant: "success" | "danger" }>({ show: false, message: "", variant: "success" });

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      try {
        setLoading(true); setError(null);
        const fetchedPage = await cmsService.getPage(slug);
        fetchedPage ? setPage(fetchedPage) : setError("Page not found");
      } catch { setError(t("messages.error")); } finally { setLoading(false); }
    };
    fetchPage();
  }, [slug, t]);

  const handleFormSubmit = async (formData: CmsFormValues) => {
    if (!page) return;
    try {
      setSaving(true);
      const pageData = {
        title: formData.title,
        content: typeof formData.content === "string" ? formData.content : JSON.stringify(formData.content),
        slug: formData.slug,
        status: (formData.status === "PUBLISHED" ? "published" : "draft") as PageStatus,
        metaTitle: "",
        metaDescription: "",
        isAgreement: Boolean(formData.is_agreement),
        openInNewTab: Boolean(formData.open_in_new_tab),
        contentType: formData.content_type,
      };
      await cmsService.updatePage(String(page.id), pageData);
      setToast({ show: true, message: t("messages.cmsUpdated"), variant: "success" });
      setTimeout(() => router.push("/cms"), 1000);
    } catch (err: any) {
      setToast({ show: true, message: err?.message || t("messages.error"), variant: "danger" });
    } finally { setSaving(false); }
  };

  const handleCancel = () => router.push("/cms");
  if (!slug) return null;
  if (loading) return (<CardWrapper title={t("editCms")}> <div className="d-flex justify-content-center p-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div></CardWrapper>);
  if (error) return (<CardWrapper title={t("editCms")}> <div className="alert alert-danger" role="alert">{error}</div></CardWrapper>);
  if (!page) return (<CardWrapper title={t("editCms")}> <div className="alert alert-warning" role="alert">Page not found</div></CardWrapper>);

  let parsedContent = page.content;
  try {
    if (typeof page.content === "string" && page.content.startsWith("{")) {
      const parsed = JSON.parse(page.content);
      parsedContent = parsed && parsed.blocks && Array.isArray(parsed.blocks) ? convertEditorJSToHTML(parsed) : parsed;
    }
  } catch {}

  const defaultValues: Partial<CmsFormValues> = {
    title: page.title,
    content: parsedContent,
    status: page.status === "published" ? "PUBLISHED" : "DRAFT",
    is_agreement: page.isAgreement ? 1 : 0,
    open_in_new_tab: page.openInNewTab ? 1 : 0,
    content_type: page.contentType === "LINK" ? "LINK" : "TEXT",
    slug: page.slug,
  };

  return (
    <CardWrapper title={t("editCms")}> <CmsForm onSubmit={handleFormSubmit} defaultValues={defaultValues} onCancel={handleCancel} isLoading={saving} /> <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}> <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide> <Toast.Body style={{ color: toast.variant === "danger" ? "#fff" : undefined }}>{toast.message}</Toast.Body> </Toast> </ToastContainer></CardWrapper>
  );
}

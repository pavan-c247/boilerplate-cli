import {
  Book,
  ClipboardList,
  FileText,
  GraduationCap,
  Headset,
  LayoutDashboard,
  MessageCircle,
  Notebook,
  PackageCheck,
  Upload,
  Users,
} from "lucide-react";
import React from "react";

import { CHILD_ICON_SIZE, TOP_LEVEL_ICON_SIZE, USER_ROLES } from "@/constants/index";
import { SidebarMenuItem } from "@/types/sidebar";

export const SIDE_BAR_MENU: SidebarMenuItem[] = [
  {
    id: "dashboard",
    labelKey: "dashboard",
    icon: <LayoutDashboard size={TOP_LEVEL_ICON_SIZE} />,
    path: "/dashboard",
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    id: "users",
    labelKey: "users",
    icon: <Users size={TOP_LEVEL_ICON_SIZE} />,
    path: "/users",
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    id: "cms",
    labelKey: "cms",
    icon: <Book size={TOP_LEVEL_ICON_SIZE} />,
    path: "/cms",
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    id: "documents",
    labelKey: "documents",
    icon: <FileText size={TOP_LEVEL_ICON_SIZE} />,
    path: "/documents",
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    id: "bulk-import",
    labelKey: "bulkImport",
    icon: <Upload size={TOP_LEVEL_ICON_SIZE} />,
    allowedRoles: [USER_ROLES.ADMIN],
    children: [
      {
        id: "bulk-import-faq",
        labelKey: "bulkImportFaq",
        icon: <MessageCircle size={CHILD_ICON_SIZE} />,
        path: "/bulk-import/faq",
        allowedRoles: [USER_ROLES.ADMIN],
      },
      {
        id: "bulk-import-user",
        labelKey: "bulkImportUser",
        icon: <Users size={CHILD_ICON_SIZE} />,
        path: "/bulk-import/users",
        allowedRoles: [USER_ROLES.ADMIN],
      },
    ],
  },
  {
    id: "component",
    labelKey: "component",
    icon: <PackageCheck size={TOP_LEVEL_ICON_SIZE} />,
    allowedRoles: [USER_ROLES.ADMIN],
    children: [
      {
        id: "form",
        labelKey: "form",
        icon: <ClipboardList size={CHILD_ICON_SIZE} />,
        allowedRoles: [USER_ROLES.ADMIN],
        children: [
          {
            id: "simple-form",
            labelKey: "simpleForm",
            path: "/forms/simple-form",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "multi-step-form",
            labelKey: "multiStepForm",
            path: "/forms/multistep-form",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "dynamic-form",
            labelKey: "dynamicForm",
            path: "/forms/dynamic-form",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "contact-form",
            labelKey: "contactForm",
            path: "/forms/contact-form",
            allowedRoles: [USER_ROLES.ADMIN],
          },
        ],
      },
      {
        id: "listing",
        labelKey: "listing",
        icon: <MessageCircle size={CHILD_ICON_SIZE} />,
        allowedRoles: [USER_ROLES.ADMIN],
        children: [
          {
            id: "simple",
            labelKey: "simpleListing",
            path: "/simple-listing",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "card-listing",
            labelKey: "cardListing",
            path: "/card-listing",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "fixed-column",
            labelKey: "fixedColumnListing",
            path: "/fixed-column",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "accordion-listing",
            labelKey: "accordionListing",
            path: "/accordian-list",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "accordion-listing-v2",
            labelKey: "accordionListingSecond",
            path: "/accordian-list-v2",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "drag-drop-listing",
            labelKey: "dragDropListing",
            path: "/drag-drop-column",
             allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "row-interaction",
            labelKey: "rowInteraction",
            path: "/row-interaction",
            allowedRoles: [USER_ROLES.ADMIN],
          },
          {
            id: "row-interaction-V2",
            labelKey: "rowInteractionV2",
            path: "/row-interaction-V2",
            allowedRoles: [USER_ROLES.ADMIN],
          },
        ],
      },
    ],
  },
  {
    id: "faq",
    labelKey: "faq",
    icon: <MessageCircle size={TOP_LEVEL_ICON_SIZE} />,
    path: "/faq",
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    id: "Support Email",
    labelKey: "supportEmail",
    icon: <Headset size={TOP_LEVEL_ICON_SIZE} />,
    path: "/support-email",
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    id: "lms",
    labelKey: "lms",
    icon: <GraduationCap size={TOP_LEVEL_ICON_SIZE} />,
    allowedRoles: [USER_ROLES.USER],
    children: [
      {
        id: "courses",
        labelKey: "courses",
        icon: <Notebook size={CHILD_ICON_SIZE} />,
        path: "/lms/courses",
        allowedRoles: [USER_ROLES.USER],
      },
    ],
  },
];

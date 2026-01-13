"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Col } from "react-bootstrap";

import { USER_ROLES } from "@/constants";
import { useAuth } from "@/hooks/auth";
import { SidebarMenuItem } from "@/types/sidebar";

import { SIDE_BAR_MENU } from "./config";
import styles from "./styles.module.scss";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
}

const HOVER_DELAY = 150;

// Helper to safely check if a menu path is part of current pathname
const isPathActive = (menuPath: string | undefined, pathname: string) => {
  if (!menuPath) return false;
  // Ensure exact segment match: e.g., "/cms" matches "/cms" or "/cms/24/edit"
  const normalizedPath = menuPath.endsWith("/")
    ? menuPath.slice(0, -1)
    : menuPath;
  return (
    pathname === normalizedPath || pathname.startsWith(normalizedPath + "/")
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onCollapseChange }) => {
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const t = useTranslations("sidebar");
    const { user } = useAuth();

  const isExpanded = !isCollapsed || isHoverExpanded;


  // Get user role ID
  const userRoleId = Number(user?.role) || -1;

  // Filter menu items based on user role
  const filterMenuItems = useMemo(() => {
    const filter = (items: SidebarMenuItem[], roleId: number): SidebarMenuItem[] => {
      return items
        .filter((item) => {
          // If no allowedRoles specified, default to Admin only
          if (!item.allowedRoles || item.allowedRoles.length === 0) {
            return roleId === USER_ROLES.ADMIN;
          }
          // Check if user role ID matches any allowed role ID
          return item.allowedRoles.includes(roleId);
        })
        .map((item) => {
          // Recursively filter children
          if (item.children && item.children.length > 0) {
            const filteredChildren = filter(item.children, roleId);
            // Only include parent if it has visible children or has a path
            if (filteredChildren.length > 0 || item.path) {
              return { ...item, children: filteredChildren };
            }
            return null;
          }
          return item;
        })
        .filter((item): item is SidebarMenuItem => item !== null);
    };

    return filter(SIDE_BAR_MENU, userRoleId);
  }, [userRoleId]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isCollapsed) {
      setOpenAccordions([]);
    }
  }, [isCollapsed]);

  // Recursively find parent IDs to open accordions for current path
  useEffect(() => {
    const openIds: string[] = [];

    const findOpenAccordions = (
      items: SidebarMenuItem[],
      parents: string[] = []
    ) => {
      items.forEach((item) => {
        if (isPathActive(item.path, pathname)) {
          openIds.push(...parents);
        }
        if (item.children) {
          findOpenAccordions(item.children, [...parents, item.id]);
        }
      });
    };

    findOpenAccordions(filterMenuItems);
    setOpenAccordions(openIds);
  }, [pathname, filterMenuItems]);

  const handleMouseEnter = () => {
    if (!isCollapsed) return;
    hoverTimer.current = setTimeout(
      () => setIsHoverExpanded(true),
      HOVER_DELAY
    );
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (isCollapsed) {
      setIsHoverExpanded(false);
      setOpenAccordions([]);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderMenuItems = (items: SidebarMenuItem[]): JSX.Element[] =>
    items.map((item) => {
      const hasChildren = !!item.children?.length;

      // Highlight active if exact path or proper subpath
      const isActive = isPathActive(item.path, pathname);

      // Accordion open if manually toggled or has active child
      const isOpen = openAccordions.includes(item.id);
      return (
        <div key={item.id} className={styles.menuItemWrapper}>
          <Link
            href={item.path || "#"}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleAccordion(item.id);
              }
            }}
          >
            {item?.icon && <span className={styles.icon}>{item.icon}</span>}
            {isExpanded && (
              <>
                <span>{t(item.labelKey)}</span>
                {hasChildren && (
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
                  />
                )}
              </>
            )}
          </Link>

          {hasChildren && (
            <div className={styles.accordionContent}>
              {isExpanded && isOpen && renderMenuItems(item.children!)}
            </div>
          )}
        </div>
      );
    });

  return (
    <>
      {isHoverExpanded && isCollapsed && (
        <div
          className={styles.sidebarBackdrop}
          onMouseEnter={handleMouseLeave}
        />
      )}

      <Col
        xs="auto"
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${
          isHoverExpanded ? styles.hoverExpanded : ""
        } d-flex flex-column`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className={styles.nav}>{renderMenuItems(filterMenuItems)}</nav>
      </Col>
    </>
  );
};

export default Sidebar;

"use client";

import LogoIcon from "@public/logo.svg";
import { Bell, ChevronLeft, ChevronRight, LogOut, Moon, Sun, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Overlay, Popover } from "react-bootstrap";

import { DEFAULT_PAGINATION } from "@/constants";
import { useAuth } from "@/hooks/auth";
import { useMarkNotificationsRead, useNotificationsInfiniteQuery } from "@/hooks/notifications";
import type { Notification } from "@/types/notifications";

import NotificationList from "./NotificationList";
import styles from "./styles.module.scss";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const ITEMS_PER_PAGE = DEFAULT_PAGINATION.limit;

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bellRef = useRef<HTMLButtonElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const router = useRouter();
  const t = useTranslations("header");
  const tCommon = useTranslations("common");

  // Get notifications using infinite query - load on page load, not on click
  const { data, isLoading, error, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useNotificationsInfiniteQuery(ITEMS_PER_PAGE, { enabled: true });

  const { mutateAsync: markAsRead } = useMarkNotificationsRead();

  // Track which notifications have been read optimistically
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

  // Flatten notifications from all pages
  const allNotifications: Notification[] =
    data?.pages.flatMap((page) => page.data?.notifications ?? page.notifications ?? []) ?? [];

  // Get unread count from the first page
  const unreadCounts: number =
    data?.pages[0]?.data?.unreadCount ?? data?.pages[0]?.unreadCount ?? 0;

  // Get hasMore from the last page
  const hasMore = hasNextPage ?? false;

  // Infinite scroll observer - works when dropdown is open
  useEffect(() => {
    // Only set up observer when dropdown is open and there's more data
    if (!showNotifications || !loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [showNotifications, fetchNextPage, hasNextPage]);


  // Handle notification click - mark as read and close popover
  const handleNotificationClick = (notification: Notification) => {
    // Optimistic update: mark as read locally (only if not already)
    setReadNotificationIds((prev) => {
      if (prev.has(notification.id)) return prev;

      const next = new Set(prev);
      next.add(notification.id);
      return next;
    });

    if (!notification.read && user?.id) {
      markAsRead({
        notificationIds: [notification.id],
      });
    }

    setShowNotifications(false);
  };

  // Handle click outside to close user dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={`d-flex align-items-center justify-content-center gap-5 position-relative`}>
          <Image src={LogoIcon} alt="Logo" width={100} height={36} className="ms-3 me-1" />

          <Button
            variant="link"
            className={`p-0 ${styles.humburgerIcon}`}
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="link"
            className={`p-0  ${styles.themeToggle}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Notification Bell */}
          <div className="position-relative">
            <Button
              ref={bellRef}
              variant="link"
              className={`p-0 ${styles.notificationButton}`}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCounts > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCounts > 99 ? "99+" : unreadCounts}
                </span>
              )}
            </Button>

            <Overlay
              target={bellRef.current}
              show={showNotifications}
              placement="bottom"
              rootClose
              onHide={() => setShowNotifications(false)}
            >
              <Popover id="notification-popover" className={styles.notificationPopover}>
                <Popover.Header as="h6">{t("notifications")}</Popover.Header>

                <Popover.Body className={styles.notificationList}>
                  <NotificationList
                    allNotifications={allNotifications}
                    readNotificationIds={readNotificationIds}
                    handleNotificationClick={handleNotificationClick}
                    isLoading={isLoading}
                    error={error}
                    isFetching={isFetchingNextPage}
                    hasMore={hasMore}
                    loadMoreRef={loadMoreRef}
                    tCommon={tCommon}
                  />
                </Popover.Body>
              </Popover>
            </Overlay>
          </div>

          {/* User Dropdown */}
          <Dropdown show={isDropdownOpen} onToggle={setIsDropdownOpen} ref={dropdownRef}>
            <Dropdown.Toggle
              variant="outline-secondary"
              id="user-dropdown"
              className={styles.userButton}
            >
              <User size={16} className="me-1" />
              <span className="fs-sm">{user?.name || "User"}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className={styles.dropdown}>
              <Dropdown.Header>
                <div className={styles.userInfo}>
                  <span className={styles.name}>{user?.name || "User"}</span>
                  <span className={styles.email}>{user?.email}</span>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => {
                  router.push("/profile");
                  setIsDropdownOpen(false);
                }}
              >
                <User size={16} className="me-1" /> {t("profile")}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <LogOut size={16} className="me-1" /> {t("logout")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;

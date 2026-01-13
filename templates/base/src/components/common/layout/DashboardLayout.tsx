"use client";

import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Header from "@/components/common/header/header";
import Sidebar from "@/components/common/sidebar/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Container fluid className="p-0">
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <Row className={"g-0" + (isSidebarCollapsed ? " sidebar-close" : "")}>
        {/* Sidebar */}
        <Col
          xs="auto"
          className={`sidebar-column mt-5 ${
            isSidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onCollapseChange={setIsSidebarCollapsed}
          />
        </Col>

        {/* Main content */}
        <Col className="main-content flex-column">
          <main className="flex-grow-1 p-4 h-100">{children}</main>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;

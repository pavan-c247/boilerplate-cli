"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import CommonCard from "@/components/common/card/CommonCard";
import CommonCardSkeleton from "@/components/common/card/CommonCardSkeleton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import { useCoursesQuery } from "@/hooks/lms";
import { useStandardPagination } from "@/hooks/usePagination";
import { Course } from "@/services/lms";

const LmsCourseListPage = () => {
  const t = useTranslations("lms");
  const { params: pagination } = useStandardPagination({ defaultPageSize: 10 });

  const { data, isLoading } = useCoursesQuery(
    pagination.page,
    pagination.pageSize,
    pagination.search
  );

  const courses = data?.courses || [];

  return (
    <CardWrapper title={t("coursesTitle") || "Courses"}>
      <Container>
        <Row>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Col key={`skeleton-${i}`} xs={12} sm={6} md={3} lg={3} className="p-3">
                  <CommonCardSkeleton />
                </Col>
              ))
            : courses.map((course: Course) => (
                <Col
                  key={course.id}
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  className="p-3"
                >
                  <CommonCard
                    items={{
                      id: course.id,
                      name: course.title,
                      description: course.description,
                      image: course.coverImage,
                      createdAt: course.createdAt,
                    }}
                    showActions={false}
                  />
                </Col>
              ))}
        </Row>
      </Container>
    </CardWrapper>
  );
};

export default LmsCourseListPage;

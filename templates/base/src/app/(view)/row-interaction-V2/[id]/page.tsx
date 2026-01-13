"use client";
import React from "react";
import { Alert, Container } from "react-bootstrap";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function UserDetailsPage({ params }: PageProps) {    
  const { id } = React.use(params);
  return (
    <Container fluid className="py-4">
      <Alert variant="info">
        <Alert.Heading>User Details Page</Alert.Heading>
        <p className="mb-1">
          You clicked on user with ID: <strong>{id}</strong>
        </p>
        <hr />
        <p className="mb-0 text-muted">
          This page is ready. Replace this alert with cards or tabs later.
        </p>
      </Alert>
    </Container>
  );
}

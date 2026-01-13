// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CommonCard from "@/components/common/card/CommonCard";
import { usersList } from "@/data/user";
import { AccordionNode, BasicRow, UserAccordionRecord } from "@/types/table";
import { UITableColumn } from "@/types/ui";
import { UserListItem } from "@/types/user";
import { formatDate } from "@/utils/formatDate";

import CommonModal from "../Modal";
import Status from "../Status";
import Table from "./index";

const meta: Meta<typeof Table<BasicRow>> = {
  title: "Common/Table",
  component: Table<BasicRow>,
  tags: ["autodocs"],
  argTypes: {
    bordered: { control: "boolean" },
    striped: { control: "boolean" },
    hover: { control: "boolean" },
    size: { control: "select", options: ["sm", "lg"] },
    variant: { control: "text" },
    stickyHeader: {
      control: "boolean",
      description: "Makes table header sticky while scrolling",
    },
    fixed: {
      control: "select",
      options: ["none", "left", "right"],
    },
    width: {
      control: "text",
      description: "Column width (number or CSS string)",
    },
    accordian: { control: "text" },
    cardListing: {
      control: "object",
      description: "Renders table as card listing",
      if: { arg: "variant", eq: "card" },
    },
    showActions: {
      control: "boolean",
      description: "Show edit / delete actions on cards",
      if: { arg: "variant", eq: "card" },
    },

    cardColumns: {
      control: "number",
      description: "Number of cards per row (grid columns)",
      if: { arg: "variant", eq: "card" },
    },

    cardImage: {
      control: "boolean",
      description: "Show image on card",
      if: { arg: "variant", eq: "card" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table<BasicRow>>;

const columns: UITableColumn<BasicRow>[] = [
  { key: "name", dataIndex: "name", title: "Name" },
  { key: "age", dataIndex: "age", title: "Age" },
  { key: "address", dataIndex: "address", title: "Address" },
];

const dataSource: BasicRow[] = [
  { id: 1, name: "John Doe", age: 32, address: "New York", email: "john@example.com" },
  { id: 2, name: "Jane Smith", age: 27, address: "Los Angeles", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", age: 45, address: "Chicago", email: "bob@example.com" },
];

export const Basic: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
  },
};

export const Bordered: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
    bordered: true,
  },
};

export const Striped: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
    striped: true,
  },
};

export const Hover: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
    hover: true,
  },
};

export const Small: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    columns,
    dataSource,
    rowKey: "name",
    size: "lg",
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: [
      { key: "name", dataIndex: "name", title: "Name" },
      { key: "age", dataIndex: "age", title: "Age" },
      {
        key: "address",
        dataIndex: "address",
        title: "Address",
        render: (text: string, record: BasicRow) => <span style={{ color: "blue" }}>{text}</span>,
      },
    ],
    dataSource,
    rowKey: "name",
    bordered: true,
    hover: true,
  },
};
export const StickyHeader: Story = {
  render: (args) => <Table {...args} />,
  args: {
    rowKey: "name",
    stickyHeader: true,
    bordered: true,
    hover: true,
    columns,
    dataSource: Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + (i % 10),
      address: `City ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
  },
};

export const FixedColumn: Story = {
  args: {
    rowKey: "email",
    bordered: true,

    columns: [
      {
        key: "name",
        title: "Name",
        dataIndex: "name",
        fixed: "left",
        width: 180,
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        fixed: "left",
        width: 240,
      },
      {
        key: "age",
        title: "Age",
        dataIndex: "age",
      },
      {
        key: "address",
        title: "Address",
        dataIndex: "address",
      },
      {
        key: "age1",
        title: "Age",
        dataIndex: "age",
      },
      {
        key: "address1",
        title: "Address",
        dataIndex: "address",
      },
      {
        key: "age2",
        title: "Age",
        dataIndex: "age",
      },
      {
        key: "address2",
        title: "Address",
        dataIndex: "address",
      },
      {
        key: "age3",
        title: "Age",
        dataIndex: "age",
      },
      {
        key: "address3",
        title: "Address",
        dataIndex: "address",
      },
      {
        key: "age4",
        title: "Age",
        dataIndex: "age",
      },
      {
        key: "address4",
        title: "Address",
        dataIndex: "address",
      },
    ],
    dataSource: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        age: 32,
        address: "New York",
      },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 27, address: "Los Angeles" },
    ],
  },
};

export const ColumnWidth: Story = {
  args: {
    rowKey: "name",
    columns: [
      { key: "name", dataIndex: "name", title: "Name", width: 200 },
      { key: "age", dataIndex: "age", title: "Age", width: 100 },
      { key: "address", dataIndex: "address", title: "Address", width: 300 },
    ],
    dataSource,
    bordered: true,
  },
};

const userAccordionTree = (): AccordionNode<UserAccordionRecord> => ({
  rowKey: "id",

  shouldRender: (record) => Array.isArray(record.children) && record.children.length > 0,

  columns: [
    { key: "email", title: "Email", dataIndex: "email" },
    {
      key: "createdAt",
      title: "createdAt",
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      key: "updatedAt",
      title: "updatedAt",
      dataIndex: "updatedAt",
      render: (date: string) => formatDate(date),
    },
    {
      key: "status",
      title: "status",
      dataIndex: "status",
      render: (status: number) => (
        <Status
          variant={status === 0 ? "active" : "inactive"}
          label={status === 0 ? "Active" : "Inactive"}
        />
      ),
    },
  ],

  children: {
    rowKey: "id",
    columns: [
      { key: "email", title: "Email", dataIndex: "email" },
      {
        key: "createdAt",
        title: "createdAt",
        dataIndex: "createdAt",
        render: (date: string) => formatDate(date),
      },
      {
        key: "updatedAt",
        title: "updatedAt",
        dataIndex: "updatedAt",
        render: (date: string) => formatDate(date),
      },
    ],
  },
});

export const AccordionTable: Story = {
  args: {
    rowKey: "id",
    columns: [
      { key: "name", dataIndex: "name", title: "Name", width: 200 },
      { key: "email", dataIndex: "email", title: "Email", width: 200 },
      { key: "address", dataIndex: "address", title: "Address", width: 300 },
    ],
    dataSource: usersList,
    accordion: userAccordionTree(),
    bordered: true,
  },
};

export const CardListing: Story = {
  args: {
    variant: "card",
    rowKey: "id",
    cardListing: {},
    cardColumns: 4,
    cardImage: true,
    showActions: true,
    dataSource: usersList,
  },

  render: () => (
    <Container>
      <Row>
        {usersList.map((user) => (
          <Col key={user.id} xs={12} sm={6} md={3} lg={4} className="p-3">
            <CommonCard
              items={user}
              showActions
              onEdit={() => alert("Edit clicked")}
              onDelete={() => alert("Delete clicked")}
            />
          </Col>
        ))}
      </Row>
    </Container>
  ),
};
export const ReorderColumn: Story = {
  render: (args) => {
    return <Table {...args} columns={columns} enableColumnReorder />;
  },
  args: {
    rowKey: "id",
    bordered: true,
    hover: true,
    columns: columns,
    dataSource: dataSource,
  },
};
export const RowInteraction: Story = {
  render: (args) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<UserListItem | null>(null);

    return (
      <>
        <Table
          {...args}
          rowActions={{
            onRowClick: (record) => {
              setSelectedRow(record);
              setShowModal(true);
            },
          }}
        />

        <CommonModal show={showModal} onClose={() => setShowModal(false)} title="User Details">
          {selectedRow && (
            <div className="p-2">
              <p>
                <strong>Name: &nbsp;</strong> {selectedRow.name}
              </p>
              <p>
                <strong>Email: &nbsp;</strong> {selectedRow.email}
              </p>
              <p>
                <strong>Status: &nbsp;</strong>
                <Status
                  variant={selectedRow.status === 0 ? "active" : "inactive"}
                  label={selectedRow.status === 0 ? "Active" : "Inactive"}
                />
              </p>
            </div>
          )}
        </CommonModal>
      </>
    );
  },
  args: {
    rowKey: "id",
    hover: true,
    bordered: true,
    columns: [
      { key: "name", title: "Name", dataIndex: "name" },
      { key: "email", title: "Email", dataIndex: "email" },
      {
        key: "status",
        title: "Status",
        dataIndex: "status",
        render: (status: number) => (
          <Status
            variant={status === 0 ? "active" : "inactive"}
            label={status === 0 ? "Active" : "Inactive"}
          />
        ),
      },
    ],
    dataSource: [
      { id: 1, name: "John Doe", email: "john@example.com", status: 0 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: 1 },
    ],
  },
};

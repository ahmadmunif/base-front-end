"use client";

import { ProTable, ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tooltip } from "antd";
import Link from "next/link";
import { useRef } from "react";
import { CreateUserInput as User } from "@/types/user";
import { DownOutlined, UpOutlined } from "@ant-design/icons";


export default function UserTable() {
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<User>[] = [
    { title: "Username", dataIndex: "username", fieldProps: {placeholder: "username"}    },
    { title: "Email", dataIndex: "email", fieldProps: {placeholder: "email"}  },
    { title: "Full Name", dataIndex: "fullName", fieldProps: {placeholder: "full name"},   },
    {
      title: "Active",
      dataIndex: "isActive",
      valueType: "select",
      valueEnum: {
        true: { text: "Active" },
        false: { text: "Inactive" },
      },
      fieldProps: {placeholder: "status"},
      formItemProps: {
        label: "Status",   // ✅ label di search form
      },
      
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      fieldProps: {placeholder: "created at"} 
    },
    {
      title: "Action",
      valueType: "option",
      render: (_, record) => (
        <Space>
          <Link href={`/users/${record.id}`}>Edit</Link>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<User>      
      search={{
        searchText: "Find",
        resetText: "Clear",
        labelWidth: "auto",
        collapseRender: (collapsed) => (
          <Tooltip title={collapsed ? "Show more filters" : "Hide filters"}>
            {collapsed ? <DownOutlined /> : <UpOutlined />}
          </Tooltip>
        ),       
      }}
      
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      request={async (params) => {
        // ✅ server-side paging
        const query = new URLSearchParams({
          page: String(params.current || 1),
          pageSize: String(params.pageSize || 10),
        });
        const res = await fetch(`/api/user-management/user?${query}`, { cache: "no-store" });
        const data = await res.json();
        return {
          data: data.items,
          success: true,
          total: data.total,
        };
      }}
      toolBarRender={() => [
        <Link key="create" href="/user-management/user/create">
          <Button type="primary">New User</Button>
        </Link>,
      ]}
      pagination={{ pageSize: 10, showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} users`, showSizeChanger: true,}}
      options={{
        density: false, // sembunyikan density default
        fullScreen: false,
        reload: false,  // sembunyikan tombol reload default
        setting: false, // sembunyikan setting default
      }}
    />
  );
}

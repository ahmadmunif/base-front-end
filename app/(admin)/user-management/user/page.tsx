'use client';

import { ProTable, ActionType, ProColumns, PageContainer } from "@ant-design/pro-components";
import { Button, Space, Tooltip, Card, Badge, Popconfirm, theme  } from "antd";
import Link from "next/link";
import { useRef, useContext } from "react";
import { CreateUserInput as User } from "@/types/user";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { LangContext } from "@/providers/LangProvider";

export default function UserPage() {
  const { texts } = useContext(LangContext);
  const { useToken } = theme;
  const { token } = useToken();
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
      render: (_, record) =>
        record.isActive ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="error" text="Inactive" />
        ),
      
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      fieldProps: {placeholder: "created at"} 
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      valueType: "date",
      fieldProps: {placeholder: "updated at"} 
    },
    {
      title: "Action",
      valueType: "option",      
      render: (_, record) => {
        return (
          <Space size="middle">
            <Tooltip title={texts.edit}>
              <Link href={`/user-management/user/${record.id}/edit`}>
                <EditOutlined style={{ color: token.colorPrimary }} />
              </Link>
            </Tooltip>

            <Tooltip title={texts.delete}>
              <Popconfirm
                title={texts.userManagement.user.deleteConfirm}
                onConfirm={() => {
                  console.log("Delete user", record.id);
                }}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined style={{ color: token.colorError }} />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer 
      header={{
            title: "Users",
            breadcrumb: {
            items: [                
                { title: <Link href="/user-management/user">User Management</Link> },
                { title: "Users" }, 
            ],
            },
        }}
    >
    <Card>
      <ProTable<User>      
        search={{
          searchText: texts.find,
          resetText: texts.clear,
          labelWidth: "auto",
          collapseRender: (collapsed) => (
            <Tooltip title={collapsed ? texts.showFilter : texts.hideFilter}>
              {collapsed ? <DownOutlined /> : <UpOutlined />}
            </Tooltip>
          ),       
        }}
        
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const query = new URLSearchParams({
            page: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
            username: params.username || "",
            email: params.email || "",
            fullName: params.fullName || "",
            isActive: params.isActive,
            createdAt: params.createdAt,
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
            <Button type="primary">{texts.userManagement.user.createNewUser}</Button>
          </Link>,
        ]}
        pagination={{ defaultPageSize: 10, showTotal: (total, range) => `${texts.showing} ${range[0]}–${range[1]} ${texts.of} ${total} users`, showSizeChanger: true,}}
        options={{
          density: false, // sembunyikan density default
          fullScreen: false,
          reload: false,  // sembunyikan tombol reload default
          setting: false, // sembunyikan setting default
        }}
      />
    </Card>
    </PageContainer>
  );
}
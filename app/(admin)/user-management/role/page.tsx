'use client';

import { ProTable, ActionType, ProColumns, PageContainer } from "@ant-design/pro-components";
import { Button, Space, Tooltip, Card, Popconfirm, theme, message } from "antd";
import Link from "next/link";
import { useRef, useContext } from "react";
import { CreateRoleInput as Role } from "@/types/role";
import { DownOutlined, UpOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { LangContext } from "@/providers/LangProvider";

export default function RolePage() {
  const { texts } = useContext(LangContext);
  const { useToken } = theme;
  const { token } = useToken();
  const actionRef = useRef<ActionType>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user-management/role/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete role");
      }

      message.success(texts.userManagement.role.deleteSuccess || "Role deleted");
      actionRef.current?.reload();
    } catch (err) {
      console.error(err);
      message.error(texts.userManagement.role.deleteFail || "Failed to delete role");
    }
  };

  const columns: ProColumns<Role>[] = [
    {
      title: "Name",
      dataIndex: "name",
      fieldProps: { placeholder: "role name" },
    },
    {
      title: "Description",
      dataIndex: "description",
      fieldProps: { placeholder: "description" },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      fieldProps: { placeholder: "created at" },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      valueType: "date",
      fieldProps: { placeholder: "updated at" },
    },
    {
      title: "Action",
      valueType: "option",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Tooltip title={texts.edit}>
              <Link href={`/user-management/role/${record.id}/edit`}>
                <EditOutlined style={{ color: token.colorPrimary }} />
              </Link>
            </Tooltip>
            <Tooltip title={texts.delete}>
              <Popconfirm
                title={texts.userManagement.role.deleteConfirm}
                onConfirm={() => record.id && handleDelete(record.id)}
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
        title: "Roles",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/role">User Management</Link> },
            { title: "Roles" },
          ],
        },
      }}
    >
      <Card>
        <ProTable<Role>
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
              name: params.name || "",
              description: params.description || "",
              createdAt: params.createdAt,
              updatedAt: params.updatedAt,
            });
            const res = await fetch(`/api/user-management/role?${query}`, { cache: "no-store" });
            const data = await res.json();
            return {
              data: data.items,
              success: true,
              total: data.total,
            };
          }}
          toolBarRender={() => [
            <Link key="create" href="/user-management/role/create">
              <Button type="primary">{texts.userManagement.role.createNewRole}</Button>
            </Link>,
          ]}
          pagination={{
            defaultPageSize: 10,
            showTotal: (total, range) =>
              `${texts.showing} ${range[0]}–${range[1]} ${texts.of} ${total} roles`,
            showSizeChanger: true,
          }}
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
        />
      </Card>
    </PageContainer>
  );
}
'use client';

import { ProTable, ActionType, ProColumns, PageContainer } from "@ant-design/pro-components";
import { Button, Space, Tooltip, Card, Badge, Popconfirm, theme, message } from "antd";
import Link from "next/link";
import { useRef, useContext } from "react";
import { UpdateMenuInput as Menu } from "@/types/menu";
import { DownOutlined, UpOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { LangContext } from "@/providers/LangProvider";

export default function MenuPage() {
  const { texts } = useContext(LangContext);
  const { useToken } = theme;
  const { token } = useToken();
  const actionRef = useRef<ActionType>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user-management/menu/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete menu");
      }

      message.success(texts.userManagement.menu.deleteSuccess || "Menu deleted");
      actionRef.current?.reload();
    } catch (err) {
      console.error(err);
      message.error(texts.userManagement.menu.deleteFail || "Failed to delete menu");
    }
  };

  const columns: ProColumns<Menu>[] = [
    { title: "Name", dataIndex: "name", fieldProps: { placeholder: "menu name" } },
    { title: "Path", dataIndex: "path", fieldProps: { placeholder: "path" } },
    { title: "Icon", dataIndex: "icon", fieldProps: { placeholder: "icon" } },
    {
      title: "Order",
      dataIndex: "sortOrder",
      valueType: "digit",
      fieldProps: { placeholder: "order" },
    },
    {
      title: "Parent",
      dataIndex: ["parent", "name"],
      search: false,
      render: (_, record) => (record.parent as any)?.name ?? "-"
    },
    {
      title: "Active",
      dataIndex: "isActive",
      valueType: "select",
      valueEnum: {
        true: { text: "Active" },
        false: { text: "Inactive" },
      },
      fieldProps: { placeholder: "status" },
      formItemProps: { label: "Status" },
      render: (_, record) =>
        record.isActive ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="error" text="Inactive" />
        ),
    },
    {
      title: "Action",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={texts.edit}>
            <Link href={`/user-management/menu/${record.id}/edit`}>
              <EditOutlined style={{ color: token.colorPrimary }} />
            </Link>
          </Tooltip>
          <Tooltip title={texts.delete}>
            <Popconfirm
              title={texts.userManagement.menu.deleteConfirm}
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: token.colorError }} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: "Menus",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/menu">User Management</Link> },
            { title: "Menus" },
          ],
        },
      }}
    >
      <Card>
        <ProTable<Menu>
          
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
              path: params.path || "",
              icon: params.icon || "",
              sortOrder: params.sortOrder || "",
              isActive: params.isActive,
            });
            const res = await fetch(`/api/user-management/menu?${query}`, { cache: "no-store" });
            const data = await res.json();
            return {
              data: data.items,
              success: true,
              total: data.total,
            };
          }}
          toolBarRender={() => [
            <Link key="create" href="/user-management/menu/create">
              <Button type="primary">{texts.userManagement.menu.createNewMenu}</Button>
            </Link>,
          ]}
          expandable={{
            expandIcon: () => null,   // 👈 matikan icon "+"
          }}
          pagination={{
            defaultPageSize: 10,
            showTotal: (total, range) =>
              `${texts.showing} ${range[0]}–${range[1]} ${texts.of} ${total} menus`,
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
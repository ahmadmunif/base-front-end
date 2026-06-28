'use client';

import { Card, message, TreeSelect, Spin } from "antd";
import Link from "next/link";
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { LangContext } from "@/providers/LangProvider";
import { CreateRoleInput } from "@/types/role";

export default function EditRolePage() {
  const { texts } = useContext(LangContext);
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id as string;

  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<any>(null);

  // 🔹 Fetch menus
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/user-management/menu?all=true");
        if (!res.ok) throw new Error("Failed to fetch menus");
        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : data
          ? [data]
          : [];

        const roots = normalized.filter((m: any) => !m.parent);

        setMenus(roots);
      } catch (err) {
        message.error(texts.userManagement.menu.fail);
      }
    }
    fetchMenus();
  }, [texts]);

  // 🔹 Fetch role by id
  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch(`/api/user-management/role/${roleId}`);
        if (!res.ok) throw new Error("Failed to fetch role");
        const data = await res.json();

        // pastikan menus diisi array id saja
        const normalizedRole = {
          ...data,
          menus: data.menus?.map((m: any) => m.id) || [],
        };

        setRole(normalizedRole);
      } catch (err) {
        message.error(texts.userManagement.role.fail);
      } finally {
        setLoading(false);
      }
    }
    if (roleId) fetchRole();
  }, [roleId, texts]);

  // 🔹 Recursive + sort
  const buildTreeData = (list: any[]): any[] =>
    list
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((menu) => ({
        title: menu.name,
        value: menu.id,
        key: menu.id,
        children:
          menu.children && menu.children.length > 0
            ? buildTreeData(menu.children)
            : [],
      }));

  // 🔹 Handle form submit
  const handleSubmit = async (values: CreateRoleInput) => {
    try {
      const res = await fetch(`/api/user-management/role/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || texts.userManagement.role.editFail);
      }

      message.success(texts.userManagement.role.editSuccess);
      router.push("/user-management/role");
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <PageContainer
      header={{
        title: texts.userManagement.role.title,
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/role">User Management</Link> },
            { title: <Link href="/user-management/role">Roles</Link> },
            { title: "Edit" },
          ],
        },
      }}
    >
      <Card>
        {loading ? (
          <Spin />
        ) : (
          <ProForm
            initialValues={role}
            onFinish={handleSubmit}
            submitter={{
              searchConfig: {
                submitText: texts.userManagement.role.saveButton,
                resetText: texts.userManagement.role.resetButton,
              },
            }}
          >
            {/* 🔹 Role name */}
            <ProForm.Group>
              <ProFormText
                name="name"
                label={texts.userManagement.role.form.name.label}
                tooltip={texts.userManagement.role.form.name.tooltip}
                placeholder={texts.userManagement.role.form.name.placeholder}
                rules={[
                  {
                    required: true,
                    message: texts.userManagement.role.form.name.required,
                  },
                ]}
                normalize={(value) => (value ? value.toUpperCase() : "")}
              />
            </ProForm.Group>

            {/* 🔹 Description */}
            <ProForm.Group>
              <ProFormTextArea
                name="description"
                width="lg"
                label={texts.userManagement.role.form.description.label}
                placeholder={
                  texts.userManagement.role.form.description.placeholder
                }
                rules={[
                  {
                    required: false,
                    max: 500,
                    message:
                      texts.userManagement.role.form.description.maxLength,
                  },
                ]}
              />
            </ProForm.Group>

            {/* 🔹 Menus */}
            <ProForm.Item
              name="menus"
              label={texts.userManagement.role.form.menu.label}
              rules={[
                { required: true, message: texts.userManagement.role.form.menu.required },
              ]}
            >
              <TreeSelect
                treeData={buildTreeData(menus)}
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                placeholder={texts.userManagement.role.form.menu.placeholder}
                style={{ width: "100%" }}
                treeDefaultExpandAll
              />
            </ProForm.Item>
          </ProForm>
        )}
      </Card>
    </PageContainer>
  );
}

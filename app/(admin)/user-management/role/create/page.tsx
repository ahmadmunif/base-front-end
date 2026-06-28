'use client';

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Card, message, TreeSelect, Spin } from "antd";
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";

import { LangContext } from "@/providers/LangProvider";
import { CreateRoleInput } from "@/types/role";

export default function CreateRolePage() {
  const { texts } = useContext(LangContext);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch menus from API
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/user-management/menu?all=true");
        if (!res.ok) throw new Error("Failed to fetch menus");

        const data = await res.json();

        // Normalisasi response
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : data
          ? [data]
          : [];

        // Ambil hanya root (tanpa parent)
        const roots = normalized.filter((m: any) => !m.parent);
        setMenus(roots);
      } catch (err) {
        message.error("Failed to load menus");
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();
  }, []);

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
      const res = await fetch("/api/user-management/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || texts.userManagement.role.fail);
      }

      message.success(texts.userManagement.role.success);
      window.location.href = "/user-management/role";
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <PageContainer
      header={{
        title: "Create New Role",
        breadcrumb: {
          items: [
            {
              title: (
                <Link href="/user-management/role">Role Management</Link>
              ),
            },
            { title: <Link href="/user-management/role">Roles</Link> },
            { title: "Create" },
          ],
        },
      }}
    >
      <Card>
        {loading ? (
          <Spin />
        ) : (
          <ProForm
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
              label="Menus"
              rules={[
                {
                  required: true,
                  message: "Please select at least one menu",
                },
              ]}
            >
              <TreeSelect
                treeData={buildTreeData(menus)}
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                placeholder="Select menus"
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
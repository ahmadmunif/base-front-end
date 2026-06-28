'use client';

import { Card, message } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
} from "@ant-design/pro-components";

import { LangContext } from "@/providers/LangProvider";
import { CreateMenuInput } from "@/types/menu";

export default function CreateMenuPage() {
  const { texts } = useContext(LangContext);
  const [menus, setMenus] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Fetch semua menu untuk parent option
    const fetchMenus = async () => {
      const res = await fetch("/api/user-management/menu?all=true");
      if (!res.ok) return;
      const data = await res.json();
      setMenus(
        data.map((menu: any) => ({
          label: menu.name,
          value: menu.id,
        }))
      );
    };
    fetchMenus();
  }, []);

  const handleSubmit = async (values: CreateMenuInput) => {
    const payload = {
        ...values,
        parent: values.parent || null, // kalau undefined → null
    };
    
    try {
      const res = await fetch("/api/user-management/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || texts.userManagement.menu.fail);
      }

      message.success(texts.userManagement.menu.success);
      window.location.href = "/user-management/menu";
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <PageContainer
      header={{
        title: "Create New Menu",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/menu">User Management</Link> },
            { title: <Link href="/user-management/menu">Menus</Link> },
            { title: "Create" },
          ],
        },
      }}
    >
      <Card>
        <ProForm<CreateMenuInput>
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: texts.userManagement.menu.saveButton,
              resetText: texts.userManagement.menu.resetButton,
            },
          }}
        >
          <ProForm.Group>
            <ProFormText
              name="name"
              width="md"
              label={texts.userManagement.menu.form.name.label}
              placeholder={texts.userManagement.menu.form.name.placeholder}
              rules={[{ required: true, message: texts.userManagement.menu.form.name.required }]}
            />

            <ProFormText
              name="path"
              width="lg"
              label={texts.userManagement.menu.form.path.label}
              placeholder={texts.userManagement.menu.form.path.placeholder}
              rules={[{ required: true, message: texts.userManagement.menu.form.path.required }]}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormText
              name="icon"
              width="md"
              label={texts.userManagement.menu.form.icon.label}
              placeholder={texts.userManagement.menu.form.icon.placeholder}
            />

            <ProFormDigit
              name="sortOrder"
              label={texts.userManagement.menu.form.sortOrder.label}
              placeholder={texts.userManagement.menu.form.sortOrder.placeholder}
              min={0}
              initialValue={0}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormSelect
              name="parent"
              label={texts.userManagement.menu.form.parent.label}
              options={menus}
              placeholder={texts.userManagement.menu.form.parent.placeholder}
              allowClear
            />

            <ProFormSwitch
              name="isActive"
              label={texts.userManagement.menu.form.isActive.label}
              initialValue={true}
            />
          </ProForm.Group>
        </ProForm>
      </Card>
    </PageContainer>
  );
}

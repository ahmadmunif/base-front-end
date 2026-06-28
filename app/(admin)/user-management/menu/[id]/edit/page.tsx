'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageContainer, ProForm, ProFormText, ProFormDigit, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
import { Card, message, Spin } from 'antd';
import Link from "next/link";
import { LangContext } from "@/providers/LangProvider";

import type { UpdateMenuInput } from "@/types/menu";

interface MenuOption {
  id: string;
  name: string;
}

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<UpdateMenuInput | null>(null);
  const [menus, setMenus] = useState<MenuOption[]>([]);

  const { texts } = useContext(LangContext);

  // fetch data menu yang mau diedit
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/user-management/menu/${menuId}`);
        const data = await res.json();

        // 🔑 transformasi parent object → id
        setMenu({
          ...data,
          parent: data.parent?.id ?? null,
        });
      } catch (err) {
        message.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    }
    if (menuId) fetchMenu();
  }, [menuId]);

  // fetch daftar menu untuk parent
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/user-management/menu?all=true");
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        message.error("Failed to load menu list");
      }
    }
    fetchMenus();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      // parent id tetap dikirim (bukan object)
      const res = await fetch(`/api/user-management/menu/${menuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(texts.userManagement.menu.editSuccess);
        router.push("/user-management/menu");
      } else {
        message.error(texts.userManagement.menu.editFail);
      }
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  return (
    <PageContainer
      header={{
        title: "Edit Menu",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/menu">User Management</Link> },
            { title: <Link href="/user-management/menu">Menus</Link> },
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
            initialValues={menu || {}}
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
                width="md"
                name="name"
                label={texts.userManagement.menu.form.name.label}
                placeholder={texts.userManagement.menu.form.name.placeholder}
                rules={[{ required: true, message: texts.userManagement.menu.form.name.required }]}
              />
              <ProFormText
                width="lg"
                name="path"
                label={texts.userManagement.menu.form.path.label}
                placeholder={texts.userManagement.menu.form.path.placeholder}
                rules={[{ required: true, message: texts.userManagement.menu.form.path.required }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                width="md"
                name="icon"
                label={texts.userManagement.menu.form.icon.label}
                placeholder={texts.userManagement.menu.form.icon.placeholder}
              />
              <ProFormDigit
                width="sm"
                name="sortOrder"
                label={texts.userManagement.menu.form.sortOrder.label}
                placeholder="0"
                min={0}
              />
            </ProForm.Group>

            <ProForm.Group>
              <ProFormSelect
                name="parent"
                label={texts.userManagement.menu.form.parent.label}
                placeholder={texts.userManagement.menu.form.parent.placeholder}
                allowClear
                options={menus
                  .filter((m) => m.id !== menuId) // jangan pilih dirinya sendiri
                  .map((m) => ({ label: m.name, value: m.id }))}
              />
              <ProFormSwitch
                name="isActive"
                label={texts.userManagement.menu.form.isActive.label}
              />
            </ProForm.Group>
          </ProForm>
        )}
      </Card>
    </PageContainer>
  );
}

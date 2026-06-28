'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Card, message, Spin, Transfer } from 'antd';
import Link from "next/link";
import type { TransferProps } from 'antd';
import { LangContext } from "@/providers/LangProvider";

interface Role {
  id: string;
  name: string;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const { texts } = useContext(LangContext);

  // fetch data user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user-management/user/${userId}`);
        const data = await res.json();
        const transformedUser = {
          ...data,
          roles: data.roles ? data.roles.map((r: any) => r.id) : [],
        };
        setUser(transformedUser);
        setTargetKeys(transformedUser.roles); // isi Transfer target
      } catch (err) {
        message.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  // fetch daftar role
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/user-management/role?all=true");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        message.error('Failed to load roles');
      }
    }
    fetchRoles();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const payload = { ...values, roles: targetKeys }; // kirim role dari Transfer
      const res = await fetch(`/api/user-management/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success(texts.userManagement.user.editSuccess);
        router.push('/user-management/user');
      } else {
        message.error(texts.userManagement.user.editFail);
      }
    } catch (err) {
      message.error('Something went wrong');
    }
  };

  return (
    <PageContainer
      header={{
        title: "Edit User",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/user">User Management</Link> },
            { title: <Link href="/user-management/user">Users</Link> },
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
            initialValues={user}
            onFinish={handleSubmit}
            submitter={{
              searchConfig: {
                submitText: texts.userManagement.user.saveButton,
                resetText: texts.userManagement.user.resetButton,
              },
            }}
          >
            <ProForm.Group>
              <ProFormText
                name="username"
                disabled
                label={texts.userManagement.user.form.username.label}
                tooltip={texts.userManagement.user.form.username.tooltip}
                placeholder={texts.userManagement.user.form.username.placeholder}
                rules={[{ required: true, message: texts.userManagement.user.form.username.required }]}
              />
              <ProFormText
                width="md"
                name="fullName"
                label={texts.userManagement.user.form.fullname.label}
                placeholder={texts.userManagement.user.form.fullname.placeholder}
                rules={[{ required: true, message: texts.userManagement.user.form.fullname.required }]}
              />
              <ProFormText
                width="md"
                name="email"
                label={texts.userManagement.user.form.email.label}
                tooltip={texts.userManagement.user.form.email.tooltip}
                placeholder={texts.userManagement.user.form.email.placeholder}
                rules={[{ required: true, type: 'email', message: texts.userManagement.user.form.email.required }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                name="isActive"
                label={texts.userManagement.user.form.status.label}
                initialValue={true}
                placeholder={texts.userManagement.user.form.status.placeholder}
                rules={[{ required: true, message: texts.userManagement.user.form.status.required }]}
                options={[
                  { label: 'Active', value: true },
                  { label: 'Inactive', value: false },
                ]}
              />
            </ProForm.Group>

            <ProForm.Group>
              <ProForm.Item
                label={texts.userManagement.user.form.roles.label}
                name="roles"
                rules={[{ required: true, message: texts.userManagement.user.form.roles.required }]}
              >
              <Transfer
                dataSource={roles.map((r) => ({ key: String(r.id), title: r.name }))}
                targetKeys={targetKeys}
                onChange={(nextKeys) => setTargetKeys(nextKeys as string[])}
                render={(item) => item.title}
                listStyle={{ width: 250, height: 200 }}
                titles={["Available Role", "Selected Role"]}
              />
              </ProForm.Item>
            </ProForm.Group>
          </ProForm>
        )}
      </Card>
    </PageContainer>
  );
}

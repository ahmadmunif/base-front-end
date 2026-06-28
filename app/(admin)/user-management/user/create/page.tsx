'use client';

import { Button, Space, Tooltip, Card, message, Transfer } from "antd";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { PageContainer, ProForm, ProFormText } from "@ant-design/pro-components";
import type { Key } from "react";

import { LangContext } from "@/providers/LangProvider";
import { CreateUserInput } from "@/types/user";

export default function CreateUserPage() {
  const { texts } = useContext(LangContext);
  const [rolesData, setRolesData] = useState<{ key: string; title: string }[]>([]);
  const [targetKeys, setTargetKeys] = useState<Key[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetch("/api/user-management/role?all=true");
      if (!res.ok) return;
      const data = await res.json();
      setRolesData(
        data.map((role: any) => ({
          key: role.id, // Transfer butuh key string/number
          title: role.name,
        }))
      );
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (values: CreateUserInput) => {
    try {
      const res = await fetch("/api/user-management/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          roles: targetKeys, // kirim array id role
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || texts.userManagement.user.fail);
      }

      message.success(texts.userManagement.user.success);
      window.location.href = "/user-management/user";
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <PageContainer
      header={{
        title: "Create New User",
        breadcrumb: {
          items: [
            { title: <Link href="/user-management/user">User Management</Link> },
            { title: <Link href="/user-management/user">Users</Link> },
            { title: "Create" },
          ],
        },
      }}
    >
      <Card>
        <ProForm
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
              rules={[{ required: true, type: "email", message: texts.userManagement.user.form.email.required }]}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormText.Password
              name="password"
              label={texts.userManagement.user.form.password.label}
              placeholder={texts.userManagement.user.form.password.placeholder}
              fieldProps={{ autoComplete: "new-password" }}
              rules={[
                { required: true, message: texts.userManagement.user.form.password.required },
                { min: 6, message: texts.userManagement.user.form.password.minLength },
              ]}
            />

            <ProFormText.Password
              name="confirmPassword"
              label={texts.userManagement.user.form.confirmPassword.label}
              placeholder={texts.userManagement.user.form.confirmPassword.placeholder}
              dependencies={["password"]}
              fieldProps={{ autoComplete: "new-password" }}
              rules={[
                { required: true, message: texts.userManagement.user.form.confirmPassword.required },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(texts.userManagement.user.form.confirmPassword.mismatch)
                    );
                  },
                }),
              ]}
            />
          </ProForm.Group>

          {/* Roles pakai Transfer */}
          <ProForm.Item
            label={texts.userManagement.user.form.roles.label}
            name="roles"
            rules={[{ required: true, message: texts.userManagement.user.form.roles.required }]}
          >
            <Transfer
              dataSource={rolesData}
              targetKeys={targetKeys}
              onChange={(nextKeys) => setTargetKeys(nextKeys)} // ✅ Key[]
              render={(item) => item.title}
              listStyle={{ width: 250, height: 200 }}
              titles={["Available Role", "Selected Role"]}
            />
          </ProForm.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
}

'use client';

import React, { useContext } from "react";
import { Card, message } from 'antd';
import {  } from '@ant-design/icons';
import {  
  ProForm,  
  ProFormSelect,
  ProFormText,  
} from '@ant-design/pro-components';

import { LangContext } from "@/providers/LangProvider";
import { CreateUserInput } from "@/types/user"


const UserForm = () => {
  const { texts } = useContext(LangContext);

  const handleSubmit = async (values: CreateUserInput) => {
        try {
          const res = await fetch("/api/user-management/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
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
            name="full_name"
            label={texts.userManagement.user.form.fullname.label}
            placeholder={texts.userManagement.user.form.fullname.placeholder}
            rules={[{ required: true, message: texts.userManagement.user.form.fullname.required }]}
          />
          <ProFormText
            width="md"
            name="email"
            label={texts.userManagement.user.form.email.label}
            placeholder={texts.userManagement.user.form.email.placeholder}
            rules={[{ required: true, type: 'email', message: texts.userManagement.user.form.email.required }]}
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

          {/* Retype Password */}
          <ProFormText.Password
            name="confirmPassword"
            label={texts.userManagement.user.form.confirmPassword.label}
            placeholder={texts.userManagement.user.form.confirmPassword.placeholder}
            dependencies={['password']} // akan validasi ulang kalau password berubah
            fieldProps={{ autoComplete: "new-password" }}
            rules={[
              { required: true, message: texts.userManagement.user.form.confirmPassword.required },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
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
        <ProForm.Group>
          <ProFormSelect
            name="status"
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
      </ProForm>
    </Card>
  )

};

export default UserForm;
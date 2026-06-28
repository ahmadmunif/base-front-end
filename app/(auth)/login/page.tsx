"use client";

import { LoginForm, ProFormText, ProCard } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { theme, message, Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import { ConfigProvider } from "antd";

import { locales, LocaleKey } from "@/locales";


export default function LoginPage() {
  const router = useRouter();
  const { token } = theme.useToken();
  const [locale, setLocale] = useState<any>(enUS);
  const [currentLang, setCurrentLang] = useState<LocaleKey>("en");
  const texts = locales[currentLang];

  const switchLanguage = (lang: "en" | "id") => {
    setLocale(lang === "en" ? enUS : idID);
    setCurrentLang(lang);

    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "id" | null;
    if (savedLang) {
      setLocale(savedLang === "en" ? enUS : idID);
      setCurrentLang(savedLang);
    } else {
      localStorage.setItem("lang", "en");
      setLocale(enUS);
      setCurrentLang("en");
    }
  }, []);

   const handleLogin = async (values: { username: string; password: string }) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || texts.login.fail);
        }

        message.success(texts.login.success);
        window.location.href = "/dashboard";
      } catch (err: any) {
        message.error(err.message);
      }
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: token.colorBgLayout,
        // backgroundImage: "url('/images/background-image.png')", 
        // backgroundSize: "cover",
        // backgroundPosition: "left top",
        padding: 16,
      }}
    >
      {/* Tombol di kanan atas */}
      {/* <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: token.colorPrimary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onClick={() => switchLanguage(currentLang === "en" ? "id" : "en")}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#2a466f")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = token.colorPrimary)
        }
      >
        <Tooltip title={texts.switchLanguage} placement="left">
          <GlobalOutlined style={{ color: "#fff", fontSize: 16 }} />
        </Tooltip>
      </div> */}

      <ConfigProvider locale={locale}>
      <ProCard
        style={{
          width: 420,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 0, // hilangkan padding bawaan
        }}
        bordered
        headerBordered
      >
        <LoginForm
          title={texts.login.title}
          subTitle={texts.login.subTitle}
          logo="/images/telkom.png"
          onFinish={handleLogin}
          contentStyle={{
            marginBlockEnd: 0,
            minWidth: "100%",
          }}
          submitter={{
            searchConfig: { submitText: texts.login.button },
            submitButtonProps: {
              size: "large",
              style: {
                width: "100%",
                borderRadius: 6,
                backgroundColor: token.colorPrimary,
              },
            },
          }}
          style={{ boxShadow: "none" }}
          // actions={
          //   <Button
          //     type="link"
          //     icon={<GlobalOutlined />}
          //     onClick={() => switchLanguage(currentLang === "en" ? "id" : "en")}
          //   >
          //     {currentLang === "en" ? "ID" : "EN"}
          //   </Button>
          // }
          
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined />,
            }}
            placeholder={texts.login.form.username.placeholder}
            rules={[{ required: true, message: texts.login.form.username.required }]}
          />

          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined />,
            }}
            placeholder={texts.login.form.password.placeholder}
            rules={[{ required: true, message: texts.login.form.password.required }]}
          />
        </LoginForm>
      </ProCard>
      </ConfigProvider>
    </div>
  );
}

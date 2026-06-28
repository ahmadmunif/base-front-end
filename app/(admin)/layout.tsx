"use client";

import React, { useEffect, useState } from "react";
import { ProLayout, DefaultFooter } from "@ant-design/pro-components";
import { LogoutOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { Dropdown, Button, Tooltip, ConfigProvider, Spin } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import { locales, LocaleKey } from "@/locales";
import { LangContext } from "@/providers/LangProvider";
import { resolveIcons } from "@/lib/iconResolver";
import type { SafeRoute } from "@/lib/menuTree";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<{ menuRoutes: SafeRoute[]; name: string } | null>(null);
  const [locale, setLocale] = useState(enUS);
  const [currentLang, setCurrentLang] = useState<LocaleKey>("en");

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("lang") as "en" | "id" | null;
    if (savedLang) {
      setLocale(savedLang === "en" ? enUS : idID);
      setCurrentLang(savedLang);
    }

    fetch("/api/session")
      .then(res => res.json())
      .then(data => setUserData(data.userData || null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const switchLanguage = (lang: "en" | "id") => {
    setLocale(lang === "en" ? enUS : idID);
    setCurrentLang(lang);
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  if (!mounted || !userData) return <Spin />;

  const routes = resolveIcons(userData.menuRoutes || []);

  return (
    <ConfigProvider locale={locale}>
      <ProLayout
        title="telkomsigma"
        logo="/images/telkom.png"
        layout="mix"
        route={{ path: "/", routes }}
        location={{ pathname: pathname || "/dashboard" }}
        menuItemRender={(item, dom) => (item.path ? <Link href={item.path}>{dom}</Link> : dom)}
        onMenuHeaderClick={() => router.push("/")}
        footerRender={() => <DefaultFooter copyright="telkomsigma 2025" />}
        actionsRender={() => [
              <Tooltip
                key="lang"
                title={locales[currentLang].switchLanguage}
                placement="left"
              >
                <Dropdown
                  menu={{
                    items: [
                      { key: "en", label: "English", onClick: () => switchLanguage("en") },
                      { key: "id", label: "Indonesia", onClick: () => switchLanguage("id") },
                    ],
                  }}
                  placement="bottomRight"
                  trigger={["click"]} // dropdown tetap click
                >
                  <Button type="text" shape="circle" icon={<GlobalOutlined />} size="small" />
                </Dropdown>
              </Tooltip>,

              <Tooltip
                key="user"
                title={`${locales[currentLang].hello}, ${userData.name}!`}
                placement="left"
              >
                <Dropdown
                  menu={{
                    items: [
                      { key: "logout", label: locales[currentLang].logout, icon: <LogoutOutlined />, onClick: handleLogout },
                    ],
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button type="text" shape="default" icon={<UserOutlined />} size="small" />
                </Dropdown>
              </Tooltip>,
            ]}
      >
        <LangContext.Provider value={{ texts: locales[currentLang], currentLang, switchLanguage }}>
          {children}
        </LangContext.Provider>
      </ProLayout>
    </ConfigProvider>
  );
}
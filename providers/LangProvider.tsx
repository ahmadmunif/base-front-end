"use client";

import React, { useState, useEffect, createContext } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import { locales, LocaleKey } from "@/locales";

export const LangContext = createContext<{
  currentLang: LocaleKey;
  texts: typeof locales["en"];
  switchLanguage: (lang: LocaleKey) => void;
}>({
  currentLang: "en",
  texts: locales["en"],
  switchLanguage: () => {},
});

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<any>(enUS);
  const [currentLang, setCurrentLang] = useState<LocaleKey>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as LocaleKey | null;
    if (savedLang) {
      setCurrentLang(savedLang);
      setLocale(savedLang === "en" ? enUS : idID);
    }
  }, []);

  const switchLanguage = (lang: LocaleKey) => {
    setLocale(lang === "en" ? enUS : idID);
    setCurrentLang(lang);
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <ConfigProvider locale={locale}>
      <LangContext.Provider value={{ currentLang, texts: locales[currentLang], switchLanguage }}>
        {children}
      </LangContext.Provider>
    </ConfigProvider>
  );
}
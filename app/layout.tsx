"use client";

import { ConfigProvider,  theme as antdTheme } from "antd";
import { ProConfigProvider } from "@ant-design/pro-components";
import { SWRConfig } from "swr";
import React, { useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import '@ant-design/v5-patch-for-react-19';
import { theme } from "@/lib/theme";
import "antd/dist/reset.css"; 
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",   
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {    
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body 
      style={{
          margin: 0,
          padding: 0,
          fontFamily: "var(--font-poppins), var(--font-inter), sans-serif",
          // fontSize: 14,
        }}
        >
        <AntdRegistry>
        <SWRConfig value={{ provider: () => new Map() }}>
          <ProConfigProvider hashed={false} >
            <ConfigProvider theme={theme}>
              {children}
            </ConfigProvider>
          </ProConfigProvider>
        </SWRConfig>
        </AntdRegistry>
      </body>
    </html>
  );
}
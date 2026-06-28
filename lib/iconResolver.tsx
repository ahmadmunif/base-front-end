
"use client";
import * as AntdIcons from "@ant-design/icons";
import React from "react";
import { SafeRoute } from "./menuTree";

export type AntdRoute = {
  path: string;
  name: string;
  icon?: React.ReactNode;
  children?: AntdRoute[];
};

export function resolveIcons(routes: SafeRoute[]): AntdRoute[] {
  return routes.map((r) => {
    const IconComp = r.icon ? (AntdIcons as any)[r.icon] : null;
    return {
      ...r,
      icon: IconComp ? React.createElement(IconComp) : undefined,
      children: r.children ? resolveIcons(r.children) : undefined,
    };
  });
}

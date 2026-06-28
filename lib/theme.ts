import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    fontFamily: "var(--font-poppins), var(--font-inter),  sans-serif",
    // fontSize: 14,
    // colorPrimary: "#19335f",     // warna utama
    colorPrimary: "#E72F29",
    borderRadius: 8,             // radius default
    // colorBgLayout: "#f5f7fa",    // background layout
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

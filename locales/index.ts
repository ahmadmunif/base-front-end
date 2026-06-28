import en from "./en";
import id from "./id";

export const locales = {
  en,
  id,
};

export type LocaleKey = keyof typeof locales;

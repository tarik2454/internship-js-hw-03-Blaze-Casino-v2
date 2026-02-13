"use client";

import { useEffect } from "react";
import { useLocale } from "@/providers/LocaleProvider";

export function HtmlLangSync(): null {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

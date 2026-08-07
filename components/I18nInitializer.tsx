"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store/useStore";
import "@/lib/i18n";

export default function I18nInitializer() {
  const { i18n } = useTranslation();
  const currentLanguage = useStore((state) => state.currentLanguage);

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  return null;
}

"use client";

import { useEffect } from "react";

const ROUND_SCROLL_STORAGE_KEY = "ocz:rounds-scroll-top";

export function markRoundScrollToTop() {
  sessionStorage.setItem(ROUND_SCROLL_STORAGE_KEY, "true");
}

export function RoundScrollRestorer() {
  useEffect(() => {
    if (sessionStorage.getItem(ROUND_SCROLL_STORAGE_KEY) !== "true") {
      return;
    }

    sessionStorage.removeItem(ROUND_SCROLL_STORAGE_KEY);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  return null;
}

"use client";

import { useCallback } from "react";

/** Mobil sidebar (sol menü) çekmecesini açıp kapatmak için event köprüsü. */
const TOGGLE_EVENT = "oh:toggle-sidebar";

export function toggleSidebar() {
  window.dispatchEvent(new Event(TOGGLE_EVENT));
}

export function useToggleSidebar() {
  return useCallback(() => toggleSidebar(), []);
}

export const SIDEBAR_TOGGLE_EVENT = TOGGLE_EVENT;

"use client";

import { useCallback } from "react";

/**
 * Giriş modalını her yerden açmak için basit bir event köprüsü.
 * (Header'daki "Giriş yap" butonu açar; modal layout'ta bir kez render edilir.)
 */
const OPEN_EVENT = "oh:open-login";

export function openLoginModal() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function useOpenLogin() {
  return useCallback(() => openLoginModal(), []);
}

export const LOGIN_MODAL_EVENT = OPEN_EVENT;

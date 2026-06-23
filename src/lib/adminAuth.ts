/**
 * Tek kişilik admin paneli erişimi — env'deki ADMIN_PASSWORD ile korunur.
 * Şifre asla cookie'ye düz yazılmaz; cookie sadece sha256(şifre) eşleşmesini
 * taşır, böylece tahmin/oku-yaz ile geçilemez (yine de tek katmanlı basit bir
 * korumadır — gerçek kullanıcı yönetimi değildir).
 */
import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "oh_admin";

function expectedToken(): string | null {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return null;
  return createHash("sha256").update(pass).digest("hex");
}

export function tokenForPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function checkPassword(password: string): boolean {
  const expected = expectedToken();
  return Boolean(expected) && tokenForPassword(password) === expected;
}

/** Server component içinde admin oturumu var mı? */
export function isAdminRequest(): boolean {
  const expected = expectedToken();
  if (!expected) return false;
  return cookies().get(ADMIN_COOKIE)?.value === expected;
}

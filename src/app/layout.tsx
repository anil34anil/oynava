import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdFrame } from "@/components/AdFrame";
import { CookieConsent } from "@/components/CookieConsent";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "900"],
});
const body = Rajdhani({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const SITE_NAME = "OYNAVA";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Binlerce Ücretsiz Oyun, Tarayıcıda Oyna`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Aksiyon, yarış, 3D, .io ve bulmaca oyunları. İndirme yok, kurulum yok — doğrudan tarayıcında akıcı oyna. Binlerce ücretsiz HTML5 oyun.",
  keywords: ["ücretsiz oyun", "online oyun", "html5 oyun", "tarayıcı oyunları", "3d oyun", "io oyunları"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // AdSense yayıncı kimliğini .env.local'e ekleyince script yüklenir.
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>
        {adsenseClient && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <Header />
        <main className="min-h-[70vh]">
          <AdFrame>{children}</AdFrame>
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

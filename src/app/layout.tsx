import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { AdFrame } from "@/components/AdFrame";
import { CookieConsent } from "@/components/CookieConsent";
import { LoginModal } from "@/components/LoginModal";
import { SITE } from "@/lib/site";

// Tüm site tek, temiz sans (Anthropic Sans tescilli olduğundan en yakın ücretsiz eş: Inter).
// CSS'te önce "Anthropic Sans" denenir, yoksa Inter'e düşer (globals.css :root).
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_NAME = "OYNAVA";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE_NAME} — Binlerce Ücretsiz Oyun, Tarayıcıda Oyna`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Aksiyon, yarış, 3D, .io ve bulmaca oyunları. İndirme yok, kurulum yok — doğrudan tarayıcında akıcı oyna. Binlerce ücretsiz HTML5 oyun.",
  keywords: ["ücretsiz oyun", "online oyun", "html5 oyun", "tarayıcı oyunları", "3d oyun", "io oyunları", "bedava oyun", "oyun oyna"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  // AdSense site doğrulaması için <meta name="google-adsense-account" ...>
  other: { "google-adsense-account": SITE.adsenseClient },
  // Google Search Console (token girilince <meta name="google-site-verification" ...>)
  ...(SITE.googleSiteVerification
    ? { verification: { google: SITE.googleSiteVerification } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // AdSense yayıncı kimliği (site.ts'te tanımlı; env override edebilir).
  const adsenseClient = SITE.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="tr" className={sans.variable}>
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
        <div className="flex">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <main className="min-h-[70vh]">
              <AdFrame>{children}</AdFrame>
            </main>
            <Footer />
          </div>
        </div>
        <CookieConsent />
        <LoginModal />
      </body>
    </html>
  );
}

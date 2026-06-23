import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { AdFrame } from "@/components/AdFrame";
import { CookieConsent } from "@/components/CookieConsent";
import { LoginModal } from "@/components/LoginModal";
import { SITE } from "@/lib/site";

// Sıcak, karakterli serif başlık fontu (insan-tasarımı his)
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});
// Yumuşak, humanist, okunaklı gövde fontu
const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
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

import type { Metadata } from "next";
import { Sora, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { AdFrame } from "@/components/AdFrame";
import { CookieConsent } from "@/components/CookieConsent";
import { LoginModal } from "@/components/LoginModal";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { LocaleHtml } from "@/components/LocaleHtml";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

// CYBERPULSE tipografi: Sora (başlık), Hanken Grotesk (gövde), JetBrains Mono (etiket/veri)
const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400", "600", "700", "800"] });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "700"] });

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
    <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
        {SITE.gaMeasurementId && (
          <>
            <Script
              id="ga-lib"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaMeasurementId}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${SITE.gaMeasurementId}');
              `}
            </Script>
          </>
        )}
        {/* Marka kimliği + Google Sitelinks arama kutusu (tüm sayfalarda) */}
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.name,
              alternateName: "Oynava Oyun Portalı",
              url: SITE.url,
              logo: `${SITE.url}/icon-512.png`,
              description:
                "OYNAVA — binlerce ücretsiz HTML5 oyunu indirmeden, tarayıcıda oynatan Türkçe oyun portalı.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE.name,
              url: SITE.url,
              inLanguage: "tr-TR",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE.url}/ara?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            },
          ]}
        />
        <LocaleHtml />
        <BackgroundDecor />
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

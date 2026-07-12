import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

// Sıralamaya katkısı OLMAYAN ama ağır tarama yapan SEO-denetim/bağlantı-indeks botları.
// Google/Bing/Yandex vb. arama motorlarına DOKUNULMAZ; yalnızca bunlar engellenir →
// Netlify bandwidth + Function çağrısı tasarrufu (bu botlar robots.txt'e uyar).
const BANDWIDTH_HOGS = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "BLEXBot",
  "PetalBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      { userAgent: BANDWIDTH_HOGS, disallow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

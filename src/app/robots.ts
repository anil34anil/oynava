import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}

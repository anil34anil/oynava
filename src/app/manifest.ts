import type { MetadataRoute } from "next";

/**
 * PWA manifesti — siteyi "uygulama olarak yükle" yapar (mobilde ana ekrana ekleme).
 * Next.js bunu otomatik <link rel="manifest"> olarak <head>'e ekler.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "OYNAVA — Binlerce Ücretsiz Oyun",
    short_name: "OYNAVA",
    description: "Aksiyon, yarış, 3D, .io ve bulmaca oyunları. İndirme yok — tarayıcında ücretsiz oyna.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    lang: "tr",
    dir: "ltr",
    categories: ["games", "entertainment"],
    icons: [
      { src: "/icon.png", sizes: "96x96", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

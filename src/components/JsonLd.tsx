/** Schema.org JSON-LD enjekte eder (SEO zengin sonuçları için). */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD güvenli: yalnızca veri serileştiriyoruz
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

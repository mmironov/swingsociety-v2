/**
 * Emits a structured-data block.
 *
 * Rendered as a script tag rather than through <head>, which is allowed for JSON-LD
 * and keeps the data next to the page that produced it. The content is serialised
 * JSON from our own database, and `<` is escaped so a stray angle bracket in CMS
 * text cannot close the script element early.
 */
export const JsonLd = ({ data }: { data: unknown }) => {
  if (!data) return null
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

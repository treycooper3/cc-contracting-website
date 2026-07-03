// Renders a JSON-LD structured-data block. `data` is developer-controlled (never user input).
// We escape "<" to "<" to prevent any chance of breaking out of the <script> tag.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

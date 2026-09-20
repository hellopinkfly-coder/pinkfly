/**
 * One block of schema.org JSON-LD.
 *
 * `dangerouslySetInnerHTML` is how a script's contents are written in React,
 * and the danger is real but bounded here: the value is `JSON.stringify` of
 * an object this codebase builds, never a string from a request. The one way
 * out of a JSON string literal is `</script>`, so that sequence is escaped —
 * a title containing it would otherwise close the tag early and put the rest
 * of the document's markup inside a script.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

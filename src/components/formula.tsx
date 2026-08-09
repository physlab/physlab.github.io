import katex from "katex";

export function Formula({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

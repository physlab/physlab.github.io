import { memo, useMemo } from "react";
import katex from "katex";

function FormulaInner({ math }: { math: string }) {
  const html = useMemo(
    () =>
      katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      }),
    [math],
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export const Formula = memo(FormulaInner);

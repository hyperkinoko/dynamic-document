import DOMPurify from "dompurify";
import { marked } from "marked";
import { memo } from "react";

export const MarkdownViewer = memo(({ buf }: { buf: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(buf)),
      }}
    />
  );
});

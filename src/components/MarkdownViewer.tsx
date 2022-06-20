import DOMPurify from "dompurify";
import { marked } from "marked";

export const MarkdownViewer = ({ buf }: { buf: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(buf)),
      }}
    />
  );
};

import DOMPurify from "dompurify";
import { marked } from "marked";
import { FC, memo } from "react";

type Props = { buf: string };

export const MarkdownViewer: FC<Props> = memo(({ buf }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(buf)),
      }}
    />
  );
});

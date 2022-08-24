import { sanitize } from "dompurify";
import { marked } from "marked";
import { FC, memo } from "react";

type Props = { buf: string };

export const MarkdownViewer: FC<Props> = memo(({ buf }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitize(marked(buf)),
      }}
    />
  );
});

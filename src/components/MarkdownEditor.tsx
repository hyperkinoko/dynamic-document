import "easymde/dist/easymde.min.css";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import SimpleMde from "react-simplemde-editor";
import { Options } from "easymde";

type Props = {
  setFunction: Dispatch<SetStateAction<string>>;
};

export const MarkdownEditor: FC<Props> = ({ setFunction }) => {
  const options = useMemo((): Options => {
    return {
      maxHeight: "200px",
      hideIcons: ["preview"],
    };
  }, []);
  return (
    <SimpleMde
      options={options}
      onChange={(buf) => {
        setFunction(buf);
      }}
    />
  );
};

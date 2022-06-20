import "easymde/dist/easymde.min.css";
import { Dispatch, SetStateAction, useMemo } from "react";
import SimpleMde from "react-simplemde-editor";
import { Options } from "easymde";

export const MarkdownEditor = ({
  setFunction,
}: {
  setFunction: Dispatch<SetStateAction<string>>;
}) => {
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

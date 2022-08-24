import { ExpandMoreOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FC, memo } from "react";

type Props = {
  displayText: String;
  component: JSX.Element;
  options?: JSX.Element;
};

export const InputAccordion: FC<Props> = memo((props) => {
  const { displayText, component, options } = props;
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
        <Typography variant={"h5"}>{displayText}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {component}
        {options}
      </AccordionDetails>
    </Accordion>
  );
});

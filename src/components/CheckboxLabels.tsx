import { FC, memo, useMemo } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

type Props = {
  labels: string[];
};

export const CheckboxLabels: FC<Props> = memo(({ labels }) => {
  const checkboxGroup = useMemo(() => {
    return (
      <FormGroup>
        {labels.map((name, idx) => {
          return (
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              key={idx}
              label={name}
            />
          );
        })}
      </FormGroup>
    );
  }, [labels]);
  return (
    <>
      <Typography variant={"h6"} sx={{ py: 1 }}>
        質問の回答
      </Typography>
      {checkboxGroup}
    </>
  );
});

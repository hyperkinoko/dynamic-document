import { FC, memo, useMemo, Dispatch, SetStateAction, useEffect } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

type Props = {
  labels: [string, boolean][];
  setLabels: Dispatch<SetStateAction<[string, boolean][]>>;
};

export const CheckboxLabels: FC<Props> = memo(({ labels, setLabels }) => {
  const checkboxGroup = useMemo(() => {
    return (
      <FormGroup>
        {labels.map(([name, flag], idx) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={flag}
                  onChange={() =>
                    setLabels(
                      labels.map(([tar, flag], idx) => {
                        const res = tar === name ? !flag : flag;
                        return [tar, res];
                      })
                    )
                  }
                />
              }
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

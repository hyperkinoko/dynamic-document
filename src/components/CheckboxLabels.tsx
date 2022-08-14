import { FC, memo, Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";

type Props = {
  labels: [string, boolean, string][];
  setLabels: Dispatch<SetStateAction<[string, boolean, string][]>>;
  titleSets: { [key: string]: string };
};

export const CheckboxLabels: FC<Props> = memo(
  ({ labels, setLabels, titleSets }): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const [buf, setBuf] = useState<string>("");

    const onClose = (): void => {
      setBuf("");
      setOpen(false);
    };

    const handleAddQuestion = () => {
      if (buf !== "") {
        if (labels.filter(([label, _]) => label === buf).length >= 1) {
          alert("回答が重複しています");
        } else {
          setLabels([...labels, [buf, true, ""]]);
          onClose();
        }
      } else {
        alert("回答を入力してください");
      }
    };

    return (
      <>
        <Typography variant={"h6"} sx={{ py: 1 }}>
          質問の回答
        </Typography>
        <FormGroup>
          {labels.map(([name, flag, destination], idx) => {
            return (
              <Box
                key={idx}
                sx={{ flexDirection: "row", display: "flex", py: 1 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={flag}
                      onChange={() =>
                        setLabels(
                          labels.map((label) => {
                            const res =
                              label[0] === name ? !label[1] : label[1];
                            return [label[0], res, label[2]];
                          })
                        )
                      }
                    />
                  }
                  label={name}
                />
                <Box sx={{ flexGrow: 1 }} />
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="select-destination">Destination</InputLabel>
                  {Object.keys(titleSets).length === 0 ? (
                    <div>loading</div>
                  ) : (
                    <Select
                      labelId="select-destination"
                      id="select-destination"
                      label="リンクするドキュメント"
                      defaultValue="未定"
                      onChange={(e) => {
                        setLabels(
                          labels.map((label) => {
                            const res: string =
                              label[0] === name
                                ? destination
                                : (e.target.value as string);
                            return [label[0], label[1], res];
                          })
                        );
                      }}
                    >
                      {Object.entries(titleSets).map(([id, title], j) => {
                        return (
                          <MenuItem value={id} key={idx * labels.length + j}>
                            {title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                </FormControl>
              </Box>
            );
          })}
        </FormGroup>
        <Button variant="contained" onClick={() => setOpen(true)}>
          回答を追加する
        </Button>
        <Dialog open={open} onClose={onClose}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              label="質問の回答"
              fullWidth
              variant="standard"
              onChange={(e) => setBuf(e.target.value)}
              value={buf}
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleAddQuestion}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { FC, useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { allDocumentsState } from "../atoms/AllDocumentsData";
import { getAllDocuments } from "../api/api";
import { titleSetsType } from "../types/titleSetsType";

export const Admin: FC = (): JSX.Element => {
  const nav = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [buf, setBuf] = useState<string>("");
  const [titleSets, setTitleSets] =
    useRecoilState<titleSetsType>(allDocumentsState);

  const onClose = (): void => {
    setOpen(false);
    setBuf("");
  };

  const handleViewClick = (): void => {
    if (buf === "") {
      alert("閲覧するドキュメントのタイトルを入力してください");
    } else {
      for (const [id, title] of Object.entries(titleSets)) {
        if (buf === title) {
          nav("/view", { state: id });
          return;
        }
      }
      alert("存在すするドキュメントのタイトルを入力してください");
    }
  };

  useEffect(() => {
    getAllDocuments("documents").then((data) => {
      const res: { [key: string]: string } = { 未定: "未定" };
      for (const doc of data) {
        const title: string = doc.title;
        const id: string = doc.id;
        res[id] = title;
      }
      setTitleSets(res);
    });
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%) translateX(-50%)",
      }}
    >
      <Grid container columnSpacing={5}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={5}
            sx={{ p: 2 }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Typography variant={"h5"} sx={{ p: 2 }}>
              ドキュメントを閲覧
            </Typography>
          </Paper>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={5}
            sx={{ p: 2 }}
            onClick={() => {
              nav("/edit");
            }}
          >
            <Typography variant={"h5"} sx={{ p: 2 }}>
              ドキュメントを編集
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="閲覧するドキュメントのタイトル"
            fullWidth
            variant="standard"
            onChange={(e) => setBuf(e.target.value)}
            value={buf}
            autoComplete="off"
          />
          <List>
            {Object.entries(titleSets)
              .filter(([_, name]) => name !== "未定")
              .map(([key, name], idx) => {
                return (
                  <Fragment key={key}>
                    <ListItemButton onClick={() => setBuf(name)}>
                      <ListItemText>{name}</ListItemText>
                    </ListItemButton>
                    <Divider />
                  </Fragment>
                );
              })}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleViewClick}>
            View
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

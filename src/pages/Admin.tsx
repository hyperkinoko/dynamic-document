import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";
import {
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  Fragment,
} from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { allDocumentsState } from "../atoms/AllDocumentsData";
import { getAllDocuments } from "../api/api";
import { titleSetsType } from "../types/titleSetsType";
import { documentObject } from "../types/documentObjectType";

export const Admin: FC = (): JSX.Element => {
  const nav = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [draftOpen, setDraftOpen] = useState<boolean>(false);
  const [buf, setBuf] = useState<string>("");
  const [titleSets, setTitleSets] =
    useRecoilState<titleSetsType>(allDocumentsState);
  const [draftSets, setDraftSets] = useState<documentObject[]>([]);

  const onClose = (setFunction: Dispatch<SetStateAction<boolean>>): void => {
    setFunction(false);
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

  const handleEditClick = (): void => {
    if (buf === "") {
      alert("編集するドキュメントのタイトルを入力してください");
    } else {
      for (const draft of draftSets) {
        if (buf === draft.title) {
          nav("/edit", { state: draft });
          return;
        }
      }
      alert("存在すするドキュメントのタイトルを入力してください");
    }
  };

  // recoilでstate管理するならuseEffect使わなくてよさそう
  // 一回目のclickのときに取得でいい
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
    getAllDocuments("drafts").then(setDraftSets);
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%) translateX(-50%)",
        textAlign: "center",
      }}
    >
      <Stack spacing={4}>
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
        <Paper
          elevation={5}
          sx={{ p: 2 }}
          onClick={() => {
            nav("/edit");
          }}
        >
          <Typography variant={"h5"} sx={{ p: 2 }}>
            ドキュメントを作成
          </Typography>
        </Paper>
        <Paper
          elevation={5}
          sx={{ p: 2 }}
          onClick={() => {
            setDraftOpen(true);
          }}
        >
          <Typography variant={"h5"} sx={{ p: 2 }}>
            ドキュメントを編集
          </Typography>
        </Paper>
        <Paper
          elevation={5}
          sx={{ p: 2 }}
          onClick={() => {
            nav("/signup");
          }}
        >
          <Typography variant={"h5"} sx={{ p: 2 }}>
            ユーザー登録
          </Typography>
        </Paper>
      </Stack>
      <Dialog open={open} onClose={() => onClose(setOpen)}>
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
          <List
            sx={{ minHeight: "200px", maxHeight: "200px", minWidth: "300px" }}
          >
            {Object.entries(titleSets)
              .filter(([_, name]) =>
                buf === "" ? name !== "未定" : name.indexOf(buf) !== -1
              )
              .map(([key, name]) => {
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
          <Button
            variant="contained"
            color="error"
            onClick={() => onClose(setOpen)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleViewClick}>
            View
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={draftOpen} onClose={() => onClose(setDraftOpen)}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="編集するドキュメントのタイトル"
            fullWidth
            variant="standard"
            onChange={(e) => setBuf(e.target.value)}
            value={buf}
            autoComplete="off"
          />
          <List
            sx={{ minHeight: "200px", maxHeight: "200px", minWidth: "300px" }}
          >
            {draftSets
              .filter(({ title }) => buf === "" || title.indexOf(buf) !== -1)
              .map(({ title }, idx) => {
                return (
                  <Fragment key={idx}>
                    <ListItemButton onClick={() => setBuf(title)}>
                      <ListItemText>{title}</ListItemText>
                    </ListItemButton>
                    <Divider />
                  </Fragment>
                );
              })}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => onClose(setDraftOpen)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditClick}>
            edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

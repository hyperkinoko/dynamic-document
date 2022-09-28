import {
  AppBar,
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { allDocumentsState } from "../atoms/AllDocumentsData";
import { getAllDocuments } from "../api/api";
import { titleSetsType } from "../types/titleSetsType";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAuth, signOut } from "firebase/auth";
import { authState } from "../hooks/Auth";
import { InputSearchDialog } from "../components/InputSearchDialog";

export const Admin: FC = (): JSX.Element => {
  const setAuth = useSetRecoilState(authState);
  const auth = getAuth();
  const nav = useNavigate();
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);
  const [dist, setDist] = useState<string>("");
  const setTitleSets = useSetRecoilState<titleSetsType>(allDocumentsState);
  const userName: string = auth.currentUser?.email as string;

  const handleLogout = (): void => {
    signOut(auth)
      .then(() => {
        alert("ログアウトしました");
        setAuth(null);
      })
      .catch(() => {
        alert("ログアウトに失敗しました");
      });
  };

  const handleClose = useCallback((): void => setSearchDialogOpen(false), []);

  // recoilでstate管理するならuseEffect使わなくてよさそう
  // 一回目のclickのときに取得でいい
  useEffect(() => {
    getAllDocuments().then((data) => {
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
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            管理画面
          </Typography>
          <Tooltip title={userName}>
            <IconButton size="large" color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container>
        <Stack spacing={4} sx={{ p: 3, textAlign: "center" }}>
          <Paper
            elevation={5}
            sx={{ p: 2 }}
            onClick={() => {
              setSearchDialogOpen(true);
              setDist("/view");
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
              setSearchDialogOpen(true);
              setDist("/edit");
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
      </Container>
      <InputSearchDialog
        open={searchDialogOpen}
        handleClose={handleClose}
        dist={dist}
      />
    </Box>
  );
};

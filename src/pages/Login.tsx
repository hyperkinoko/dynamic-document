import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import {
  browserSessionPersistence,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, VFC } from "react";
import { useSetRecoilState } from "recoil";
import { authState } from "../hooks/Auth";

export const Login: VFC = () => {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      setPersistence(auth, inMemoryPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((auth) => {
            if (auth.user) {
              setAuth(auth.user);
            }
          })
          .catch(() => {
            alert(`user doesn't exist`);
          })
          .finally(() => {
            setEmail("");
            setPassword("");
            setLoading(false);
          });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 3, px: 30 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container direction="column" alignItems="center">
          <Avatar sx={{ bgcolor: lightGreen[700] }}>
            <LockOutlined />
          </Avatar>
          <Typography variant={"h5"} sx={{ py: 2 }}>
            sign in
          </Typography>
          <TextField
            label="メールアドレス"
            variant="standard"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ py: 1 }}
          />
          <TextField
            type="password"
            label="パスワード"
            variant="standard"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ py: 1 }}
          />
          <LoadingButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              handleLogin();
            }}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            ログイン
          </LoadingButton>
        </Grid>
      </Paper>
    </Box>
  );
};

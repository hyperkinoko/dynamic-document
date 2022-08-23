import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, FC } from "react";
import { useSetRecoilState } from "recoil";
import { authState } from "../hooks/Auth";

export const Login: FC = (): JSX.Element => {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);

  const handleLogin = async () => {
    const auth = getAuth();
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((auth) => {
          if (auth.user.emailVerified) setAuth(auth.user);
          else throw new Error("1");
        })
        .catch((error) => {
          if (error.name === "Error") {
            alert("メール認証を済ませてください");
            setIsEmailVerified(false);
          } else if (error.name === "FirebaseError") {
            alert(`user doesn't exist`);
          }
          setLoading(false);
        });
    });
  };

  const handleSendEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        sendEmailVerification(auth.user);
        alert("確認メールを送信しました");
      })
      .catch((error) => {
        if (error.name === "FirebaseError") {
          alert(`user doesn't exist`);
        } else {
          alert(`error:${error.message}`);
        }
      });
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
          {!isEmailVerified && (
            <Stack direction="row" sx={{ py: 2 }}>
              <Typography variant={"h6"}>メールが届いていませんか？</Typography>
              <Button onClick={handleSendEmail}>認証メールを再送する</Button>
            </Stack>
          )}
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

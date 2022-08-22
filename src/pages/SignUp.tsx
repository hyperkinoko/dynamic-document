import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
} from "firebase/auth";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { lightGreen } from "@mui/material/colors";

export const SignUp: FC = (): JSX.Element => {
  const nav = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async (): Promise<void> => {
    // バリデーションチェック
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("正しいメールアドレスを入力してください");
      setLoading(false);
      return;
    }
    if (password.length <= 6) {
      alert("パスワードは7文字以上に設定してください");
      setLoading(false);
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(userCredential.user);
        alert("確認メールを送信しました");
        nav("/admin", { replace: true });
      })
      .catch(() => {
        alert("既に登録されています");
        setLoading(false);
      });
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 3, px: 30 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container direction="column" alignItems="center">
          <Avatar sx={{ bgcolor: lightGreen[700] }}>
            <AccountCircle />
          </Avatar>
          <Typography variant={"h5"} sx={{ py: 2 }}>
            sign up
          </Typography>
          <TextField
            label="メールアドレス"
            variant="standard"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ py: 1 }}
            autoComplete="off"
            autoFocus={true}
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
            autoComplete="off"
          />
          <LoadingButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              handleSignUp();
            }}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            サインアップ
          </LoadingButton>
        </Grid>
      </Paper>
    </Box>
  );
};

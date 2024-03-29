import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  useState,
  FC,
  useCallback,
  memo,
  Dispatch,
  SetStateAction,
} from "react";
import { useSetRecoilState } from "recoil";
import { authState } from "../hooks/Auth";
import { errorHandling } from "../util";
import { FirebaseError } from "firebase/app";

export const Login: FC = (): JSX.Element => {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);
  const [isPasswordError, setIsPasswordError] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    const auth = getAuth();
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((auth) => {
          if (auth.user.emailVerified) setAuth(auth.user);
          else throw new Error("not verify");
        })
        .catch((error: FirebaseError) => {
          errorHandling(error);
          if (error.name === "Error") setIsEmailVerified(false);
          if (error.code === "auth/wrong-password")
            setIsPasswordError((prev) => prev + 1);
          setLoading(false);
        });
    });
  };

  const handleSendEmail = (): void => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        sendEmailVerification(auth.user);
        setSnackOpen(true);
      })
      .catch(errorHandling);
  };

  const handleOpen = useCallback((): void => setOpen((prev) => !prev), []);

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
          <Box sx={{ py: 2, color: "gray" }}>
            {!isEmailVerified && (
              <Stack direction="row">
                <Typography variant={"h6"}>
                  メールが届いていませんか？
                </Typography>
                <Button onClick={handleSendEmail}>認証メールを再送する</Button>
              </Stack>
            )}
            {isPasswordError >= 3 && (
              <Stack direction="row">
                <Typography variant={"h6"}>
                  パスワードを忘れましたか？
                </Typography>
                <Button onClick={() => setOpen(true)}>
                  パスワードを再設定する
                </Button>
              </Stack>
            )}
          </Box>
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
      <ResetPasswordDialog
        open={open}
        handleOpen={handleOpen}
        setSnackOpen={setSnackOpen}
      />
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message="Send Email!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

type Props = {
  open: boolean;
  handleOpen: () => void;
  setSnackOpen: Dispatch<SetStateAction<boolean>>;
};

const ResetPasswordDialog: FC<Props> = memo(
  ({ open, handleOpen, setSnackOpen }): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleResetEmail = (): void => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setSnackOpen(true);
          handleOpen();
        })
        .catch(errorHandling)
        .finally(() => setLoading(false));
    };

    return (
      <Dialog open={open} onClose={handleOpen}>
        <DialogTitle>パスワード再設定</DialogTitle>
        <DialogContent sx={{ minWidth: "400px" }}>
          <TextField
            label="メールアドレス"
            variant="standard"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ py: 1 }}
            autoFocus={true}
          />
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button variant="contained" color="error" onClick={handleOpen}>
            やめる
          </Button>
          <LoadingButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              handleResetEmail();
            }}
            color="primary"
            variant="contained"
            type="submit"
          >
            メールを送る
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);

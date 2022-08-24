import {
  AppBar,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Toolbar,
  Typography,
  TextField,
  DialogContentText,
} from "@mui/material";
import { useState, FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveDocument } from "../api/api";
import { CheckboxLabels } from "../components/CheckboxLabels";
import { InputAccordion } from "../components/InputAccordion";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { documentObject } from "../types/documentObjectType";

export const CreateDocument: FC = (): JSX.Element => {
  const location = useLocation();
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [lead, setLead] = useState<string>("");
  const [procedure, setProcedure] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [openLeave, setOpenLeave] = useState<boolean>(false);
  const [labels, setLabels] = useState<[string, boolean, string][]>([
    ["はい", false, "未定"],
    ["いいえ", false, "未定"],
  ]);
  const nav = useNavigate();

  const handleSubmit = async (collectionName: string) => {
    const options: { label: string; next: string }[] = [];
    for (const [label, flag, destination] of labels) {
      if (collectionName === "draft" || flag) {
        options.push({
          label,
          next: destination !== "未定" ? destination : "",
        });
      }
    }

    const data: documentObject = {
      title,
      id,
      url: "link",
      markdownContent: {
        lead,
        procedure,
        question,
      },
      options,
    };
    // documentsに保存するときは整合性チェックを行う
    if (
      (collectionName === "documents" &&
        !!title &&
        !!question &&
        options.length >= 1) ||
      (collectionName === "drafts" && !!title)
    )
      saveDocument(data, collectionName).then(() => {
        nav("/admin", { replace: true });
      });
    else alert("フォーマットが正しくありません");
  };

  useEffect(() => {
    if (location.state) {
      const myState: documentObject = location.state as documentObject;
      setId(myState.id);
      setTitle(myState.title);
      if (myState.markdownContent?.lead) setLead(myState.markdownContent.lead);
      if (myState.markdownContent?.procedure)
        setProcedure(myState.markdownContent.procedure);
      setQuestion(myState.markdownContent.question);
      const tmp: [string, boolean, string][] = myState.options.map(
        ({ label, next }) => [label, true, next]
      );
      setLabels(tmp);
    }
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container columnSpacing={2} sx={{ pb: "60px" }}>
        <Grid item xs={6}>
          <InputAccordion
            displayText={"タイトル"}
            component={
              <TextField
                variant="standard"
                fullWidth
                required
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ py: 1 }}
              />
            }
          />
          <InputAccordion
            displayText={"リード"}
            component={<MarkdownEditor buf={lead} setFunction={setLead} />}
          />
          <InputAccordion
            displayText={"手順"}
            component={
              <MarkdownEditor buf={procedure} setFunction={setProcedure} />
            }
          />
          <InputAccordion
            displayText={"質問"}
            component={
              <MarkdownEditor buf={question} setFunction={setQuestion} />
            }
            options={<CheckboxLabels labels={labels} setLabels={setLabels} />}
          />
        </Grid>
        <Grid item xs={6} sx={{ height: "100%" }}>
          <Typography variant={"h4"} sx={{ py: 1 }}>
            preview
          </Typography>
          {lead || procedure || question ? (
            <Paper elevation={5} sx={{ p: 2, height: "100%" }}>
              <MarkdownViewer buf={lead} />
              <MarkdownViewer buf={procedure} />
              <MarkdownViewer buf={question} />
            </Paper>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant={"h6"} sx={{ py: 1, color: "lightgray" }}>
                Markdown Prevew
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <Dialog open={openLeave} onClose={() => setOpenLeave(false)}>
        <DialogContent>
          <DialogContentText>本当に編集をやめますか？</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button variant="contained" onClick={() => setOpenLeave(false)}>
            編集を続ける
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => nav("/", { replace: true })}
          >
            下書きに保存せずにやめる
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSubmit("drafts")}
          >
            下書きに保存する
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "whitesmoke", top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Button
              color="error"
              variant="contained"
              onClick={() => setOpenLeave(true)}
            >
              編集をやめる
            </Button>
          </Box>
          <Box sx={{ pl: 1 }}>
            <Button variant="contained" onClick={() => handleSubmit("drafts")}>
              下書きに保存
            </Button>
          </Box>
          <Box sx={{ pl: 1 }}>
            <Button
              color="success"
              variant="contained"
              onClick={() => handleSubmit("documents")}
            >
              保存
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

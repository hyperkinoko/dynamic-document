import {
  AppBar,
  Button,
  Box,
  Grid,
  Paper,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import { useState, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { saveDocument } from "../api/api";
import { CheckboxLabels } from "../components/CheckboxLabels";
import { InputAccordion } from "../components/InputAccordion";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { documentObject } from "../type";
import { isValid } from "../util";

export const CreateDocument: VFC = () => {
  const [title, setTitle] = useState<string>("");
  const [lead, setLead] = useState<string>("");
  const [procedure, setProcedure] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [labels, setLabels] = useState<[string, boolean][]>([
    ["はい", true],
    ["いいえ", true],
    ["わからない", true],
  ]);
  const nav = useNavigate();

  const handleSubmit = async () => {
    const id: string = "4";
    const options: { label: string; next: string }[] = [];
    let cnt = 1;
    for (const [label, flag] of labels) {
      if (flag) {
        options.push({ label, next: `${cnt}` });
        cnt += 1;
      }
    }

    const data: documentObject = {
      title,
      url: "link",
      id,
      markdownContent: {
        lead,
        procedure,
        question,
      },
      options,
    };
    if (isValid(data))
      saveDocument(data, id).then(() => {
        nav("/admin", { replace: true });
      });
    else console.error(data);
  };

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
            component={<MarkdownEditor setFunction={setLead} />}
          />
          <InputAccordion
            displayText={"手順"}
            component={<MarkdownEditor setFunction={setProcedure} />}
          />
          <InputAccordion
            displayText={"質問"}
            component={<MarkdownEditor setFunction={setQuestion} />}
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
      <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleSubmit}>
            <Typography variant={"h6"} sx={{ p: 1 }}>
              sign in
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

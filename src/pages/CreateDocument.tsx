import { Box, Grid, Paper, Typography, TextField } from "@mui/material";
import { useState, VFC } from "react";
import { CheckboxLabels } from "../components/CheckboxLabels";
import { InputAccordion } from "../components/InputAccordion";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownViewer } from "../components/MarkdownViewer";

export const CreateDocument: VFC = () => {
  const [title, setTitle] = useState<string>("");
  const [lead, setLead] = useState<string>("");
  const [procedure, setProcedure] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [labels, setLabels] = useState<string[]>([
    "はい",
    "いいえ",
    "わからない",
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <InputAccordion
            displayText={"タイトル"}
            component={
              <TextField
                label="タイトル"
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
            options={<CheckboxLabels labels={labels} />}
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
    </Box>
  );
};

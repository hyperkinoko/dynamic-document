import { Box, Grid, Paper, Typography } from "@mui/material";
import { useState, VFC } from "react";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownViewer } from "../components/MarkdownViewer";

export const CreateDocument: VFC = () => {
  const [lead, setLead] = useState<string>("");
  const [procedure, setProcedure] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  return (
    <Box sx={{ p: 2 }}>
      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <Grid item xs={12}>
            <Typography variant={"h4"} sx={{ py: 1 }}>
              リード
            </Typography>
            <MarkdownEditor setFunction={setLead} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h4"} sx={{ py: 1 }}>
              手順
            </Typography>
            <MarkdownEditor setFunction={setProcedure} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h4"} sx={{ py: 1 }}>
              質問
            </Typography>
            <MarkdownEditor setFunction={setQuestion} />
          </Grid>
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

import {
  Box,
  AppBar,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState, VFC } from "react";
import { getDocument } from "../api/api";
import { documentObject } from "../type";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { useLocation, useNavigate } from "react-router-dom";

export const ViewDocument: VFC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [content, setContent] = useState<documentObject | null>(null);
  const [queryId, setQueryId] = useState<string>(location.state as string);

  useEffect(() => {
    if (queryId !== null) {
      getDocument(queryId).then((document: documentObject) => {
        setContent(document);
      });
    } else {
      alert(`無効なドキュメントです id:${queryId}`);
      nav("/admin", { replace: true });
    }
  }, [queryId]);

  if (content === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5" }}>
      <AppBar position="static">
        <Typography variant="h3" component="div" sx={{ p: 2, pl: 2 }}>
          {content.title}
        </Typography>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Grid container rowSpacing={2}>
          {content.markdownContent.lead && (
            <Grid item xs={12}>
              <Paper elevation={5} sx={{ p: 2 }}>
                <MarkdownViewer buf={content.markdownContent.lead} />
              </Paper>
            </Grid>
          )}
          {content.markdownContent.procedure && (
            <Grid item xs={12}>
              <Paper elevation={5} sx={{ p: 2 }}>
                <MarkdownViewer buf={content.markdownContent.procedure} />
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper elevation={5} sx={{ p: 2 }}>
              <MarkdownViewer buf={content.markdownContent.question} />
              <Grid container columnSpacing={2}>
                {content.options.map(({ label, next }, key) => {
                  return (
                    <Grid
                      item
                      xs={4}
                      key={key}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => setQueryId(next)}
                      >
                        {label}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

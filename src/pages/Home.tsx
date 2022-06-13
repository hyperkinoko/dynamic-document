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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocument } from "../api/api";
import { documentObject } from "../type";

export const Home: VFC = () => {
  const [content, setContent] = useState<documentObject | null>(null);

  const handleDocumentChange = (next: string) => {
    getDocument(next).then((document: documentObject) => {
      setContent(document);
    });
  };

  useEffect(() => {
    getDocument("1").then((document: documentObject) => {
      setContent(document);
    });
  }, []);

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
                <ReactMarkdown
                  children={content.markdownContent.lead}
                  remarkPlugins={[remarkGfm]}
                />
              </Paper>
            </Grid>
          )}
          {content.markdownContent.procedure && (
            <Grid item xs={12}>
              <Paper elevation={5} sx={{ p: 2 }}>
                <ReactMarkdown
                  children={content.markdownContent.procedure}
                  remarkPlugins={[remarkGfm]}
                />
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper elevation={5} sx={{ p: 2 }}>
              <ReactMarkdown
                children={content.markdownContent.question}
                remarkPlugins={[remarkGfm]}
              />
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
                        onClick={() => handleDocumentChange(next)}
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

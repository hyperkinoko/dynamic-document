import { Box, Container, Grid, Paper, Button } from "@mui/material";
import { useEffect, useState, VFC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import getDocument from "./api/api";

const App: VFC = () => {
  type documentObject = {
    title: string;
    id: string;
    url: string;
    markdownContent: {
      lead?: string[];
      procedure?: string[];
      question: string[];
    };
    options: { label: string; next: string }[];
  };

  const [content, setContent] = useState<documentObject | null>(null);

  const handleDocumentChange = (next: string) => {
    getDocument(next).then((document) => {
      setContent(document);
    });
  };

  useEffect(() => {
    getDocument("1").then((data: documentObject) => {
      setContent(data);
    });
  }, []);

  if (content === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 3 }}>
      <Container>
        <Grid container rowSpacing={2}>
          {Object.entries(content.markdownContent).map(
            ([key, data]): JSX.Element => {
              return (
                <Grid item xs={12} key={key}>
                  <Paper elevation={5} sx={{ p: 2 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data.join("\n")}
                    </ReactMarkdown>
                    {key === "question" && (
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
                    )}
                  </Paper>
                </Grid>
              );
            }
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default App;

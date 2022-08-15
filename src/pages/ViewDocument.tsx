import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState, VFC } from "react";
import { getDocument } from "../api/api";
import { documentObject } from "../types/documentObjectType";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

export const ViewDocument: VFC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const initId: string = location.state as string;
  const [content, setContent] = useState<documentObject | null>(null);
  const [docHistory, setDocHistory] = useState<documentObject[]>([]);

  const handleMove = (id: string): void => {
    if (!!id) {
      // docHistoryに存在した場合dbにアクセスはしない
      // documentがループすることがあるか？
      for (const doc of docHistory) {
        if (doc.id === id) {
          setContent(doc);
          setDocHistory([...docHistory, doc]);
          return;
        }
      }
      // docHistoryに存在しなかった場合dbにアクセスする
      getDocument(id).then((document: documentObject) => {
        setContent(document);
        setDocHistory([...docHistory, document]);
      });
    } else {
      if (id === "") {
        alert(`行き先がありません`);
      } else {
        alert(`無効なドキュメントです id:${id}`);
      }
    }
  };

  const handleBack = (): void => {
    // 1つ前のドキュメントを参照
    // 末尾に入っているのは現在のdocumentなので、slice(-2)でok
    setContent(docHistory.slice(-2)[0]);
    setDocHistory(docHistory.slice(0, -1));
  };

  useEffect(() => {
    if (!!initId) {
      getDocument(initId).then((document: documentObject) => {
        setContent(document);
        setDocHistory([document]);
      });
    } else {
      if (initId === "") {
        alert(`行き先がありません`);
      } else {
        alert(`無効なドキュメントです id:${initId}`);
      }
      nav("/", { replace: true });
    }
  }, []);

  return (
    <>
      {content === null ? (
        <div>loading...</div>
      ) : (
        <Box sx={{ backgroundColor: "#f5f5f5" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ pl: 2 }}
                disabled={docHistory.length <= 1}
                onClick={handleBack}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                component="div"
                sx={{ p: 2, flexGrow: 1 }}
              >
                {content.title}
              </Typography>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ pr: 2 }}
                onClick={() => nav("/", { replace: true })}
              >
                <HomeIcon />
              </IconButton>
            </Toolbar>
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
                          xs={12 / content.options.length}
                          key={key}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleMove(next)}
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
      )}
    </>
  );
};

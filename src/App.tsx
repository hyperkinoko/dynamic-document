import { Box, Container, Grid, Paper } from "@mui/material";
import { VFC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const App: VFC = () => {
  type documentObject = {
    id: string;
    url: string;
    markdownContent: {
      lead?: string;
      procedure?: string;
      question: string;
    };
    options: { label: string; next: string }[];
  };

  const leadMarkdown: string = `# Hello World
  ## hoge
  - a
  - *b*
    - **c**
  `;

  /*
    remark-gfmを使うと
    ・取り消し線
    ・テーブル
    ・URL
    ・タスクリスト
    が使える
  */
  const procedureMarkdown: string = `Just a link: https://reactjs.com.

  ~~取り消し線~~
  * [ ] hoge
  * [x] piyo
  `;

  const questionMarkdown: string = `\`aiueo\`

  aiueo`;

  const documentObject: documentObject = {
    id: "1",
    url: "2",
    markdownContent: {
      lead: leadMarkdown,
      procedure: procedureMarkdown,
      question: questionMarkdown,
    },
    options: [
      {
        label: "a",
        next: "2",
      },
    ],
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 3 }}>
      <Container>
        <Grid container rowSpacing={2}>
          {Object.entries(documentObject.markdownContent).map(
            ([key, data]): JSX.Element => {
              return (
                <Grid item xs={12} key={key}>
                  <Paper elevation={5} sx={{ p: 2 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data}
                    </ReactMarkdown>
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

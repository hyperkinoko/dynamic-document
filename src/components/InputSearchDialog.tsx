import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FC, useState, memo } from "react";
import { documentSearch } from "../api/api";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  handleClose: () => void;
  dist: string;
};

type AlgoliaDocType = {
  objectID: string;
  title: string;
  lead: string;
  procedure: string;
  question: string;
  draft: boolean;
};

export const InputSearchDialog: FC<Props> = memo((props): JSX.Element => {
  const { open, handleClose, dist } = props;
  const nav = useNavigate();
  const [searchWord, setSearchWord] = useState<string>("");
  const [matchDocumentList, setMatchDocumentList] = useState<AlgoliaDocType[]>(
    []
  );

  const handleSearch = (): void => {
    documentSearch(searchWord).then((docs) => {
      const res: AlgoliaDocType[] = docs
        .filter((doc) => {
          const { draft }: { draft: boolean } = JSON.parse(JSON.stringify(doc));
          return dist !== "/view" || !draft;
        })
        .map((doc) => {
          const { title, markdownContent, draft, objectID } = JSON.parse(
            JSON.stringify(doc)
          );
          const { lead, procedure, question } = markdownContent;
          return {
            objectID,
            title,
            lead,
            procedure,
            question,
            draft,
          };
        });
      setMatchDocumentList(res);
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            width: 400,
            mb: 2,
          }}
        >
          <IconButton type="button" aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <Divider orientation="vertical" />
          <InputBase
            sx={{ pl: 1, flex: 1 }}
            placeholder="search..."
            inputProps={{ "aria-label": "search..." }}
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </Paper>
        <Box sx={{ height: 200, width: 400 }}>
          {matchDocumentList.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              検索結果はありません
            </Box>
          ) : (
            <List>
              {matchDocumentList.map((doc, idx) => {
                const { objectID, title, lead, procedure, question } = doc;
                return (
                  <Paper sx={{ mb: 1 }} elevation={2} key={idx}>
                    <ListItemButton
                      onClick={() => nav(dist, { state: objectID })}
                    >
                      <Stack sx={{ overflow: "hidden" }}>
                        <Typography
                          variant="h5"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {title}
                        </Typography>
                        {lead !== "" && (
                          <Box sx={{ mb: 1, pl: 1 }}>
                            <Typography variant="body1">lead</Typography>
                            <Typography variant="body2">{lead}</Typography>
                          </Box>
                        )}
                        {procedure !== "" && (
                          <Box sx={{ mb: 1, pl: 1 }}>
                            <Typography variant="body1">procedure</Typography>
                            <Typography variant="body2">{procedure}</Typography>
                          </Box>
                        )}
                        <Box sx={{ pl: 1 }}>
                          <Typography variant="body1">question</Typography>
                          <Typography variant="body2">{question}</Typography>
                        </Box>
                      </Stack>
                    </ListItemButton>
                  </Paper>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button variant="contained" color="error" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

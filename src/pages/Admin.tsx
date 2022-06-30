import { Box, Grid, Paper, Typography } from "@mui/material";
import { VFC } from "react";
import { useNavigate } from "react-router-dom";

export const Admin: VFC = () => {
  const nav = useNavigate();

  return (
    <Box
      sx={{
        p: 4,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%) translateX(-50%)",
      }}
    >
      <Grid container columnSpacing={5}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={5}
            sx={{ p: 2 }}
            onClick={() => {
              nav("/view", { state: "1" });
            }}
          >
            <Typography variant={"h5"} sx={{ p: 2 }}>
              ドキュメントを閲覧
            </Typography>
          </Paper>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={5}
            sx={{ p: 2 }}
            onClick={() => {
              nav("/edit");
            }}
          >
            <Typography variant={"h5"} sx={{ p: 2 }}>
              ドキュメントを編集
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

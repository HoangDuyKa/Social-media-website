import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
      <CircularProgress /> {/* Show Loading spinner */}
    </Stack>
  );
};

export default Loading;

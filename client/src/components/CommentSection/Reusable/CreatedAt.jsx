import { Typography, useTheme } from "@mui/material";
import React from "react";

const CreatedAt = ({ createdAt }) => {
  const { palette } = useTheme();

  return (
    <Typography color={palette.neutral.medium} fontSize="0.75rem">
      {createdAt}
    </Typography>
    // <Typography sx={{ color: "neutral.grayishBlue" }}>{createdAt}</Typography>
  );
};

export default CreatedAt;

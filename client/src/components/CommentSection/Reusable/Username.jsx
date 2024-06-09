import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import YouTag from "../YouTag";
import { useNavigate } from "react-router-dom";

const Username = ({ userName, UserComment, loggedInUserId }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const navigate = useNavigate();
  return (
    <>
      {/* <Typography
        fontWeight="bold"
        sx={{
          maxWidth: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "neutral.darkBlue",
        }}
      >
        {userName}
      </Typography> */}
      <Box
        onClick={() => {
          navigate(`/profile/${UserComment._id}`);
          navigate(0);
        }}
      >
        <Typography
          color={main}
          variant="h5"
          fontWeight="500"
          sx={{
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {userName}
        </Typography>
      </Box>
      {loggedInUserId === UserComment._id ? <YouTag /> : null}
    </>
  );
};

export default Username;

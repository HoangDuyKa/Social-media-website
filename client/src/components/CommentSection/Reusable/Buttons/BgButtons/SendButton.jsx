import { Button } from "@mui/material";
import React from "react";

const SendButton = ({ patchComment, setCommentTxt, commentTxt }) => {
  return (
    <Button
      size="large"
      sx={{
        bgcolor: "custom.moderateBlue",
        color: "neutral.white",
        p: "8px 25px",
        "&:hover": {
          bgcolor: "custom.lightGrayishBlue",
        },
      }}
      onClick={(e) => {
        !commentTxt.trim()
          ? e.preventDefault()
          : patchComment(commentTxt.trim());
        setCommentTxt("");
      }}
    >
      Send
    </Button>
  );
};

export default SendButton;

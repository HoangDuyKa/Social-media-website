import { IconButton } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

const SendButton = ({ handleSend, commentTxt }) => {
  return (
    <IconButton
      color="primary"
      onClick={handleSend}
      disabled={!commentTxt.trim()}
      sx={{
        bgcolor: "primary.main",
        color: "white",
        "&:hover": {
          bgcolor: "primary.dark",
        },
      }}
    >
      <SendIcon />
    </IconButton>

    // <Button
    //   size="large"
    //   sx={{
    //     bgcolor: "custom.moderateBlue",
    //     color: "neutral.white",
    //     p: "8px 25px",
    //     "&:hover": {
    //       bgcolor: "custom.lightGrayishBlue",
    //     },
    //   }}
    //   onClick={(e) => {
    //     !commentTxt.trim()
    //       ? e.preventDefault()
    //       : patchComment(commentTxt.trim());
    //     setCommentTxt("");
    //   }}
    // >
    //   Send
    // </Button>
  );
};

export default SendButton;

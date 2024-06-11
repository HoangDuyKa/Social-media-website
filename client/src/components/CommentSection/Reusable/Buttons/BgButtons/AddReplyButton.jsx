import { Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

const AddReplyButton = ({
  // setReplyText,
  // addReply,
  replyText,
  // commentId,
  // replyingTo,
  handleSendReply,
}) => {
  return (
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
    //     !replyText.trim()
    //       ? e.preventDefault()
    //       : addReply(replyText, commentId, replyingTo);
    //     setReplyText("");
    //   }}
    // >
    //   Reply
    // </Button>
    <IconButton
      color="primary"
      onClick={handleSendReply}
      disabled={!replyText.trim()}
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
  );
};

export default AddReplyButton;

import { Avatar, Card, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import AddReplyButton from "./Reusable/Buttons/BgButtons/AddReplyButton";
import EditableReplyField from "./Reusable/Reply/EditableReplyField";

const AddReply = ({ addReply, loggedInUserImage, commentId, replyingTo }) => {
  const [replyText, setReplyText] = useState("");
  return (
    <>
      <Card>
        <Box sx={{ p: "15px" }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={loggedInUserImage}
              variant="rounded"
              alt="user-avatar"
            />
            <EditableReplyField
              placeHolder="Add a reply"
              setText={setReplyText}
              text={replyText}
            />
            <AddReplyButton
              addReply={addReply}
              replyText={replyText}
              setReplyText={setReplyText}
              commentId={commentId}
              replyingTo={replyingTo}
            />
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default AddReply;

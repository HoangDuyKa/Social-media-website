import { Avatar, Card, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import EditableCommentField from "./Reusable/Comment/EditableCommentField";
import SendButton from "./Reusable/Buttons/BgButtons/SendButton";

const AddComment = ({ patchComment, UserCommentImage }) => {
  const [commentTxt, setCommentTxt] = useState("");

  return (
    <>
      <Card>
        <Box sx={{ p: "15px" }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={UserCommentImage}
              variant="rounded"
              alt="user-avatar"
            />
            <EditableCommentField
              commentText={commentTxt}
              setCommentText={setCommentTxt}
              placeHolder="Add a comment"
            />
            <SendButton
              patchComment={patchComment}
              commentTxt={commentTxt}
              setCommentTxt={setCommentTxt}
            />
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default AddComment;

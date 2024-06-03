import { Avatar, Card, Stack, ThemeProvider, createTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useMemo, useState } from "react";
import CommentContext from "../../commentContext";
import EditableCommentField from "./Reusable/Comment/EditableCommentField";
import SendButton from "./Reusable/Buttons/BgButtons/SendButton";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";

const AddComment = ({ patchComment }) => {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { IMGOBJ } = useContext(CommentContext);
  const [commentTxt, setCommentTxt] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <Box sx={{ p: "15px" }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={IMGOBJ.juliusomo}
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
    </ThemeProvider>
  );
};

export default AddComment;

import { Avatar, Card, Stack, ThemeProvider, createTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useMemo, useState } from "react";
import CommentContext from "../../commentContext";
import AddReplyButton from "./Reusable/Buttons/BgButtons/AddReplyButton";
import EditableReplyField from "./Reusable/Reply/EditableReplyField";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";

const AddReply = ({ onAdd }) => {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { IMGOBJ } = useContext(CommentContext);
  const [replyText, setReplyText] = useState("");
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
            <EditableReplyField
              placeHolder="Add a reply"
              setText={setReplyText}
              text={replyText}
            />
            <AddReplyButton
              onAdd={onAdd}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          </Stack>
        </Box>
      </Card>
    </ThemeProvider>
  );
};

export default AddReply;

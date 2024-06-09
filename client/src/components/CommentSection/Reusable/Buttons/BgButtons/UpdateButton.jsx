import { useTheme } from "@emotion/react";
import { Button } from "@mui/material";
import React from "react";

const UpdateButton = ({
  commentText,
  editingComm,
  setEditingComm,
  editComment,
  commentId,
}) => {
  const { palette } = useTheme();
  return (
    <Button
      sx={{
        float: "right",
        bgcolor: palette.primary.main,
        color: palette.background.alt,
        borderRadius: "3rem",
        marginLeft: 1,
        p: "4px 16px",
      }}
      onClick={() => {
        editComment(commentId, commentText);
        setEditingComm(!editingComm);
      }}
    >
      Update
    </Button>
  );
};

export default UpdateButton;

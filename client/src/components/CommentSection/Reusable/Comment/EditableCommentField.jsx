import { TextField } from "@mui/material";
import React from "react";

const EditableCommentField = ({ commentText, setCommentText, placeHolder }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder={placeHolder}
      multiline
      maxRows={4}
      sx={{ ml: 2, mr: 2 }}
      InputProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    />

    // <TextField
    //   sx={{ p: "20px 0" }}
    //   multiline
    //   fullWidth
    //   minRows={2}
    //   id="outlined-multilined"
    //   placeholder={placeHolder}
    //   value={commentText}
    //   onChange={(e) => {
    //     setCommentText(e.target.value);
    //   }}
    // />
  );
};

export default EditableCommentField;

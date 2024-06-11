import { TextField } from "@mui/material";
import React from "react";

const EditableReplyField = ({ text, setText, placeHolder }) => {
  return (
    // <TextField
    //   sx={{ p: "20px 0" }}
    //   multiline
    //   fullWidth
    //   minRows={2}
    //   id="outlined-multilined"
    //   placeholder={placeHolder}
    //   value={text}
    //   onChange={(e) => {
    //     setText(e.target.value);
    //   }}
    // />
    <TextField
      variant="outlined"
      fullWidth
      value={text}
      multiline
      maxRows={4}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeHolder}
      sx={{ ml: 2, mr: 2 }}
      InputProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default EditableReplyField;

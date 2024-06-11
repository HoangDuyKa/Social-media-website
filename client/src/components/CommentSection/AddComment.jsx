// import { Avatar, Card, Stack } from "@mui/material";
// import { Box } from "@mui/system";
// import React, { useState } from "react";
// import EditableCommentField from "./Reusable/Comment/EditableCommentField";
// import SendButton from "./Reusable/Buttons/BgButtons/SendButton";

// const AddComment = ({ patchComment, UserCommentImage }) => {
//   const [commentTxt, setCommentTxt] = useState("");

//   return (
//     <>
//       <Card>
//         <Box sx={{ p: "15px" }}>
//           <Stack direction="row" spacing={2} alignItems="flex-start">
//             <Avatar
//               src={UserCommentImage}
//               variant="rounded"
//               alt="user-avatar"
//             />
//             <EditableCommentField
//               commentText={commentTxt}
//               setCommentText={setCommentTxt}
//               placeHolder="Add a comment"
//             />
//             <SendButton
//               patchComment={patchComment}
//               commentTxt={commentTxt}
//               setCommentTxt={setCommentTxt}
//             />
//           </Stack>
//         </Box>
//       </Card>
//     </>
//   );
// };

// export default AddComment;

import React, { useState } from "react";
import { Avatar, Card, Stack, TextField, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditableCommentField from "./Reusable/Comment/EditableCommentField";
import SendButton from "./Reusable/Buttons/BgButtons/SendButton";

const AddComment = ({ patchComment, UserCommentImage }) => {
  const [commentTxt, setCommentTxt] = useState("");

  const handleSend = () => {
    patchComment(commentTxt);
    setCommentTxt("");
  };

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Avatar
        src={UserCommentImage}
        variant="rounded"
        alt="user-avatar"
        sx={{ width: 48, height: 48 }}
      />

      <EditableCommentField
        commentText={commentTxt}
        setCommentText={setCommentTxt}
        placeHolder="Add a comment"
      />
      <SendButton commentTxt={commentTxt} handleSend={handleSend} />
    </Card>
  );
};

export default AddComment;

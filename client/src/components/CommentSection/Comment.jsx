// import React, { useState } from "react";
// import { Avatar, Button, Card, Stack } from "@mui/material";
// import { Box } from "@mui/system";

// import RepliesSection from "./RepliesSection";
// import ConfirmDelete from "./ConfirmDelete";
// import Username from "./Reusable/Username";
// import CreatedAt from "./Reusable/CreatedAt";
// import CommentText from "./Reusable/Comment/CommentText";
// import EditableCommentField from "./Reusable/Comment/EditableCommentField";
// import EditButton from "./Reusable/Buttons/TextButtons/EditButton";
// import DeleteButton from "./Reusable/Buttons/TextButtons/DeleteButton";
// import ReplyButton from "./Reusable/Buttons/TextButtons/ReplyButton";
// import UpdateButton from "./Reusable/Buttons/BgButtons/UpdateButton";
// import { useSelector } from "react-redux";
// import { useTheme } from "@emotion/react";
// import StyledBadge from "components/StyledBadge";

// const Comment = ({
//   onPass,
//   deleteComment,
//   editComment,
//   postUserId,
//   patchReplyComment,
// }) => {
//   const { commentText, UserComment, replies, commentId, createdAt } = onPass;
//   const userName = `${UserComment.firstName} ${UserComment.lastName} `;
//   const loggedInUser = useSelector((state) => state.auth.user);

//   const [clicked, setClicked] = useState(false);
//   const [editingComment, setEditingComment] = useState(false);
//   const [commentTextInput, setCommentTextInput] = useState(commentText);
//   const [openModal, setOpenModal] = useState(false);
//   const { palette } = useTheme();
//   const onlineUsers = useSelector((state) => state.app.onlineUsers);
//   const online = onlineUsers.includes(loggedInUser._id);

//   const handleOpen = () => {
//     setOpenModal(true);
//   };

//   const handleClose = () => {
//     setOpenModal(false);
//   };

//   return (
//     <>
//       <ConfirmDelete
//         onOpen={openModal}
//         onClose={handleClose}
//         id={commentId}
//         deleteComment={deleteComment}
//       />
//       <Card>
//         <Box sx={{ p: "15px" }}>
//           <Stack spacing={2} direction="row">
//             <Box sx={{ width: "100%" }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Stack spacing={2} direction="row" alignItems="center">
//                   {online ? (
//                     <StyledBadge
//                       overlap="circular"
//                       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                       variant="dot"
//                     >
//                       <Avatar src={UserComment.picturePath}></Avatar>
//                     </StyledBadge>
//                   ) : (
//                     <Avatar src={UserComment.picturePath}></Avatar>
//                   )}
//                   <Username
//                     userName={userName}
//                     UserComment={UserComment}
//                     loggedInUserId={loggedInUser._id}
//                   />
//                   <CreatedAt createdAt={createdAt} />
//                 </Stack>
//                 {loggedInUser._id === UserComment._id ? (
//                   <Stack direction="row" spacing={1}>
//                     <DeleteButton functionality={() => handleOpen()} />
//                     <EditButton
//                       functionality={() => setEditingComment(!editingComment)}
//                       editingComment={editingComment}
//                     />
//                   </Stack>
//                 ) : postUserId === loggedInUser._id ? (
//                   <Stack direction="row" spacing={1}>
//                     {/* UserLoggedIn is a post owner but not comment owner */}
//                     <DeleteButton functionality={() => handleOpen()} />
//                     <ReplyButton functionality={() => setClicked(!clicked)} />
//                   </Stack>
//                 ) : (
//                   <Stack direction="row" spacing={1}>
//                     {/* UserLoggedIn is not a post owner and comment owner */}
//                     <ReplyButton functionality={() => setClicked(!clicked)} />
//                   </Stack>
//                 )}

//                 {/* {postUserId === loggedInUser._id &&
//                   loggedInUser._id !== UserComment._id && (
//                     <Stack direction="row" spacing={1}>
//                       <DeleteButton functionality={() => handleOpen()} />
//                       <ReplyButton functionality={() => setClicked(!clicked)} />
//                     </Stack>
//                   )} */}

//                 {/* UserLoggedIn is not a post owner but comment owner */}
//                 {/* {postUserId !== loggedInUser._id &&
//                   loggedInUser._id === UserComment._id && (
//                     <Stack direction="row" spacing={1}>
//                       <DeleteButton functionality={() => handleOpen()} />
//                       <EditButton
//                         functionality={() => setEditingComment(!editingComment)}
//                         editingComment={editingComment}
//                       />
//                     </Stack>
//                   )} */}

//                 {/* UserLoggedIn is not a post owner and comment owner */}
//                 {/* {postUserId !== loggedInUser._id &&
//                   loggedInUser._id !== UserComment._id && (
//                     <Stack direction="row" spacing={1}>
//                       <ReplyButton functionality={() => setClicked(!clicked)} />
//                     </Stack>
//                   )} */}
//               </Stack>
//               {editingComment ? (
//                 <>
//                   <EditableCommentField
//                     commentText={commentTextInput}
//                     setCommentText={setCommentTextInput}
//                     placeHolder="Don't leave this blank!"
//                   />

//                   <UpdateButton
//                     commentText={commentTextInput}
//                     editingComm={editingComment}
//                     setEditingComm={setEditingComment}
//                     editComment={editComment}
//                     commentId={commentId}
//                   />
//                   <Button
//                     sx={{
//                       float: "right",
//                       bgcolor: palette.primary.main,
//                       color: palette.background.alt,
//                       borderRadius: "3rem",
//                       p: "4px 16px",
//                     }}
//                     onClick={() => {
//                       !commentText.trim()
//                         ? alert(
//                             "If  you want to remove the comment text, just delete the comment."
//                           )
//                         : setEditingComment(!editingComment);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </>
//               ) : (
//                 <CommentText commentText={commentText} />
//               )}
//             </Box>
//           </Stack>
//         </Box>
//       </Card>

//       <RepliesSection
//         onReplies={replies}
//         onClicked={clicked}
//         replyingTo={userName}
//         loggedInUserImage={loggedInUser.picturePath}
//         patchReplyComment={patchReplyComment}
//         commentId={commentId}
//       />
//     </>
//   );
// };
// export default Comment;

import React, { useState } from "react";
import { Avatar, Button, Card, Stack, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RepliesSection from "./RepliesSection";
import ConfirmDelete from "./ConfirmDelete";
import Username from "./Reusable/Username";
import CreatedAt from "./Reusable/CreatedAt";
import CommentText from "./Reusable/Comment/CommentText";
import EditableCommentField from "./Reusable/Comment/EditableCommentField";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import StyledBadge from "components/StyledBadge";

const Comment = ({
  onPass,
  deleteComment,
  editComment,
  postUserId,
  patchReplyComment,
}) => {
  const { commentText, userComment, replies, _id, createdAt } = onPass;
  const userName = `${userComment.firstName} ${userComment.lastName}`;
  const loggedInUser = useSelector((state) => state.auth.user);
  const [clicked, setClicked] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [commentTextInput, setCommentTextInput] = useState(commentText);
  const [openModal, setOpenModal] = useState(false);
  const { palette } = useTheme();
  const onlineUsers = useSelector((state) => state.app.onlineUsers);
  const online = onlineUsers.includes(loggedInUser._id);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ConfirmDelete
        onOpen={openModal}
        onClose={handleClose}
        id={_id}
        deleteComment={deleteComment}
      />
      <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {online ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar src={userComment.picturePath} />
                    </StyledBadge>
                  ) : (
                    <Avatar src={userComment.picturePath} />
                  )}
                  <Username
                    userName={userName}
                    UserComment={userComment}
                    loggedInUserId={loggedInUser._id}
                  />
                  <CreatedAt createdAt={createdAt} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  {loggedInUser._id === userComment._id ? (
                    <>
                      <IconButton size="small" onClick={handleOpen}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setEditingComment(!editingComment)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : postUserId === loggedInUser._id ? (
                    <>
                      <IconButton size="small" onClick={handleOpen}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setClicked(!clicked)}
                      >
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => setClicked(!clicked)}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              {editingComment ? (
                <>
                  <EditableCommentField
                    commentText={commentTextInput}
                    setCommentText={setCommentTextInput}
                    placeHolder="Don't leave this blank!"
                  />
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => setEditingComment(false)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        float: "right",
                        borderRadius: "3rem",
                        marginLeft: 1,
                        p: "4px 16px",
                      }}
                      onClick={() => {
                        editComment(_id, commentTextInput);
                        setEditingComment(!editComment);
                      }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </>
              ) : (
                <CommentText commentText={commentText} />
              )}
            </Box>
          </Stack>
        </Box>
      </Card>
      <RepliesSection
        onReplies={replies}
        onClicked={clicked}
        replyingTo={userName}
        loggedInUserImage={loggedInUser.picturePath}
        patchReplyComment={patchReplyComment}
        commentId={_id}
      />
    </>
  );
};

export default Comment;

import React, { useState } from "react";
import { Avatar, Button, Card, Stack } from "@mui/material";
import { Box } from "@mui/system";

import RepliesSection from "./RepliesSection";
import ConfirmDelete from "./ConfirmDelete";
import Username from "./Reusable/Username";
import CreatedAt from "./Reusable/CreatedAt";
import CommentText from "./Reusable/Comment/CommentText";
import EditableCommentField from "./Reusable/Comment/EditableCommentField";
import EditButton from "./Reusable/Buttons/TextButtons/EditButton";
import DeleteButton from "./Reusable/Buttons/TextButtons/DeleteButton";
import ReplyButton from "./Reusable/Buttons/TextButtons/ReplyButton";
import UpdateButton from "./Reusable/Buttons/BgButtons/UpdateButton";
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
  const { commentText, UserComment, replies, commentId, createdAt } = onPass;
  const userName = `${UserComment.firstName} ${UserComment.lastName} `;
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
        id={commentId}
        deleteComment={deleteComment}
      />
      <Card>
        <Box sx={{ p: "15px" }}>
          <Stack spacing={2} direction="row">
            <Box>{/* <ScoreChanger onScore={score} /> */}</Box>
            <Box sx={{ width: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  {online ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar src={UserComment.picturePath}></Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar src={UserComment.picturePath}></Avatar>
                  )}
                  <Username
                    userName={userName}
                    UserComment={UserComment}
                    loggedInUserId={loggedInUser._id}
                  />
                  <CreatedAt createdAt={createdAt} />
                </Stack>
                {loggedInUser._id === UserComment._id ? (
                  <Stack direction="row" spacing={1}>
                    <DeleteButton functionality={() => handleOpen()} />
                    <EditButton
                      functionality={() => setEditingComment(!editingComment)}
                      editingComment={editingComment}
                    />
                  </Stack>
                ) : postUserId === loggedInUser._id ? (
                  <Stack direction="row" spacing={1}>
                    {/* UserLoggedIn is a post owner but not comment owner */}
                    <DeleteButton functionality={() => handleOpen()} />
                    <ReplyButton functionality={() => setClicked(!clicked)} />
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1}>
                    {/* UserLoggedIn is not a post owner and comment owner */}
                    <ReplyButton functionality={() => setClicked(!clicked)} />
                  </Stack>
                )}

                {/* {postUserId === loggedInUser._id &&
                  loggedInUser._id !== UserComment._id && (
                    <Stack direction="row" spacing={1}>
                      <DeleteButton functionality={() => handleOpen()} />
                      <ReplyButton functionality={() => setClicked(!clicked)} />
                    </Stack>
                  )} */}

                {/* UserLoggedIn is not a post owner but comment owner */}
                {/* {postUserId !== loggedInUser._id &&
                  loggedInUser._id === UserComment._id && (
                    <Stack direction="row" spacing={1}>
                      <DeleteButton functionality={() => handleOpen()} />
                      <EditButton
                        functionality={() => setEditingComment(!editingComment)}
                        editingComment={editingComment}
                      />
                    </Stack>
                  )} */}

                {/* UserLoggedIn is not a post owner and comment owner */}
                {/* {postUserId !== loggedInUser._id &&
                  loggedInUser._id !== UserComment._id && (
                    <Stack direction="row" spacing={1}>
                      <ReplyButton functionality={() => setClicked(!clicked)} />
                    </Stack>
                  )} */}
              </Stack>
              {editingComment ? (
                <>
                  <EditableCommentField
                    commentText={commentTextInput}
                    setCommentText={setCommentTextInput}
                    placeHolder="Don't leave this blank!"
                  />

                  <UpdateButton
                    commentText={commentTextInput}
                    editingComm={editingComment}
                    setEditingComm={setEditingComment}
                    editComment={editComment}
                    commentId={commentId}
                  />
                  <Button
                    sx={{
                      float: "right",
                      bgcolor: palette.primary.main,
                      color: palette.background.alt,
                      borderRadius: "3rem",
                      p: "4px 16px",
                    }}
                    onClick={() => {
                      !commentText.trim()
                        ? alert(
                            "If  you want to remove the comment text, just delete the comment."
                          )
                        : setEditingComment(!editingComment);
                    }}
                  >
                    Cancel
                  </Button>
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
        commentId={commentId}
      />
    </>
  );
};
export default Comment;

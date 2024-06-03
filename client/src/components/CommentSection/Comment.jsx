import React, { useContext, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import CommentContext from "../../commentContext";
import ScoreChanger from "./ScoreChanger";
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
import { themeSettings } from "theme";

const Comment = ({ onPass }) => {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // const { id, content, createdAt, score, replies, user } = onPass;
  const { commentText, UserComment, replies, idComment, createdAt } = onPass;
  // const { IMGOBJ } = useContext(CommentContext);
  const userName = `${UserComment.firstName} ${UserComment.lastName} `;
  const loggedInUserId = useSelector((state) => state.auth.user._id);

  const [clicked, setClicked] = useState(false);
  const [editingComm, setEditingComm] = useState(false);
  const [commentTextInput, setCommentTextInput] = useState(commentText);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <ConfirmDelete onOpen={openModal} onClose={handleClose} id={idComment} />
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
                  <Avatar src={UserComment.picturePath}></Avatar>
                  <Username userName={userName} />
                  <CreatedAt createdAt={createdAt} />
                </Stack>
                {loggedInUserId === UserComment._id ? (
                  <Stack direction="row" spacing={1}>
                    <DeleteButton functionality={() => handleOpen()} />
                    <EditButton
                      functionality={() => setEditingComm(!editingComm)}
                      editingComm={editingComm}
                    />
                  </Stack>
                ) : (
                  <ReplyButton functionality={() => setClicked(!clicked)} />
                )}
              </Stack>
              {editingComm ? (
                <>
                  <EditableCommentField
                    commentText={commentTextInput}
                    setCommentText={setCommentTextInput}
                    placeHolder="Don't leave this blank!"
                  />

                  <UpdateButton
                    commentText={commentTextInput}
                    editingComm={editingComm}
                    setEditingComm={setEditingComm}
                  />
                  <Button
                    sx={{
                      float: "right",
                      bgcolor: "custom.moderateBlue",
                      color: "neutral.white",
                      p: "8px 25px",
                      "&:hover": {
                        bgcolor: "custom.lightGrayishBlue",
                      },
                    }}
                    onClick={() => {
                      !commentText.trim()
                        ? alert(
                            "If  you want to remove the comment text, just delete the comment."
                          )
                        : setEditingComm(!editingComm);
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
      {replies ? (
        <RepliesSection
          onReplies={replies}
          onClicked={clicked}
          onTar={userName}
        />
      ) : null}
    </ThemeProvider>
  );
};
export default Comment;

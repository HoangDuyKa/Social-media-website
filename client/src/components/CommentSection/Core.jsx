import React from "react";
import { Container, Stack } from "@mui/material";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { useSelector } from "react-redux";

const Core = ({
  patchComment,
  postId,
  deleteComment,
  editComment,
  patchReplyComment,
  postUserId,
  UserCommentImage,
}) => {
  const posts = useSelector((state) => state.app.posts);
  let comments = posts.find((post) => post._id === postId).comments;

  return (
    <Container maxWidth="md">
      <Stack spacing={1}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              onPass={comment}
              deleteComment={deleteComment}
              editComment={editComment}
              patchReplyComment={patchReplyComment}
              postUserId={postUserId}
            />
          );
        })}
        <AddComment
          patchComment={patchComment}
          UserCommentImage={UserCommentImage}
        />
      </Stack>
    </Container>
  );
};

export default Core;

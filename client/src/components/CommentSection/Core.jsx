import React, { useContext } from "react";
import { Container, Stack } from "@mui/material";
import Comment from "./Comment";
import AddComment from "./AddComment";
import CommentContext from "../../commentContext";
import { useSelector } from "react-redux";

const Core = ({ patchComment, postId }) => {
  const { commentSection } = useContext(CommentContext);
  const posts = useSelector((state) => state.app.posts);
  let comments = posts.find((post) => post._id === postId).comments;
  // console.log(commentSection);
  console.log(comments);

  return (
    <Container maxWidth="md">
      <Stack spacing={1}>
        {comments.map((comment) => {
          return <Comment key={comment.id} onPass={comment} />;
        })}
        <AddComment patchComment={patchComment} />
      </Stack>
    </Container>
  );
};

export default Core;

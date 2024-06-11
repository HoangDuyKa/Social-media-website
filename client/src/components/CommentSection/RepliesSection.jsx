import { Box, Card, Stack, Typography, Avatar, Button } from "@mui/material";
import React from "react";
import replyArrow from "assets/Images/icon-reply.svg";
import AddReply from "./AddReply";
import OwnReply from "./OwnReply";
import Username from "./Reusable/Username";
import { useSelector } from "react-redux";
import CreatedAt from "./Reusable/CreatedAt";
import StyledBadge from "components/StyledBadge";

const RepliesSection = ({
  onReplies,
  onClicked,
  replyingTo,
  loggedInUserImage,
  patchReplyComment,
  commentId,
}) => {
  // const addReply = (data) => {
  //   setReplies([
  //     ...repliess,
  //     {
  //       id: Math.floor(Math.random() * 10000),
  //       content: data,
  //       createdAt: "Just now",
  //       score: 0,
  //       replyingTo: `${replyingTo}`,
  //       replies: [],
  //       user: { username: "juliusomo" },
  //     },
  //   ]);
  // };
  // const deleteReply = (id) => {
  //   setReplies(repliess.filter((reply) => reply.id !== id));
  // };
  const loggedInUser = useSelector((state) => state.auth.user);
  const onlineUsers = useSelector((state) => state.app.onlineUsers);
  const online = onlineUsers.includes(loggedInUser._id);

  return (
    <Stack spacing={2} width="95%" alignSelf="flex-end">
      {/* <Stack spacing={2} width="800px" alignSelf="flex-end"> */}
      {onReplies.map((rep) => {
        const {
          replyCommentText,
          createdAt,
          score,
          UserReplyComment,
          replyCommentId,
          replyingTo,
        } = rep;
        const username = `${UserReplyComment.firstName} ${UserReplyComment.lastName}`;
        // loggedInUser._id === UserComment._id
        return username === "" ? (
          <OwnReply
            key={rep.id}
            comId={rep.id}
            onContent={replyCommentText}
            onTime={createdAt}
            onCount={score}
            onTar={replyingTo}
            // onDel={deleteReply}
          />
        ) : (
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }} key={rep.id}>
            <Box>
              <Stack spacing={2} direction="row">
                {/* <Box><ScoreChanger onScore={score} /></Box> */}
                <Box sx={{ width: "100%" }}>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      {online ? (
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar src={UserReplyComment.picturePath}></Avatar>
                        </StyledBadge>
                      ) : (
                        <Avatar src={loggedInUserImage}></Avatar>
                      )}
                      <Username
                        userName={username}
                        UserComment={UserReplyComment}
                        loggedInUserId={loggedInUser._id}
                      />
                      <CreatedAt createdAt={createdAt} />
                    </Stack>
                  </Stack>
                  <Typography
                    component="div"
                    sx={{ color: "neutral.grayishBlue", p: "1rem 0 0" }}
                  >
                    <Typography
                      sx={{
                        color: "custom.moderateBlue",
                        width: "fit-content",
                        display: "inline-block",
                        fontWeight: 500,
                      }}
                    >
                      {`@${replyingTo}`}
                    </Typography>{" "}
                    {replyCommentText}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>
        );
      })}
      {onClicked ? (
        <AddReply
          addReply={patchReplyComment}
          loggedInUserImage={loggedInUserImage}
          commentId={commentId}
          replyingTo={replyingTo}
        />
      ) : null}
    </Stack>
  );
};

export default RepliesSection;

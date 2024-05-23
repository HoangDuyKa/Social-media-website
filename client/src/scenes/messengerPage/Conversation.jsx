import { Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";

import ChatHeader from "./MsgComponents/ChatHeader";
import ChatFooter from "./MsgComponents/ChatFooter";
import Message from "./MsgComponents/Message";
import { useSelector } from "react-redux";
import NoChat from "assets/Illustration/NoChat";
import { Link } from "react-router-dom";

const Conversation = () => {
  const { current_conversation, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const theme = useTheme();
  // const messageListRef = useRef();
  // useEffect(() => {
  //   // Scroll to the bottom of the message list when new messages are added
  //   messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  // }, [current_messages]);

  return current_conversation ? (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/* Chat Header */}
      <ChatHeader />
      {/* Msg */}
      <Box
        // ref={messageListRef}
        width={"100%"}
        sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
      >
        <Message menu />
      </Box>
      {/* Chat Footer */}
      <ChatFooter />
    </Stack>
  ) : (
    <Stack
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
      alignItems="center"
      justifyContent={"center"}
    >
      <NoChat />
      <Typography variant="subtitle2">
        Select a conversation or start a{" "}
        <Link
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
          }}
          to="/"
        >
          new one
        </Link>
        <Message nonedisplay />
      </Typography>
    </Stack>
  );
};

export default Conversation;

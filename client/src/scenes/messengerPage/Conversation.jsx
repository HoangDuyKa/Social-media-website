import { Box, Stack } from "@mui/material";
import React from "react";

import ChatHeader from "./MsgComponents/ChatHeader";
import ChatFooter from "./MsgComponents/ChatFooter";
import Message from "./MsgComponents/Message";

const Conversation = () => {
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/* Chat Header */}
      <ChatHeader />
      {/* Msg */}
      <Box
        width={"100%"}
        sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
      >
        <Message menu />
      </Box>
      {/* Chat Footer */}
      <ChatFooter />
    </Stack>
  );
};

export default Conversation;

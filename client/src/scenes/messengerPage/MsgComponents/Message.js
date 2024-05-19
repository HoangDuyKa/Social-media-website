import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "Redux/Slice/conversation";
// import { Chat_History } from "data";

const Message = ({ menu }) => {
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  // console.log(messages, selectedConversation);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/messages/${selectedConversation._id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        dispatch(setMessages({ messages: data }));
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  let Chat_History = messages;

  console.log(messages);

  return (
    <Box m={3}>
      <Stack spacing={3}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case "divider":
              return <Timeline el={el} />;
            case "msg":
              switch (el.subtype) {
                case "doc":
                  return <DocMsg el={el} />;
                case "img":
                  return <MediaMsg el={el} />;
                case "link":
                  return <LinkMsg el={el} />;
                case "reply":
                  return <ReplyMsg el={el} />;
                default:
                  // text msg
                  return <TextMsg el={el} memu={menu} />;
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;

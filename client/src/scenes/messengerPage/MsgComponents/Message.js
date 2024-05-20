import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import {  setMessages } from "Redux/Slice/conversation";
import notificationSound from "assets/sounds/notification.mp3";
import { useSocketContext } from "SocketContext";

// import { Chat_History } from "data";

const Message = ({ menu }) => {
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const token = useSelector((state) => state.auth.token);

  const lastMessageRef = useRef();
  const dispatch = useDispatch();
  let Chat_History = messages

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
        console.log(data);
        if (data.error) throw new Error(data.error);
        dispatch(setMessages({ messages: data }));
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);



  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const { socket } = useSocketContext();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			// newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
      // let newMessages = Object.assign({}, [...messages, newMessage]);
      let newMessages = [...messages, newMessage];
      console.log(newMessages);
      dispatch(setMessages({ messages: newMessages }));
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);

  console.log(messages);

  return (
    <Box m={3}>
      <Stack spacing={3}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case "divider":
              return <Timeline key={el._id} el={el} />;
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
                  return <TextMsg key={el._id} el={el} memu={menu} ref={lastMessageRef} />;
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

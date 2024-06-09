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
import {
  FetchDirectConversations,
  setCurrentMessages,
} from "Redux/Slice/conversation";
import notificationSound from "assets/sounds/notification.mp3";
import { getSocket } from "socket";

// import { Chat_History } from "data";

const Message = ({ menu, nonedisplay }) => {
  const { current_messages, current_conversation, conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const token = useSelector((state) => state.auth.token);

  // const lastMessageRef = useRef();
  const dispatch = useDispatch();
  let Chat_History = current_messages;

  // console.log(messages, selectedConversation);
  const socket = getSocket();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/messages/${current_conversation.user_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        // console.log(data);
        if (data.error) throw new Error(data.error);
        console.log(data);
        dispatch(setCurrentMessages({ current_messages: data }));
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    };

    if (current_conversation?.user_id) getMessages();
  }, [current_conversation?.user_id, setCurrentMessages]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, 100);
  // }, [current_messages]);

  // const socket = getSocket();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      // newMessage.shouldShake = true;
      if (!document.hasFocus() || document.hasFocus()) {
        const sound = new Audio(notificationSound);
        sound.play();
      }
      // let newMessages = Object.assign({}, [...messages, newMessage]);
      let newMessages = [...current_messages, newMessage];
      // console.log(newMessages);
      if (
        current_conversation?.user_id === newMessage.senderId ||
        current_conversation === null
      ) {
        dispatch(setCurrentMessages({ current_messages: newMessages }));
      } else {
        dispatch(setCurrentMessages({ current_messages }));
        // if(conversations.unread){

        // }
        // let arrayConversations = [...conversations];
        // let newConversationss = arrayConversations.map((conversation) => {
        //   if (conversation.user_id !== current_conversation?.user_id) {
        //     // conversation.unread += 1;
        //     Object.assign(conversation, { unread: 1 });
        //     console.log(conversation);
        //   }
        //   return conversation;
        // });
        // console.log(newConversationss);
        // // dispatch(FetchDirectConversations({conversations: conversations}))
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, setCurrentMessages, current_messages]);

  // console.log(messages);

  return !nonedisplay ? (
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
                  return (
                    // <div key={el._id} ref={lastMessageRef}>
                    <TextMsg el={el} memu={menu} />
                    //</div>
                  );
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  ) : (
    <></>
  );
};

export default Message;

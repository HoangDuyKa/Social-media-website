import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation =
        action.payload.current_conversation;
    },
    setCurrentMessages(state, action) {
      const messages = action.payload.current_messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.message,
        receiverId: el.receiverId,
        senderId: el.senderId,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: user.picturePath,
          msg: el.messages ? el.messages.slice(-1)[0]?.message : "",
          time: "9:36",
          unread: user.unread ? user.unread : 0,
          pinned: false,
          about: user?.about,
        };
      });
      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            console.log(el?.id !== this_conversation._id);
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            console.log("hahaah");
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
  },
});
export const { setCurrentMessages } = conversationSlice.actions;

export default conversationSlice.reducer;

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    // console.log(getState().conversation.direct_chat);
    dispatch(
      conversationSlice.actions.fetchDirectConversations({ conversations })
    );
  };
};


export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.setCurrentConversation(current_conversation)
    );
  };
};



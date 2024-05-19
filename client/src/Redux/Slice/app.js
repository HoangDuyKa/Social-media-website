import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  posts: [],
  rightBarChat: { open: false, type: "CONTACT" },
  onlineUsers: [],
};

export const authSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    toggleRightbar: (state) => {
      state.rightBarChat.open = !state.rightBarChat.open;
    },
    updateRightBarType: (state, action) => {
      state.rightBarChat.type = action.payload.type;
      // state.rightBarChat.type = !state.rightBarChat.type;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload.onlineUsers;
    },
  },
});

export const {
  setMode,
  setPosts,
  setPost,
  toggleRightbar,
  updateRightBarType,
  setOnlineUsers,
} = authSlice.actions;
export default authSlice.reducer;

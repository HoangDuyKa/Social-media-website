import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  posts: [],
  rightBarChat: { open: false, type: "CONTACT" },
  onlineUsers: [],
  users: [],
  // all_users: [],
  friends: [], // all friends
  friendRequests: [], // all friend requests
  searchResults: [], // all search results
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.searchResults;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }
        return post;
      });
      // console.log(updatedPosts);
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
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    // updateAllUsers(state, action) {
    //   state.all_users = action.payload.users;
    // },
    // updateFriends(state, action) {
    //   state.friends = action.payload.friends;
    // },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.friendRequests;
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
  updateUsers,
  setSearchResults,
} = appSlice.actions;
export default appSlice.reducer;

export function FetchUsers() {
  return async (dispatch, getState) => {
    const response = await fetch(`http://localhost:3001/users/get-users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getState().auth.token}` },
    });
    const data = await response.json();
    dispatch(appSlice.actions.updateUsers({ users: data.data }));
  };
}

// export function FetchAllUsers() {
//   return async (dispatch, getState) => {
//     await fetch
//       .get(
//         "/user/get-all-verified-users",

//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getState().auth.token}`,
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response);
//         dispatch(
//           appSlice.actions.updateAllUsers({ users: response.data.data })
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// }
// export function FetchFriends() {
//   return async (dispatch, getState) => {
//     await fetch(
//       "http://localhost:3001/users/get-friends",

//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getState().auth.token}`,
//         },
//       }
//     )
//       .then((response) => {
//         console.log(response);
//         dispatch(
//           appSlice.actions.updateFriends({ friends: response.data.data })
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// }
export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    const response = await fetch("http://localhost:3001/users/get-requests", {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    const data = await response.json();
    dispatch(
      appSlice.actions.updateFriendRequests({ friendRequests: data.data })
    );
  };
}

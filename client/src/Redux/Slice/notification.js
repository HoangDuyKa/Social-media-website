import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    addNotification: (state, action) => {
      // const notificationExists = state.notifications.find(
      //   (notification) => notification.placeId === action.payload.placeId
      // );

      // if (notificationExists) {
      //   // Update existing notification
      //   state.notifications = state.notifications.map((notification) =>
      //     notification.placeId === action.payload.placeId
      //       ? action.payload
      //       : notification
      //   );
      // } else {
      //   // Add new notification
      //   state.notifications.push(action.payload);
      // }
      const existingIndex = state.notifications.findIndex(
        (notification) => notification.placeId === action.payload.placeId
      );

      if (existingIndex !== -1) {
        // Remove the existing notification
        state.notifications.splice(existingIndex, 1);
      }

      // Add the new or updated notification at the top
      state.notifications.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
    },
  },
});

export const { addNotification, markAsRead, setNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;

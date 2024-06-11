import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateNotificationStatus = createAsyncThunk(
  "notifications/updateNotificationStatus",
  async ({ id, isRead }, { getState, dispatch }) => {
    const token = getState().auth.token; // Adjust to your auth state path

    const response = await fetch(
      `http://localhost:3001/notifications/updateNotification/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update notification status");
    }

    const updatedNotification = await response.json();
    return updatedNotification;
  }
);

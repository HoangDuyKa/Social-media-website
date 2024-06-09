// import { setOnlineUsers } from "Redux/Slice/app";
// import io from "socket.io-client";

// let socket;

// export const initializeSocket = (userId, dispatch) => {
//   if (socket) {
//     socket.close();
//   }

//   socket = io("http://localhost:3001/", {
//     query: { userId },
//   });

//   socket.on("getOnlineUsers", (users) => {
//     dispatch(setOnlineUsers({ onlineUsers: users }));
//   });

//   socket.on("disconnect", () => {
//     socket = null;
//   });

//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.close();
//     socket = null;
//   }
// };

import { setOnlineUsers } from "Redux/Slice/app";
import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId, dispatch) => {
  if (socket) {
    socket.disconnect();
  }
  socket = io("http://localhost:3001/", {
    query: { userId },
    transports: ["websocket"], // Ensure WebSocket is used
    reconnectionAttempts: 5, // Number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts
  });

  socket.on("connection", () => {
    console.log("Connected to the server");
  });

  socket.on("getOnlineUsers", (users) => {
    dispatch(setOnlineUsers({ onlineUsers: users }));
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${reason}`);
    if (reason === "io server disconnect") {
      // The server disconnected the client
      socket.connect(); // Reconnect manually
    }
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

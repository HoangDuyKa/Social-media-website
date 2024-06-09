import {
  initializeSocket as initializeSocketClient,
  disconnectSocket as disconnectSocketClient,
} from "../../socket";

export const initializeSocket = (userId) => (dispatch) => {
  initializeSocketClient(userId, dispatch);
};

export const disconnectSocket = () => () => {
  disconnectSocketClient();
};

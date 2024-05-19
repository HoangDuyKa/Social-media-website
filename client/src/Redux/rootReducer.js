import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import appReducer from "./Slice/app";
import authReducer from "./Slice/auth";
import conversationReducer from "./Slice/conversation";

const persistConfig = { key: "root", storage, version: 1 };

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
});

export { persistConfig, rootReducer };

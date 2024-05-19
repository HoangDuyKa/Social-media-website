import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "./Redux/store";
import { SocketContextProvider } from "SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContextProvider>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <App />
        </PersistGate>
      </SocketContextProvider>
    </Provider>
  </React.StrictMode>
);

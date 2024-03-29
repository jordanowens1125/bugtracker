import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./Context/AuthContext";
import { MessageContextProvider } from "./Context/MessageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <MessageContextProvider>
      <App />
    </MessageContextProvider>
  </AuthContextProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Web3Provider from "./providers/Web3Provider";
import FeedbackProvider from "./providers/FeedbackProvider";
// test acc github
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <FeedbackProvider>
        <App />
      </FeedbackProvider>
    </Web3Provider>
  </React.StrictMode>
);

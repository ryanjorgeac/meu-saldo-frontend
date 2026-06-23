import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "inter-ui/inter.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import { logServiceMode } from "./services";

logServiceMode();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

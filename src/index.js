import React from "react";
import ReactDOM from "react-dom";
import { ToastProvider } from "react-toast-notifications";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { DataProvider, AuthProvider } from "./Providers";
import "bootstrap/dist/css/bootstrap.min.css";
import "./global.css";

ReactDOM.render(
  <AuthProvider>
    <DataProvider>
      <Router>
        <ToastProvider
          autoDismiss
          placement="top-center"
          autoDismissTimeout={3000}
        >
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </ToastProvider>
      </Router>
    </DataProvider>
  </AuthProvider>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { DataProvider, AuthProvider } from "./Providers";
import "bootstrap/dist/css/bootstrap.min.css";
import "./global.css";

ReactDOM.render(
  <AuthProvider>
    <DataProvider>
      <Router>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Router>
    </DataProvider>
  </AuthProvider>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { DataProvider } from "./Providers";
import "./global.css";

ReactDOM.render(
  <DataProvider>
    <Router>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </DataProvider>,
  document.getElementById("root")
);

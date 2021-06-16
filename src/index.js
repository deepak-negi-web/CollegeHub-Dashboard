import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DataProvider } from "./Providers";
ReactDOM.render(
  <DataProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DataProvider>,
  document.getElementById("root")
);

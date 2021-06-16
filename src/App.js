import React from "react";
import { Header, Main } from "./Section";
import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
import "./tableStyle.css";

function App() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}

export default App;
